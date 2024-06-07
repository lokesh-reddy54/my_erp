'use strict';

var Q = require('q');
var _ = require('underscore');
var Op = require("sequelize").Op;
var Sequelize = require("sequelize");
var request = require('request-promise');
var moment = require("moment");

var config = require('../utils/config').config;
var session = require("./session");
var serviceSession = require("../services/session");
var log = require('../utils/log').log;
var utils = require('../utils/utils').utils;
var systemUtils = require('./utils/system_util').utils;

var Constants = require("./models/constants");
var Booking = require("./models/base").Booking;
var Client = require("./models/base").Client;
var Office = require("./models/base").Office;
var Cabin = require("./models/base").Cabin;
var Desk = require("./models/base").Desk;
var Location = require("./models/base").Location;
var Ticket = require("./models/base").Ticket;
var TicketAttachment = require("./models/base").TicketAttachment;
var TicketAssignmentHistory = require("./models/base").TicketAssignmentHistory;
var TicketStatusHistory = require("./models/base").TicketStatusHistory;
var TicketMessage = require("./models/base").TicketMessage;
var TicketCategory = require("./models/base").TicketCategory;
var TicketSubCategory = require("./models/base").TicketSubCategory;
var TicketContext = require("./models/base").TicketContext;
var Priority = require("./models/base").Priority;
var User = require("./models/base").User;
var UserRole = require("./models/base").UserRole;
var Call = require("./models/base").Call;
var Mail = require("./models/base").Mail;
var UserMessage = require("./models/base").UserMessage;
var ClientEmployee = require("./models/base").ClientEmployee;

var services = require("./services").service;
var mailsService = require("./mails").service;

var service = {};

// ####################### Start of Tickets ################################
service.listTickets = async (data) => {
  try {
    log.write("SupportService ::: listTickets :: data : ", data);
    var where = {};
    if (data.filters.category && data.filters.category != '') {
      where['category'] = data.filters.category;
    }
    if (data.filters.priority && data.filters.priority != '') {
      where['priority'] = data.filters.priority;
    }
    if (data.filters.status && data.filters.status != '') {
      where['status'] = data.filters.status;
    }
    if (data.filters.setAside) {
      where['setAside'] = 1;
    } else {
      where['setAside'] = 0;
    }
    var statuses = [];
    if (data.filters.statuses && data.filters.statuses != '') {
      statuses.push({ $in: data.filters.statuses });
    }
    if (data.filters.excludeStatuses && data.filters.excludeStatuses.length) {
      statuses.push({ $notIn: data.filters.excludeStatuses });
    }
    if (statuses.length) {
      where['status'] = { $and: statuses };
    }
    if (data.filters.pendingClosed && data.filters.pendingClosed != '') {
      where['status'] = { $notIn: ['Closed'] };
    }
    if (data.filters.assignedTo && data.filters.assignedTo != '') {
      where['assignedTo'] = data.filters.assignedTo;
    }
    if (data.filters.bookingId && data.filters.bookingId != '') {
      where['$booking.id$'] = data.filters.bookingId;
    }
    if (data.filters.clientId && data.filters.clientId != '') {
      where['$booking.clientId$'] = data.filters.clientId;
    }
    if (data.filters.buildingIds && data.filters.buildingIds.length) {
      where['$booking.office.buildingId$'] = { $in: data.filters.buildingIds };
    }
    if (data.filters.search) {
      var query = data.filters;
      var $or = [];
      $or.push(Sequelize.where(Sequelize.fn('lower', Sequelize.literal('tickets.refNo')), {
        $like: query.search.toLowerCase() + "%"
      }))
      $or.push(Sequelize.where(Sequelize.fn('lower', Sequelize.literal('assigned.name')), {
        $like: query.search.toLowerCase() + "%"
      }))
      $or.push(Sequelize.where(Sequelize.fn('lower', Sequelize.literal('`booking->client`.name')), {
        $like: query.search.toLowerCase() + "%"
      }))
      $or.push(Sequelize.where(Sequelize.fn('lower', Sequelize.literal('`booking->client`.company')), {
        $like: query.search.toLowerCase() + "%"
      }))
      $or.push(Sequelize.where(Sequelize.fn('lower', Sequelize.literal('booking.refNo')), {
        $like: query.search.toLowerCase() + "%"
      }))
      $or.push(Sequelize.where(Sequelize.fn('lower', Sequelize.literal('`booking->client`.phone')), {
        $like: query.search.toLowerCase() + "%"
      }))
      where['$and'] = { $or: $or }
    }
    var tickets = await Ticket.findAll({
      where: where,
      include: [{ as: 'priority', model: Priority }, { as: 'assigned', model: User, attributes: ['name', 'active'] },
        { as: 'lastMsg', model: TicketMessage, attributes: ['reply', 'from', 'to', 'id', 'ticketId', 'userId'] },
        {
          as: 'booking',
          model: Booking,
          attributes: ['offices', 'refNo'],
          include: [{ as: 'office', model: Office, attributes: ['name', 'buildingId'] },
            { as: 'client', model: Client, attributes: ['name', 'company', 'phone'] }
          ]
        }
      ],
      offset: data.offset,
      limit: data.limit,
      order: [
        ['id', 'desc']
      ]
    });
    log.write("SupportService ::: listTickets :: tickets count : " + tickets.length);

    return tickets;
  } catch (e) {
    log.write("SupportService ::: listTickets :: exception : ", e);
    throw (e);
  }
}
service.saveTicket = async (data, username) => {
  var ticket = {};
  try {
    log.write("SupportService ::: saveTicket :: data : ", data);
    data.updated = new Date();
    data.updatedBy = username || '';
    if (data.id) {
      await Ticket.update(data, { where: { id: data.id } });
      ticket = data;

      if (data.statusChange) {
        if (data.status == 'Attended' || data.status == 'Resolved' || data.status == 'Closed') {
          service.sendTicketStatusChangeMail(data.id);
        }
        TicketStatusHistory.create({ ticketId: data.id, status: data.status, date: new Date(), user: username });
      }
      if (data.reassign) {
        TicketAssignmentHistory.create({ ticketId: data.id, userId: data.assignedTo, date: new Date() });

        var ticket = await Ticket.findOne({ where: { id: data.id }, attributes: ['refNo', 'description'] })
        services.sendNotifications("New ticket " + ticket.refNo + " is assigned", ticket.description, null, [data.assignedTo, 1], ticket.companyId)

        service.sendNewTicketMail(data.id);
      }
    } else {
      data.date = new Date();
      data.status = "New";
      if (!data.issue) {
        data.issue = data.category + ", " + data.subCategory + ", " + data.context;
      }
      ticket = await Ticket.create(data);
      ticket.set('refNo', 'ST' + (100000 + ticket.id));

      var priority = await Priority.findOne({ where: { id: ticket.priorityId } });

      var expectedTime = utils.moment(ticket.date).add(priority.attendIn, priority.attendInType);
      // log.write("SupportService ::: saveTicket :: expectedAttended : ", expectedTime.format());
      ticket.set("expectedAttended", expectedTime.toDate());

      expectedTime = utils.moment(ticket.date).add(priority.resolveIn, priority.resolveInType);
      // log.write("SupportService ::: saveTicket :: expectedResolved : ", expectedTime);
      ticket.set("expectedResolved", expectedTime.toDate());

      expectedTime = utils.moment(ticket.date).add(priority.closeIn, priority.closeInType);
      // log.write("SupportService ::: saveTicket :: expectedClosed : ", expectedTime);
      ticket.set("expectedClosed", expectedTime.toDate());
      ticket.save();

      _.each(data.attachments, function(a) {
        if (a) {
          TicketAttachment.create({ ticketId: ticket.id, docId: a.id });
        }
      })

      await service.assignTicket(ticket.id);

      ticket = await service.getTicket(ticket.id);
    }
    return ticket;
  } catch (e) {
    log.write("SupportService ::: saveTicket :: exception : ", e);
    if (ticket.id) {
      ticket = await service.getTicket(ticket.id);
      return ticket;
    } else {
      throw (e);
    }
  }
}
service.assignTicket = async (id) => {
  try {
    var ticket = await Ticket.findOne({
      where: { id: id },
      include: ['ticketContext',
        {
          as: 'booking',
          model: Booking,
          attributes: ['id'],
          include: [{ as: 'office', model: Office, attributes: ['buildingId'] }]
        }
      ]
    });
    var where = {
      assigneeTypes: { $like: '%' + ticket.ticketContext.assigneeType + '%' },
      supportLevel: ticket.ticketContext.supportLevel,
      '$user.active$': 1,
      '$user.companyId$': ticket.companyId
    }
    log.write("SupportService ::: assignTicket :: condition : ", where);
    var userRoles = await UserRole.findAll({
      where: where,
      include: ['user']
    });
    log.write("SupportService ::: assignTicket :: userRoles : ", userRoles.length);
    var buildingUsers = [];
    _.each(userRoles, function(ur) {
      if (ur.buildingIds) {
        var buildingIds = ur.buildingIds.split(",");
        if (buildingIds.indexOf(ticket.booking.office.buildingId) > -1) {
          buildingUsers.push(ur.userId);
        }
      }
    })
    var userIds = _.map(userRoles, 'userId');
    if (buildingUsers.length) {
      userIds = buildingUsers;
    }
    if (!userIds.length) {
      userRoles = await UserRole.findAll({
        where: {
          assigneeTypes: { $like: '%GST%' },
          '$user.active$': 1,
          supportLevel: ticket.ticketContext.supportLevel,
          '$user.companyId$': ticket.companyId
        },
        include: ['user']
      });
      userIds = _.map(userRoles, 'userId');
    }

    if (userIds && userIds.length) {
      var sql = `select u.id,name, count(t.id) from users u
                left join tickets t on u.id = t.assignedTo
                where u.id in (` + userIds.join(",") + `) and u.active=1 
                group by u.id
                order by count(t.id)`;
      var results = await session.db.query(sql, { type: Sequelize.QueryTypes.SELECT });
      log.write("SupportService ::: assignTicket :: user results : ", results);
      if (results.length) {
        ticket.set('assignedTo', results[0].id);
        await ticket.save();

        services.sendNotifications("New ticket " + ticket.refNo + " is assigned", ticket.description, null, [results[0].id, 1], ticket.companyId)

        TicketAssignmentHistory.create({ ticketId: id, userId: results[0].id, date: new Date() });
        service.sendNewTicketMail(id);
      }
    } else {
      throw ("No support member is available to assign to this ticket.")
    }
  } catch (e) {
    log.write("SupportService ::: assignTicket :: exception : ", e);
    throw (e);
  }
}
service.getSupportUsers = async (data) => {
  try {
    log.write("SupportService ::: getSupportUsers :: data : ", data);
    var userRoles = await UserRole.findAll({
      where: {
        assigneeTypes: { $like: '%' + data.assigneeType + '%' },
        supportLevel: data.supportLevel,
        '$user.active$': 1,
        '$user.companyId$': data.companyId
      },
      include: [{ as: 'user', model: User, attributes: ['id', 'name', 'email'] }]
    });
    log.write("SupportService ::: getSupportUsers :: userRoles : ", userRoles.length);

    var users = [];
    _.each(userRoles, function(r) {
      users.push(r.user);
    })
    return users;
  } catch (e) {
    log.write("SupportService ::: assignTicket :: exception : ", e);
    throw (e);
  }
}
service.getManagerUsers = async (data) => {
  try {
    log.write("SupportService ::: getManagerUsers :: data : ", data);
    var userRoles = await UserRole.findAll({
      where: {
        '$role.enum$': { $like: '%_MANAGER%' },
        '$user.companyId$': data.companyId
      },
      include: ['role', { as: 'user', model: User, attributes: ['id', 'name', 'email'] }]
    });
    log.write("SupportService ::: getManagerUsers :: userRoles : ", userRoles.length);

    var users = [];
    _.each(userRoles, function(r) {
      r = r.toJSON();
      // log.write("SupportService ::: getManagerUsers :: userRole : ", r);
      var user = r.user;
      user.role = r.role.enum;
      users.push(user);
    })
    return users;
  } catch (e) {
    log.write("SupportService ::: getManagerUsers :: exception : ", e);
    throw (e);
  }
}

service.getTicket = async (id) => {
  try {
    log.write("SupportService ::: getTicket :: id : ", id);
    var result = await Ticket.findOne({
      where: { id: id },
      include: ['attachments', { as: 'clientEmployee', model: ClientEmployee, attributes: ['id', 'name', 'email', 'phone'] },
        { as: 'assigned', model: User, attributes: ['id', 'name', 'active'] }, {
          as: 'booking',
          model: Booking,
          attributes: ['refNo', 'started', 'status'],
          include: ['office', { as: 'client', model: Client, attributes: ['name', 'phone', 'email', 'company'] }]
        }, { as: 'messages', model: TicketMessage, include: ['attachment'] }, 'ticketContext', 'priority', 'cabin', 'statusHistory',
        { as: 'assignmentHistory', model: TicketAssignmentHistory, required: false, include: [{ as: 'user', model: User, attributes: ['id', 'name'] }] },
      ]
    })
    result = result.toJSON();
    var cabin = result.cabin;
    delete result.cabin;
    var ticket = result;
    if (cabin) {
      ticket.cabin = cabin.name + ", " + result.booking.office.name;
    }
    ticket.location = await systemUtils.getLocation(result.booking.office.locationId);

    var priorities = [],
      inTime = "";
    var priority = ticket.priority;
    var expectedTime = utils.moment(ticket.date).add(priority.attendIn, priority.attendInType);
    var _priority = {
      type: "Attend",
      expectedTime: expectedTime.format("MMM DD, YYYY hh:mm a"),
    }
    if (ticket.attended) {
      if (utils.moment(ticket.attended).isBefore(expectedTime)) {
        inTime = "InTime";
      } else {
        inTime = "Not InTime";
      }
      _priority.actualTime = utils.moment(ticket.attended).format("MMM DD, YYYY hh:mm a");
      _priority.inTime = inTime;
    } else if (utils.moment().isAfter(expectedTime)) {
      _priority.inTime = "Not InTime";
    }
    priorities.push(_priority);

    expectedTime = utils.moment(ticket.date).add(priority.resolveIn, priority.resolveInType);
    _priority = {
      type: "Resolve",
      expectedTime: expectedTime.format("MMM DD, YYYY hh:mm a"),
    }
    if (ticket.resolved) {
      if (utils.moment(ticket.resolved).isBefore(expectedTime)) {
        inTime = "InTime";
      } else {
        inTime = "Not InTime";
      }
      _priority.actualTime = utils.moment(ticket.resolved).format("MMM DD, YYYY hh:mm a");
      _priority.inTime = inTime;
    } else if (utils.moment().isAfter(expectedTime)) {
      _priority.inTime = "Not InTime";
    }
    priorities.push(_priority);

    expectedTime = utils.moment(ticket.date).add(priority.closeIn, priority.closeInType);
    _priority = {
      type: "Close",
      expectedTime: expectedTime.format("MMM DD, YYYY hh:mm a"),
    }
    if (ticket.closed) {
      if (utils.moment(ticket.closed).isBefore(expectedTime)) {
        inTime = "InTime";
      } else {
        inTime = "Not InTime";
      }
      _priority.actualTime = utils.moment(ticket.closed).format("MMM DD, YYYY hh:mm a");
      _priority.inTime = inTime;
    } else if (utils.moment().isAfter(expectedTime)) {
      _priority.inTime = "Not InTime";
    }
    priorities.push(_priority);
    ticket.priorities = priorities;

    return ticket;
  } catch (e) {
    log.write("SupportService ::: getTicket :: exception : ", e);
    throw (e);
  }
}

service.getTicketMessages = async (ticketId) => {
  try {
    log.write("APIService ::: getTicketMessages :: ticketId : ", ticketId);
    var where = { ticketId: ticketId };
    var messages = await TicketMessage.findAll({
      where: where,
      include: ['attachment'],
      order: [
        ['id', 'desc']
      ]
    });
    return messages;
  } catch (e) {
    log.write("APIService ::: getTicketMessages :: exception : ", e);
    throw (e);
  }
}
service.getTicketMails = async (ticketId) => {
  try {
    log.write("APIService ::: getTicketMails :: ticketId : ", ticketId);
    var where = { id: ticketId };
    var ticket = await Ticket.findOne({
      where: where,
      include: [{
        as: 'mails',
        model: Mail,
        attributes: ['id', 'receivers', 'subject', 'date', 'from', 'body', 'by']
      }],
      order: [
        ['id', 'desc']
      ]
    });
    return ticket.mails;
  } catch (e) {
    log.write("APIService ::: getTicketMails :: exception : ", e);
    throw (e);
  }
}
service.getTicketCalls = async (ticketId) => {
  try {
    log.write("APIService ::: getTicketCalls :: ticketId : ", ticketId);
    var where = { ticketId: ticketId };
    var _calls = await Call.findAll({
      where: where,
      order: [
        ['id', 'desc']
      ]
    });
    var calls = [];
    _calls.forEach(async (p) => {
      var call = {};
      call.id = p.id;
      call.type = p.type;
      call.from = p.from;
      call.to = p.to;
      call.started = p.started;
      if (p.status == "Done") {
        call.duration = moment(p.ended).diff(moment(p.started), 'minutes') + " mins";
      } else {
        call.duration = "-";
      }
      call.status = p.status;
      calls.push(call);
    });
    return calls;
  } catch (e) {
    log.write("APIService ::: getTicketCalls :: exception : ", e);
    throw (e);
  }
}
service.deleteTicket = async (id) => {
  try {
    log.write("SupportService ::: deleteTicket :: id : ", id);
    var result = await Ticket.destroy({ where: { id: id } })
    return result;
  } catch (e) {
    log.write("SupportService ::: deleteTicket :: exception : ", e);
    throw (e);
  }
}
service.saveTicketMessage = async (data) => {
  try {
    log.write("SupportService ::: saveTicketMessage :: data : ", data);
    var message = {};
    if (data.id) {
      TicketMessage.update(data, { where: { id: data.id } });

      if (data.read && data.ticketId) {
        await UserMessage.update({ read: 1 }, { where: { ticketId: data.ticketId, messageId: data.id } })
      }
      message = data;
    } else {
      data.date = new Date();
      data.status = "Sent";
      message = await TicketMessage.create(data);
      if (data.to == "Client") {
        await Ticket.update({ status: 'AwaitingClientReply' }, { where: { id: data.ticketId } });
      } else if (data.from != 'Client' && data.to == "InternalTeam" || data.to == "Manager") {
        await Ticket.update({ status: 'Attended' }, { where: { id: data.ticketId } });
      } else {
        await Ticket.update({ status: 'AwaitingInternalReply' }, { where: { id: data.ticketId } });
      }

      Ticket.update({ lastMsgId: message.id }, { where: { id: message.ticketId } })

      if (data.userId) {
        UserMessage.create({
          toUser: data.userId,
          message: data.reply,
          ticketId: data.ticketId,
          messageId: message.id,
          module: 'Support',
          from: data.by,
          date: data.date,
          read: 0
        })
      }
      service.sendTicketMessageMail(message.id);
    }
    return message;
  } catch (e) {
    log.write("SupportService ::: saveTicketMessage :: exception : ", e);
    throw (e);
  }
}

service.getCategories = async () => {
  try {
    var categories = await TicketCategory.findAll({
      where: { active: 1 },
      include: [{
        as: 'subCategories',
        model: TicketSubCategory,
        include: [{ as: 'contexts', required: false, model: TicketContext, include: ['priority'] }]
      }]
    })
    return categories;
  } catch (e) {
    log.write("SupportService ::: getCategories:: exception: ", e);
    throw (e);
  }
}
service.getPriorities = async () => {
  try {
    var priorities = await Priority.findAll({
      where: { active: 1 }
    })
    _.each(priorities, function(s) {
      s.attendIn = s.attendIn + " " + s.attendInType;
      s.resolveIn = s.resolveIn + " " + s.resolveInType;
      s.closeIn = s.closeIn + " " + s.closeInType;
    })
    return priorities;
  } catch (e) {
    log.write("SupportService ::: getPriorities:: exception: ", e);
    throw (e);
  }
}

service.saveTicketCategory = async (data, username) => {
  try {
    log.write("SupportService ::: saveTicketCategory :: data : ", data);
    var item = {};
    data.updated = new Date();
    data.updatedBy = username || 'system';
    if (data.id) {
      TicketCategory.update(data, { where: { id: data.id } })
      item = data;
    } else {
      item = await TicketCategory.create(data);
    }
    return item;
  } catch (e) {
    log.write("SupportService ::: saveTicketCategory :: exception : ", e);
    throw (e);
  }
}
service.saveTicketSubCategory = async (data, username) => {
  try {
    log.write("SupportService ::: saveTicketSubCategory :: data : ", data);
    var item = {};
    data.updated = new Date();
    data.updatedBy = username || 'system';
    if (data.id) {
      TicketSubCategory.update(data, { where: { id: data.id } })
      item = data;
    } else {
      item = await TicketSubCategory.create(data);
    }
    return item;
  } catch (e) {
    log.write("SupportService ::: saveTicketSubCategory :: exception : ", e);
    throw (e);
  }
}
service.saveTicketContext = async (data, username) => {
  try {
    log.write("SupportService ::: saveTicketContext :: data : ", data);
    var item = {};
    data.updated = new Date();
    data.updatedBy = username || 'system';
    if (data.id) {
      TicketContext.update(data, { where: { id: data.id } })
      item = data;
    } else {
      item = await TicketContext.create(data);
    }
    return item;
  } catch (e) {
    log.write("SupportService ::: saveTicketContext :: exception : ", e);
    throw (e);
  }
}
service.savePriority = async (data, username) => {
  try {
    log.write("SupportService ::: savePriority :: data : ", data);
    var item = {};
    data.updated = new Date();
    data.updatedBy = username || 'system';
    if (data.id) {
      Priority.update(data, { where: { id: data.id } })
      item = data;
    } else {
      data.active = 1;
      item = await Priority.create(data);
    }
    return item;
  } catch (e) {
    log.write("SupportService ::: savePriority :: exception : ", e);
    throw (e);
  }
}

service.sendTicketMessageMail = async (messageId) => {
  try {
    var message = await TicketMessage.findOne({
      where: { id: messageId },
      include: [{
        as: 'ticket',
        model: Ticket,
        include: ['company', 'assigned', { as: 'booking', model: Booking, include: ['client'] }]
      }]
    });
    var msg = "You have got below new message from " + message.ticket.booking.client.name + " client " + message.by + " on " + utils.moment(message.date).format("MMM DD, YYYY hh:mm a");
    msg = msg + '<br><br> Please login to your Support Portal and act accordingly.';

    var data = {
      name: message.ticket.booking.client.name,
      msg: msg,
      teamName: message.ticket.company.name + " Support",
      supportPhone: message.ticket.company.supportPhone,
      supportEmail: message.ticket.company.supportEmail
    }
    var receivers = [];
    if (message.to == "Client") {
      // var msg = "You have a new message from " + message.ticket.company.name + " Support member " + message.by + " on " + utils.moment(message.date).format("MMM DD, YYYY hh:mm a");
      // msg = msg + '<br><br>Please login to your Selfcare Portal and act accordingly.';

      msg = "You have a new message for " + message.ticket.refNo + " waiting for your action in the Self Care Portal. <a href='" + config.selfcareUrl + "'>" + config.selfcareUrl + "</a>";
      data.msg = msg;
      data.name = message.ticket.booking.client.name;

      var clientEmployee;
      if (message.ticket.clientEmployeeId) {
        clientEmployee = await ClientEmployee.findOne({ where: { id: message.ticket.clientEmployeeId } });
      }
      if (clientEmployee) {
        data.name = clientEmployee.name;
        receivers.push({
          ticketId: message.ticket.id,
          bookingId: message.ticket.booking.id,
          name: clientEmployee.name,
          email: clientEmployee.email,
        })
      } else {
        receivers.push({
          ticketId: message.ticket.id,
          bookingId: message.ticket.booking.id,
          name: message.ticket.booking.client.name,
          email: message.ticket.booking.client.email,
        })
      }
    } else if (message.from == "Client" || message.from == "Manager" || message.from == "Internal") {
      msg = "You have got below new message from " + message.by + " on " + utils.moment(message.date).format("MMM DD, YYYY hh:mm a");
      msg = msg + '<br><br> Please login to your Support Portal and act accordingly.';
      data.msg = msg;
      if (message.userId) {
        var user = await systemUtils.getUserById(message.userId);

        data.name = message.ticket.assigned.name;
        receivers.push({
          ticketId: message.ticket.id,
          bookingId: message.ticket.booking.id,
          name: user.name,
          email: user.email,
        })

        services.sendNotifications(message.ticket.refNo + " got new ticket message", msg, null, [user.id, 1], message.ticket.companyId)
      } else {
        data.name = message.ticket.assigned.name;
        receivers.push({
          ticketId: message.ticket.id,
          bookingId: message.ticket.booking.id,
          name: message.ticket.assigned.name,
          email: message.ticket.assigned.email,
        })
        services.sendNotifications(message.ticket.refNo + " got new ticket message", msg, null, [message.ticket.assigned.id, 1], message.ticket.companyId)
      }
    }


    if (receivers.length) {
      log.write("MailsService ::: sendTicketMessageMail :: data : ", data);
      log.write("MailsService ::: sendTicketMessageMail :: receivers : ", receivers);
      var mailBody = await services.getMailBody("emails/context_notification.html", data);
      log.write("MailsService ::: sendTicketMessageMail :: mailBody : ", mailBody.length);

      return await services.sendMail(message.ticket.company.name + " :: Support Ticket (" + message.ticket.refNo + ") got new message", mailBody, receivers);
    }
  } catch (e) {
    log.write("MailsService ::: sendTicketMessageMail :: exception : ", e);
    throw (e);
  }
}
service.sendNewTicketMail = async (ticketId) => {
  try {
    var ticket = await Ticket.findOne({
      where: { id: ticketId },
      include: ['company', 'assigned', { as: 'booking', model: Booking, include: ['client'] }]
    });
    var msg = "A new ticket from " + ticket.booking.client.company + " on " + utils.moment(ticket.date).format("MMM DD, YYYY hh:mm a") + " is assigned to you. ";
    msg = msg + '<br><br><strong>' + ticket.category + ", " + ticket.subCategory + "," + ticket.context + '</strong>';
    msg = msg + '<br><br><strong>' + ticket.description + '</strong>';
    var data = {
      name: ticket.assigned.name,
      msg: msg,
      teamName: ticket.company.name + " Support",
      supportPhone: ticket.company.supportPhone,
      supportEmail: ticket.company.supportEmail
    }

    log.write("MailsService ::: sendNewTicketMail :: data : ", data);

    var mailBody = await services.getMailBody("emails/context_notification.html", data);
    log.write("MailsService ::: sendNewTicketMail :: mailBody : ", mailBody.length);
    var receivers = [];
    receivers.push({
      ticketId: ticket.id,
      bookingId: ticket.booking.id,
      name: ticket.assigned.name,
      email: ticket.assigned.email,
    })
    return await services.sendMail(ticket.company.name + " :: Support Ticket (" + ticket.refNo + ") got new message", mailBody, receivers);
  } catch (e) {
    log.write("MailsService ::: sendNewTicketMail :: exception : ", e);
    throw (e);
  }
}
service.sendTicketStatusChangeMail = async (ticketId) => {
  try {
    var ticket = await Ticket.findOne({
      where: { id: ticketId },
      include: ['company', { as: 'booking', model: Booking, include: ['client'] }]
    });
    var msg = "Your Support Ticket for " + ticket.company.name + " with reference number as " + ticket.refNo + " is marked as <strong>" + ticket.status + "</strong>";
    var data = {
      name: ticket.booking.client.name,
      msg: msg,
      teamName: ticket.company.name + " Support",
      supportPhone: ticket.company.supportPhone,
      supportEmail: ticket.company.supportEmail
    }
    if (ticket.status == 'Attended') {
      msg = "The issue related to your Support Ticket for HustleHub with reference number as " + ticket.refNo + " has been analysed and the status for the same is marked as <strong>‘Attended’</strong>. We are working on the resolution for the same."
    } else if (ticket.status == 'Resolved') {
      msg = "Your Support Ticket for HustleHub with reference number as " + ticket.refNo + " is marked as ‘Resolved’. Please accept the resolution and change the status to ‘Closed’ at the earliest."
    } else if (ticket.status == 'Attended') {
      msg = "Your Support Ticket for HustleHub with reference number as " + ticket.refNo + " is marked as ‘Closed’."
    }

    var receivers = [];
    var clientEmployee;
    if (ticket.clientEmployeeId) {
      clientEmployee = await ClientEmployee.findOne({ where: { id: ticket.clientEmployeeId } });
    }
    if (clientEmployee) {
      data.name = clientEmployee.name;
      receivers.push({
        ticketId: ticket.id,
        bookingId: ticket.booking.id,
        name: clientEmployee.name,
        email: clientEmployee.email,
      })
    } else {
      receivers.push({
        ticketId: ticket.id,
        bookingId: ticket.booking.id,
        name: ticket.booking.client.name,
        email: ticket.booking.client.email,
      })
    }

    log.write("MailsService ::: sendTicketMessageMail :: data : ", data);

    var mailBody = await services.getMailBody("emails/context_notification.html", data);
    log.write("MailsService ::: sendTicketMessageMail :: mailBody : ", mailBody.length);

    return await services.sendMail(ticket.company.name + " :: Support Ticket (" + ticket.refNo + ") status updated", mailBody, receivers);
  } catch (e) {
    log.write("MailsService ::: sendTicketMessageMail :: exception : ", e);
    throw (e);
  }
}
exports.service = service;