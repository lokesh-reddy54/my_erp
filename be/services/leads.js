'use strict';

var Q = require('q');
var path = require('path');
var _ = require('lodash');
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
var Contract = require("./models/base").Contract;
var Lead = require("./models/base").Lead;
var LeadComment = require("./models/base").LeadComment;
var LeadMail = require("./models/base").LeadMail;
var LeadProposition = require("./models/base").LeadProposition;
var PriceContract = require("./models/base").PriceContract;
var PropositionQuote = require("./models/base").PropositionQuote;
var PriceQuote = require("./models/base").PriceQuote;
var Office = require("./models/base").Office;
var Building = require("./models/base").Building;
var Floor = require("./models/base").Floor;
var Cabin = require("./models/base").Cabin;
var Desk = require("./models/base").Desk;
var Location = require("./models/base").Location;
var Mail = require("./models/base").Mail;
var Call = require("./models/base").Call;
var Visit = require("./models/base").Visit;
var Booking = require("./models/base").Booking;
var BookedDesk = require("./models/base").BookedDesk;
var Client = require("./models/base").Client;
var Ticket = require("./models/base").Ticket;
var User = require("./models/base").User;
var OfficePricing = require("./models/base").OfficePricing;
var Facility = require("./models/base").Facility;
var FacilitySet = require("./models/base").FacilitySet;

var services = require("./services").service;
var bookingsService = require("./bookings").service;
var supportService = require("./support").service;
var mailsService = require("./mails").service;

var service = {};

// ####################### Start of Leads ################################
service.listLeads = async (data) => {
  try {
    log.write("APIService ::: listLeads :: data : ", data);
    var where = {};
    if (data.filters.status && data.filters.status != '') {
      where['status'] = data.filters.status;
    }
    if (data.filters.search) {
      var query = data.filters;
      var $or = [];
      $or.push(Sequelize.where(Sequelize.fn('lower', Sequelize.literal('leads.name')), {
        $like: "%" + query.search.toLowerCase() + "%"
      }))
      $or.push(Sequelize.where(Sequelize.fn('lower', Sequelize.literal('leads.email')), {
        $like: "%" + query.search.toLowerCase() + "%"
      }))
      $or.push(Sequelize.where(Sequelize.fn('lower', Sequelize.literal('leads.phone')), {
        $like: "%" + query.search.toLowerCase() + "%"
      }))
      $or.push(Sequelize.where(Sequelize.fn('lower', Sequelize.literal('leads.companyName')), {
        $like: "%" + query.search.toLowerCase() + "%"
      }))
      where['$and'] = { $or: $or }
    }
    var leads = await Lead.findAll({
      where: where,
      include: [{
        as: 'propositions',
        model: LeadProposition,
        attributes: ['desksAvailable'],
        include: [{ as: 'office', model: Office, attributes: ['name'] }]
      }],
      offset: data.offset,
      limit: data.limit,
      order: [
        ['propositions', 'isInterested', 'desc'],
        ['propositions', 'distance', 'asc'],
        ['propositions', 'desksAvailable', 'desc'],
        ['id', 'desc']
      ]
    });
    log.write("APIService ::: listLeads :: leads count : " + leads.length);

    return leads;
  } catch (e) {
    log.write("APIService ::: listLeads :: exception : ", e);
    throw (e);
  }
}
service.getLead = async (leadId) => {
  try {
    log.write("APIService ::: getLead :: leadId : ", leadId);
    var where = { id: leadId };
    var result = await Lead.findOne({
      where: where,
      include: [{ as: 'assigned', model: User, attributes: ['name', 'phone'] }]
      // include: ['comments', 'calls', 'visits', {
      //   as: 'mails',
      //   model: Mail,
      //   attributes: ['id', 'subject', 'date']
      // }, {
      //   as: 'propositions',
      //   model: LeadProposition,
      //   include: [{
      //     as: 'office',
      //     model: Office,
      //     include: ['location']
      //   }]
      // }]
    });

    // var result = result.toJSON();
    // log.write("APIService ::: getLead :: lead : ", result);
    // var leadComments = result.comments;
    // delete result.comments;
    // var leadPropositions = result.propositions;
    // delete result.propositions;
    // var leadMails = result.mails;
    // delete result.mails;

    var lead = result;
    // lead.leadComments = leadComments;
    // lead.mails = leadMails;
    // var propositions = [];
    // leadPropositions.forEach(async (p) => {
    //   var proposition = {};
    //   proposition.officeId = p.office.id;
    //   proposition.office = p.office.name;
    //   proposition.location = await systemUtils.getLocation(p.office.locationId);
    //   proposition.desksAvailable = p.desksAvailable;
    //   proposition.status = p.status;
    //   proposition.comment = p.comment;
    //   proposition.by = p.by;
    //   proposition.date = p.date;
    //   propositions.push(proposition);
    // });
    // lead.propositions = _(propositions)
    //   .groupBy(x => x.building)
    //   .map((value, key) => ({ building: key, location: value[0].location, items: value }))
    //   .value();
    return lead;
  } catch (e) {
    log.write("APIService ::: getLead :: exception : ", e);
    throw (e);
  }
}
service.getLeadPropositions = async (leadId) => {
  try {
    log.write("APIService ::: getLeadPropositions :: leadId : ", leadId);
    var where = { id: leadId };
    var result = await Lead.findOne({
      where: where,
      include: [{
        as: 'propositions',
        model: LeadProposition,
        include: ['visit', 'comment', 'contract', {
          as: 'office',
          model: Office,
          include: [{ as: 'building', model: Building, include: ['location'] }]
        }]
      }],
      order: [
        ['propositions', 'id', 'desc']
      ]
    });
    var leadPropositions = result.propositions;

    var propositions = [];
    leadPropositions.forEach(async (p) => {
      var proposition = {};
      proposition.id = p.id;
      proposition.leadId = p.leadId;
      proposition.officeId = p.office.id;
      proposition.locationId = p.office.building.locationId;
      proposition.office = p.office.name;
      proposition.location = p.office.address;
      proposition.desksAvailable = p.desksAvailable;
      proposition.status = p.status;
      proposition.comment = p.comment ? p.comment.comment : null;
      proposition.isInterested = p.isInterested;
      proposition.visit = p.visit;
      proposition.by = p.by;
      proposition.date = p.date;
      propositions.push(proposition);
    });
    return propositions;
  } catch (e) {
    log.write("APIService ::: getLeadPropositions :: exception : ", e);
    throw (e);
  }
}
service.getLeadVisits = async (leadId) => {
  try {
    log.write("APIService ::: getLeadVisits :: leadId : ", leadId);
    var where = { id: leadId };
    var result = await Lead.findOne({
      where: where,
      include: [{
        as: 'visits',
        model: Visit,
        include: ['comment', 'proposition', {
          as: 'office',
          model: Office
        }]
      }],
      order: [
        ['visits', 'id', 'desc']
      ]
    });
    var leadVisits = result.visits;
    log.write("APIService ::: getLeadVisits :: leadVisits : ", leadVisits.length);

    var visits = [];
    for (var i = 0; i < leadVisits.length; i++) {
      var p = leadVisits[i];
      // log.write("APIService ::: getLeadVisits :: visit : ", p.toJSON());
      var visit = {};
      visit.id = p.id;
      visit.propositionId = p.proposition ? p.proposition.id : null;
      visit.officeId = p.office.id;
      visit.office = p.office.name;
      visit.location = await systemUtils.getLocation(p.office.locationId);
      visit.date = utils.moment(p.date).format("YYYY-MM-DD HH:mm:ss");
      visit.status = p.status;
      visit.commentId = p.comment ? p.comment.id : null;
      visit.comment = p.comment ? p.comment.comment : null;
      visit.by = p.by;
      visit.date = p.date;
      visits.push(visit);
    };
    log.write("APIService ::: getLeadVisits :: visits : ", visits.length);
    return visits;
  } catch (e) {
    log.write("APIService ::: getLeadVisits :: exception : ", e);
    throw (e);
  }
}
service.getLeadMails = async (leadId) => {
  try {
    log.write("APIService ::: getLeadMails :: leadId : ", leadId);
    var where = { id: leadId };
    var lead = await Lead.findOne({
      where: where,
      include: [{
        as: 'mails',
        model: Mail,
        attributes: ['id', 'subject', 'date']
      }],
      order: [
        ['mails', 'id', 'desc']
      ]
    });
    return lead.mails;
  } catch (e) {
    log.write("APIService ::: getLeadMails :: exception : ", e);
    throw (e);
  }
}
service.getLeadCalls = async (leadId) => {
  try {
    log.write("APIService ::: getLeadCalls :: leadId : ", leadId);
    var where = { id: leadId };
    var lead = await Lead.findOne({
      where: where,
      include: [{
        as: 'calls',
        model: Call,
        include: ['comment']
      }],
      order: [
        ['calls', 'id', 'desc']
      ]
    });
    var calls = [];
    lead.calls.forEach(async (p) => {
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
      call.commentId = p.comment ? p.comment.id : '';
      call.comment = p.comment ? p.comment.comment : '';
      call.by = p.by;
      call.date = p.date;
      call.status = p.status;
      calls.push(call);
    });
    return calls;
  } catch (e) {
    log.write("APIService ::: getLeadCalls :: exception : ", e);
    throw (e);
  }
}
service.getLeadComments = async (leadId) => {
  try {
    log.write("APIService ::: getLeadComments :: leadId : ", leadId);
    var where = { id: leadId };
    var lead = await Lead.findOne({
      where: where,
      include: ['comments'],
      order: [
        ['comments', 'id', 'desc']
      ]
    });
    return lead.comments;
  } catch (e) {
    log.write("APIService ::: getLeadComments :: exception : ", e);
    throw (e);
  }
}

service.saveLead = async (data, username) => {
  try {
    log.write("APIService ::: saveLead :: data : ", data);
    var lead = {};
    data.updated = new Date();
    data.updatedBy = username || "system";
    if (data.id) {
      Lead.update(data, { where: { id: data.id } });
      lead = data;
    } else {
      var leads = await service.listLeads({ filters: { search: data.phone + '' } });
      if (leads.length > 0) {
        _.each(leads, function(l) {
          if (moment().add(-1 * systemUtils.constants.leadExpiry, 'months').isBefore(moment(l.updated))) {
            lead = l;
          }
        })
      }
      if (lead.id) {
        lead.existing = true;
        return lead;
      }
      data.status = "New";
      data.createdOn = new Date();
      lead = await Lead.create(data);
      if (lead.lat > 0 && lead.lng > 0) {
        var propositions = await service.updateLeadPropositions(lead.id);
        lead = lead.toJSON();
        lead.propositions = propositions;
      }
    }
    return lead;
  } catch (e) {
    log.write("APIService ::: saveLead :: exception : ", e);
    throw (e);
  }
}
service.deleteLead = async (id) => {
  try {
    log.write("APIService ::: deleteLead :: id : ", id);
    var result = await Lead.destroy({ where: { id: id } })
    return result;
  } catch (e) {
    log.write("APIService ::: deleteLead :: exception : ", e);
    throw (e);
  }
}

service.saveLeadComment = async (data, username) => {
  try {
    log.write("APIService ::: saveLeadComment :: data : ", data);
    var comment = {};
    data.date = new Date();
    data.by = username;
    if (data.id) {
      LeadComment.update(data, { where: { id: data.id } })
      comment = data;
    } else {
      comment = await LeadComment.create(data);
    }
    return comment;
  } catch (e) {
    log.write("APIService ::: saveLead :: exception : ", e);
    throw (e);
  }
}
service.saveLeadCall = async (data, username) => {
  try {
    log.write("APIService ::: saveLeadCall :: data : ", data);
    var call = {};
    if (data.id) {
      Call.update(data, { where: { id: data.id } });
      if (data.commentId && data.comment) {
        LeadComment.update({ comment: data.comment }, { where: { id: data.commentId } });
      }
      call = data;
    } else {
      call = await Call.create(data);
      var comment = {
        leadId: data.leadId,
        comment: data.comment,
        callId: call.id
      }
      await service.saveLeadComment(comment);
      Lead.update({ status: 'Attended', info: 'Call Scheduled' }, { where: { id: data.leadId } })
    }
    return call;
  } catch (e) {
    log.write("APIService ::: saveLeadCall :: exception : ", e);
    throw (e);
  }
}
service.saveLeadVisit = async (data, username) => {
  try {
    log.write("APIService ::: saveLeadVisit :: data : ", data);
    var visit = {};
    data.updated = new Date();
    data.updatedBy = username;
    if (data.id) {
      await Visit.update(data, { where: { id: data.id } });
      if (data.commentId && data.comment) {
        LeadComment.update({ comment: data.comment }, { where: { id: data.commentId } });
      }
      visit = data;
    } else {
      visit = await Visit.create(data);
      var comment = {
        leadId: data.leadId,
        visitId: visit.id,
        comment: data.comment,
      }
      service.saveLeadComment(comment, username);
      await LeadProposition.update({ visitId: visit.id }, { where: { id: data.propositionId } });
      Lead.update({ info: "Scheduled Visit" }, { where: { id: data.leadId } });
      service.sendLeadVisitScheduleMail(visit.id);
    }
    return visit;
  } catch (e) {
    log.write("APIService ::: saveLeadVisit :: exception : ", e);
    throw (e);
  }
}
service.saveLeadProposition = async (data, username) => {
  try {
    log.write("APIService ::: saveLeadProposition :: data : ", data);
    var proposition = {};
    if (data.id) {
      if (data.leadId && data.isInterested) {
        data.status = "Interested";
        await Lead.update({ status: 'Hot', info: "Interest Shown" }, { where: { id: data.leadId } });
      }
      LeadProposition.update(data, { where: { id: data.id } })
      proposition = data;
    } else {
      proposition = await LeadProposition.create(data);
    }
    return proposition;
  } catch (e) {
    log.write("APIService ::: saveLeadProposition :: exception : ", e);
    throw (e);
  }
}


service.savePriceQuote = async (data, username) => {
  try {
    log.write("APIService ::: savePriceQuote :: data : ", data);
    var priceQuote = {};
    if (data.id) {
      PriceQuote.update(data, { where: { id: data.id } })
      priceQuote = data;
    } else {
      priceQuote = await PriceQuote.create(data);
    }
    return priceQuote;
  } catch (e) {
    log.write("APIService ::: savePriceQuote :: exception : ", e);
    throw (e);
  }
}
service.getPropositionQuotes = async (propositionId) => {
  try {
    log.write("APIService ::: getPropositionQuotes :: propositionId : ", propositionId);
    var where = {
      propositionId: propositionId,
      status: { $notIn: ['Archieved'] },
      '$prices.status$': { $notIn: ['Archieved'] },
    };
    var quotes = await PropositionQuote.findAll({
      where: where,
      include: [{ as: 'prices', model: PriceQuote, required: false, include: ['contracts'] }],
      order: [
        ['id', 'desc']
      ]
    });
    return quotes;
  } catch (e) {
    log.write("APIService ::: getPropositionQuotes :: exception : ", e);
    throw (e);
  }
}
service.createPropositionQuote = async (data, username) => {
  try {
    log.write("APIService ::: createPropositionQuote :: data : ", data);
    var quote = {};
    data.updated = new Date();
    data.updatedBy = username;
    if (data.id) {
      await PropositionQuote.update(data, { where: { id: data.id } })
      quote = data;
    } else {
      data.status = "Draft";
      quote = await PropositionQuote.create(data);

      var pricings = await OfficePricing.findAll({
        where: { officeId: quote.officeId, deskType: data.deskType, active: 1 },
        include: [{ as: 'facilitySet', model: FacilitySet, include: ['facilities'] }]
      })
      log.write("LeadsService ::: createPropositionQuote :: pricings : ", pricings.length);
      if (pricings.length) {
        for (var i = 0; i < pricings.length; i++) {
          var p = pricings[i];
          if (p.minPerson <= data.desks && p.maxPerson >= data.desks) {
            // log.write("LeadsService ::: createPropositionQuote :: pricing : ", p.toJSON());
            var facilities = p.facilitySet.facilities;
            facilities = _.map(facilities, "name");
            facilities = facilities.join(",");
            await PriceQuote.create({
              quoteId: quote.id,
              deskType: p.deskType,
              status: "Published",
              facilitySetId: p.facilitySetId,
              facilities: p.facilitySet.name + " : " + facilities,
              min: p.minPerson,
              max: p.maxPerson,
              lockIn: p.duration,
              price: p.price
            })
          }
        };

        quote = await PropositionQuote.findOne({ where: { id: quote.id }, include: ['prices'] });
        return quote;
      } else {
        throw ("Pricing for this office is not configured yet.")
      }

    }

  } catch (e) {
    log.write("APIService ::: createPropositionQuote :: exception : ", e);
    throw (e);
  }
}
service.copyPropositionQuote = async (data, username) => {
  try {
    delete data.id;
    var prices = data.prices;
    delete data.prices;
    data.status = "Draft";
    quote = await PropositionQuote.create(data);
    prices = _.filter(prices, { status: 'Published' });
    for (var i = 0; i < prices.length; i++) {
      var p = prices[i];
      await PriceQuote.create({
        quoteId: quote.id,
        deskType: p.deskType,
        facilitySetId: p.facilitySetId,
        facilities: p.facilities,
        min: p.min,
        max: p.max,
        lockIn: p.lockIn,
        price: p.price,
        status: "Published"
      })
    };
    var quote = await PropositionQuote.findOne({ where: { id: quote.id }, include: ['prices'] });
    return quote;
  } catch (e) {
    log.write("APIService ::: createPropositionQuote :: exception : ", e);
    throw (e);
  }
}
service.updatePropositionQuote = async (data, username) => {
  try {
    var prices = data.prices;
    delete data.prices;
    data.status = "Draft";
    quote = await PropositionQuote.update(data, { where: { id: data.id } });
    for (var i = 0; i < prices.length; i++) {
      var p = prices[i];
      await PriceQuote.update({
        status: p.status,
        min: p.min,
        max: p.max,
        lockIn: p.lockIn,
        price: p.price
      }, { where: { id: p.id } })
    };
    quote = await PropositionQuote.findOne({ where: { id: quote.id }, include: ['prices'] });
    return quote;
  } catch (e) {
    log.write("APIService ::: createPropositionQuote :: exception : ", e);
    throw (e);
  }
}

service.savePriceContract = async (data, username) => {
  try {
    log.write("APIService ::: savePriceContract :: data : ", data);
    var contract;
    data.updated = new Date();
    data.updatedBy = username || 'system';
    if (data.id) {
      Contract.update(data, { where: { id: data.id } })
      contract = data;
    } else {
      data.date = new Date();
      contract = await Contract.create(data);
    }

    if (data.status == 'Confirmed') {
      var priceContract = await PriceContract.create({
        priceId: data.priceId,
        contractId: contract.id,
        status: 'Draft',
        updatedBy: username,
        updated: new Date()
      });

      var proposition = await LeadProposition.findOne({
        where: { id: data.propositionId },
        include: ['office', { as: 'lead', model: Lead, include: ['company'] }]
      });
      var priceQuote = await PriceQuote.findOne({ where: { id: data.priceId } });
      var location = await systemUtils.getLocation(proposition.office.locationId);

      // var data = {
      //   companyLogo: proposition.lead.company.logo,
      //   companyName: proposition.lead.company.name,
      //   companyTradeName: proposition.lead.company.tradeName,
      //   companyAddress: proposition.lead.company.address,
      //   officeAddress: proposition.office.name + ", " + location,
      //   city: proposition.lead.company.city,
      //   refNo: proposition.lead.id,
      //   rent: contract.rent,
      //   rentInWords: utils.toWords(contract.rent),
      //   deposit: contract.security,
      //   depositInWords: utils.toWords(contract.security),
      //   noticePeriod: contract.noticePeriod,
      //   lockInPeriod: contract.lockIn
      // }
      var data = {
        authorizedPerson: "Sudeep",
        companyLogo: proposition.lead.company.logo,
        companyName: proposition.lead.company.name,
        companyTradeName: proposition.lead.company.tradeName,
        companyAddress: proposition.lead.company.address,
        companyEmail: proposition.lead.company.email,
        clientCompanyName: proposition.lead.company || proposition.lead.name,
        clientCompanyAddress: proposition.lead.address || 'India',
        clientEmail: proposition.lead.email || '',
        officeAddress: proposition.office.name + ", " + location,
        city: proposition.lead.company.city,
        contractDate: utils.moment(contract.date).format("DD-MM-YYYY"),
        moveInDate: utils.moment(proposition.lead.startDate).format("DD-MM-YYYY"),
        rent: contract.rent,
        rentInWords: utils.toWords(contract.rent),
        deposit: contract.security,
        depositInWords: utils.toWords(contract.security),
        noticePeriod: contract.noticePeriod * 30,
        noticePeriodInWords: utils.toWords(contract.noticePeriod * 30),
        lockInPeriod: contract.lockIn,
        cabinNames: "",
        desksCount: proposition.lead.desks
      }
      log.write("BookingService ::: savePriceContract :: agreement data : ", data);
      var tmpFile = await services.parseContent("pdfs/agreement.html", data);
      var doc = await services.createDoc("AGREEMENT_" + proposition.lead.id + ".pdf");
      await services.generatePdf(tmpFile, path.basename(doc.file));
      contract.set('agreementId', doc.id);
      await contract.save();
      log.write("LeadService ::: savePriceContract :: agreement doc : ", doc);

      var data = {
        clientName: proposition.lead.name,
        companyName: proposition.lead.company.name,
        office: proposition.office.name,
        address: proposition.office.address || location,
        link: "",
        facilities: priceQuote.facilities,
        desks: proposition.lead.desks,
        rent: contract.rent,
        security: contract.security,
        token: contract.token,
        lockIn: contract.lockIn,
        lockInPenalty: contract.lockInPenaltyType == 'Fixed' ? contract.lockInPenalty : (contract.lockInPenalty * contract.rent),
        noticePeriod: contract.noticePeriod,
        noticePeriodViolation: contract.noticePeriodViolationType == 'Fixed' ? contract.noticePeriodViolation : (contract.noticePeriodViolation * contract.rent),
        teamName: proposition.lead.company.name + " Sales",
        supportPhone: proposition.lead.company.supportPhone,
        supportEmail: proposition.lead.company.supportEmail
      }

      log.write("MailsService ::: savePriceContract :: data : ", data);

      var mailBody = await services.getMailBody("emails/price_contract_notification.html", data);
      log.write("MailsService ::: savePriceContract :: mailBody : ", mailBody.length);
      var receivers = [];
      receivers.push({
        name: proposition.lead.name,
        email: proposition.lead.email,
      })
      var pdf = await systemUtils.getFile(contract.agreementId);
      var attachments = [{ filename: pdf.name, path: pdf.file }];
      var mail = await services.sendMail(proposition.lead.company.name + " :: Proposed Contract for " + proposition.office.name, mailBody, receivers, attachments);

      priceContract.set('status', 'MailSent');
      priceContract.set('mailSent', new Date());
      priceContract.set('mailId', mail.id);
      priceContract.save();

      LeadMail.create({ leadId: proposition.lead.id, mailId: mail.id });
      proposition.lead.set("info", "Contract Created");
      await proposition.lead.save();
    }
    return contract;
  } catch (e) {
    log.write("APIService ::: savePriceContract :: exception : ", e);
    throw (e);
  }
}
service.sendQuotationMail = async (data) => {
  try {
    var proposition = await LeadProposition.findOne({
      where: { id: data.propositionId },
      include: ['office', { as: 'lead', model: Lead, include: ['company'] }]
    });
    var quote = await PropositionQuote.findOne({ where: { id: data.quoteId, '$prices.status$': 'Published' }, include: ['prices'] });

    var prices = [];
    _.each(quote.prices, function(p) {
      prices.push({
        deskType: p.deskType,
        facilities: p.facilities,
        price: p.price,
        lockIn: p.lockIn,
        desks: p.min + " - " + p.max
      })
    })
    var data = {
      clientName: proposition.lead.name,
      companyName: proposition.lead.company.name,
      office: proposition.office.name,
      address: proposition.office.address || (await systemUtils.getLocation(proposition.office.locationId)),
      quotation: quote.name,
      prices: prices,
      teamName: proposition.lead.company.name + " Sales",
      supportPhone: proposition.lead.company.supportPhone,
      supportEmail: proposition.lead.company.supportEmail
    }
    log.write("MailsService ::: sendQuotationMail :: data : ", data);

    var mailBody = await services.getMailBody("emails/proposition_quotation.html", data);
    log.write("MailsService ::: sendQuotationMail :: mailBody : ", mailBody.length);
    var receivers = [];
    receivers.push({
      name: proposition.lead.name,
      email: proposition.lead.email,
    })
    var mail = await services.sendMail(proposition.lead.company.name + " :: Price Quotation " + quote.name + " for " + proposition.office.name, mailBody, receivers);

    quote.set('status', 'MailSent');
    quote.set('mailSent', new Date());
    quote.set('mailId', mail.id);
    quote.save();

    LeadMail.create({ leadId: proposition.lead.id, mailId: mail.id });
    return quote;
  } catch (e) {
    log.write("MailsService ::: sendQuotationMail :: exception : ", e);
    throw (e);
  }
}


service.updateLeadPropositions = async (leadId) => {
  try {
    log.write("APIService ::: updateLeadPropositions :: leadId : ", leadId);
    var lead = await Lead.findOne({
      where: { id: leadId },
      include: ['propositions']
    });
    if (!lead) {
      throw ("Lead not found with ID : " + leadId);
    }
    var sql = `select distinct o.id as officeId,b.locationId, o.bestPrice, geoDistance(b.lat,b.lng,:lat,:lng,'K') as distance, sum(deskAvailability(:startDate,c.id, 90, :deskType)) availability 
               from  cabins c 
                left join offices o on o.id=c.officeId
                left join buildings b on b.id=o.buildingId
               where  geoDistance(b.lat,b.lng,:lat,:lng,'K') < 10 and deskAvailability(:startDate,c.id, 90, :deskType) > 0
               group by o.id 
               order by geoDistance(b.lat,b.lng,:lat,:lng,'K')`;
    var replacements = {
      lat: lead['lat'],
      lng: lead['lng'],
      deskType: lead['deskType'],
      startDate: utils.moment(lead['startDate']).toDate()
    };
    log.write("APIService ::: updateLeadPropositions :: replacements : ", replacements);
    var results = await session.db.query(sql, {
      replacements: replacements,
      type: Sequelize.QueryTypes.SELECT
    });
    log.write("APIService ::: updateLeadPropositions :: results : ", results);
    var propositionOfficeIds = _.map(lead.propositions, "officeId");
    log.write("APIService ::: updateLeadPropositions :: propositionOfficeIds : ", propositionOfficeIds);
    var propositions = [];
    for (var i = 0; i < results.length; i++) {
      var r = results[i];
      r.availability = parseInt(r.availability);
      // log.write("APIService ::: updateLeadPropositions :: r : ", r);
      // log.write("APIService ::: updateLeadPropositions ::  office in propositions: ", propositionOfficeIds.indexOf(r.officeId));
      if (propositionOfficeIds.indexOf(r.officeId) < 0 && r.availability > 0) {
        var proposition = {
          officeId: r.officeId,
          locationId: r.locationId,
          leadId: leadId,
          desksAvailable: r.availability,
          status: "Proposed",
          distance: r.distance,
          price: r.bestPrice,
          by: 'system'
        };
        proposition = await service.saveLeadProposition(proposition);
        propositions.push(proposition);
      } else if (propositionOfficeIds.indexOf(r.officeId) >= 0) {
        var props = _.filter(lead.propositions, { officeId: r.officeId });
        _.each(props, function(p) {
          // log.write("APIService ::: updateLeadPropositions :: prop : ", p.toJSON());
          if (r.availability <= 0) {
            p.set('desksAvailable', 0);
            p.set('status', 'NotAvailable');
          } else {
            p.set('desksAvailable', r.availability);
            p.set('status', 'Available');
          }
          p.save();
        })
      }
    }
    return propositions;
  } catch (e) {
    log.write("APIService ::: updateLeadPropositions :: exception : ", e);
    throw (e);
  }
}

service.sendLeadPropositions = async (id) => {
  try {
    var lead = await Lead.findOne({
      where: { id: id },
      include: ['company', {
        as: 'propositions',
        model: LeadProposition,
        include: ['office']
      }],
      order: [
        ['propositions', 'id', 'desc']
      ]
    });
    var items = [];
    for (var i = 0; i < lead.propositions.length; i++) {
      var p = lead.propositions[i];
      items.push({
        office: p.office.name,
        address: await systemUtils.getLocation(p.office.locationId),
        desks: p.desksAvailable,
        price: p.price,
        distance: Math.round(p.distance, 2),
      })
    }
    var data = {
      clientName: lead.name,
      companyName: lead.company.name,
      location: lead.location,
      desks: lead.desks,
      startDate: utils.moment(lead.startDate).format("MMM DD, YYYY hh:mm a"),
      items: items,
      teamName: lead.company.name,
      supportPhone: lead.company.supportPhone,
      supportEmail: lead.company.supportEmail
    }
    log.write("MailsService ::: sendLeadPropositions :: data : ", data);

    var mailBody = await services.getMailBody("emails/lead_propositions.html", data);
    log.write("MailsService ::: sendLeadPropositions :: mailBody : ", mailBody.length);
    var receivers = [];
    receivers.push({
      name: lead.name,
      email: lead.email,
    })
    var mail = await services.sendMail(lead.company.name + " :: Propositions for your office requirement", mailBody, receivers);

    LeadMail.create({ leadId: lead.id, mailId: mail.id });
    return mail;
  } catch (e) {
    log.write("MailsService ::: sendLeadPropositions :: exception : ", e);
    throw (e);
  }
}

service.sendLeadVisitScheduleMail = async (visitId) => {
  try {
    var visit = await Visit.findOne({
      where: { id: visitId },
      include: ['office', {
        as: 'lead',
        model: Lead,
        include: ['company']
      }]
    });
    var data = {
      clientName: visit.lead.name,
      office: visit.office.name,
      location: await systemUtils.getLocation(visit.office.locationId),
      visitDate: utils.moment(visit.date).format("MMM DD, YYYY hh:mm a"),
      teamName: visit.lead.company.name,
      supportPhone: visit.lead.company.supportPhone,
      supportEmail: visit.lead.company.supportEmail
    }
    log.write("MailsService ::: sendLeadVisitScheduleMail :: data : ", data);

    var mailBody = await services.getMailBody("emails/lead_visit_scheduled.html", data);
    log.write("MailsService ::: sendLeadVisitScheduleMail :: mailBody : ", mailBody.length);
    var receivers = [];
    receivers.push({
      name: visit.lead.name,
      email: visit.lead.email,
    })
    var mail = await services.sendMail(visit.lead.company.name + " :: Proposed Office Visit scheduled on " + utils.moment(visit.date).format("MMM DD, YYYY hh:mm a"), mailBody, receivers);

    LeadMail.create({ leadId: visit.lead.id, mailId: mail.id });
    return mail;
  } catch (e) {
    log.write("MailsService ::: sendLeadVisitScheduleMail :: exception : ", e);
    throw (e);
  }
}

service.globalSearch = async (search) => {
  try {
    log.write("APIService ::: globalSearch :: search : ", search);
    var result = {};
    var where = {};
    where['$or'] = [
      { '$client.phone$': { $like: '%' + search + '%' } },
      { '$client.name$': { $like: '%' + search + '%' } },
      { '$client.company$': { $like: '%' + search + '%' } }
    ]
    var bookings = await Booking.findAll({
      where: where,
      subQuery: false,
      include: ['client', 'contract', {
        as: 'bookedDesks',
        model: BookedDesk,
        include: [{
          as: 'desk',
          model: Desk,
          attributes: ['name'],
          include: [{
            as: 'cabin',
            model: Cabin,
            attributes: ['name']
          }]
        }]
      }],
      order: [
        ['id', 'desc']
      ]
    });

    if (bookings.length) {
      var booking = bookings[0].toJSON();
      booking.location = booking.locationId ? await systemUtils.getLocation(booking.locationId) : '';
      var desks = [];
      _.each(booking.bookedDesks, function(d) {
        desks.push({
          desk: d.desk.name,
          cabin: d.desk.cabin.name,
          price: d.price
        })
      })
      booking.cabinNames = _.uniq(_.map(desks, "cabin")).join(", ");
      booking.deskNames = _.uniq(_.map(desks, "desk")).join(", ");

      result.booking = {
        id: booking.id,
        reserved: utils.moment(booking.reserved).format("MMM DD, YYYY"),
        started: utils.moment(booking.started).format("MMM DD, YYYY"),
        ended: booking.ended ? utils.moment(booking.ended).format("MMM DD, YYYY") : null,
        status: booking.status,
        refNo: booking.refNo,
        desks: booking.desks,
        type: booking.contract.type,
        rent: booking.contract.rent,
        offices: booking.offices,
        cabinNames: booking.cabinNames,
        deskNames: booking.deskNames,
        location: booking.location,
        client: booking.client,
        invoices: await bookingsService.getInvoices(booking.id),
        payments: await bookingsService.getPayments(booking.id),
        tickets: await supportService.listTickets({ filters: { bookingId: booking.id } }),
      }
      var tickets = await Ticket.findAll({
        where: { bookingId: booking.id },
        include: ['assigned'],
        order: [
          ['id', 'desc']
        ]
      })
      result.tickets = [];
      _.each(tickets, function(t) {
        result.tickets.push({
          id: t.id,
          category: t.category,
          context: t.context,
          priority: t.priority,
          refNo: t.refNo,
          issue: t.issue,
          date: utils.moment(t.date).format("MMM DD, YYYY"),
          status: t.status,
          assigned: {
            name: t.assigned.name,
            phone: t.assigned.phone
          }
        })
      })
    } else {
      where = {};
      where['$or'] = [
        { 'phone': { $like: '%' + search + '%' } },
        { 'name': { $like: '%' + search + '%' } },
        { 'companyName': { $like: '%' + search + '%' } }
      ]
      var lead = await Lead.findOne({
        where: where,
        include: ['calls'],
        order: [
          ['id', 'desc']
        ]
      });
      if (lead) {
        lead = lead.toJSON();
        lead.propositions = await service.getLeadPropositions(lead.id);
        lead.visits = await service.getLeadVisits(lead.id);
        lead.calls = await service.getLeadCalls(lead.id);
        result.lead = lead;
      }
    }

    return result;
  } catch (e) {
    log.write("APIService ::: globalSearch :: exception : ", e);
    throw (e);
  }
}

service.getVisits = async (data, username) => {
  try {
    log.write("LeadsServices ::: getVisits :: data : ", data);
    var where = {};
    if (data.filters.status && data.filters.status != '') {
      where['status'] = data.filters.status;
    }
    if (data.filters.from && data.filters.to) {
      where['date'] = { $between: [utils.moment(data.filters.from).toDate(), utils.moment(data.filters.to).toDate()] }
    }
    if (data.filters.buildingIds && data.filters.buildingIds.length) {
      where['$office.buildingId$'] = { $in: data.filters.buildingIds };
    }
    if (data.filters.search) {
      var query = data.filter;
      var $or = [];
      $or.push(Sequelize.where(Sequelize.fn('lower', Sequelize.literal('lead.name')), {
        $like: "%" + query.search.toLowerCase() + "%"
      }))
      $or.push(Sequelize.where(Sequelize.fn('lower', Sequelize.literal('lead.email')), {
        $like: "%" + query.search.toLowerCase() + "%"
      }))
      $or.push(Sequelize.where(Sequelize.fn('lower', Sequelize.literal('lead.phone')), {
        $like: "%" + query.search.toLowerCase() + "%"
      }))
      $or.push(Sequelize.where(Sequelize.fn('lower', Sequelize.literal('lead.companyName')), {
        $like: "%" + query.search.toLowerCase() + "%"
      }))
      where['$and'] = { $or: $or }
    }
    var results = await Visit.findAll({
      where: where,
      attributes: ['id', 'status', 'date'],
      include: [{
        as: 'lead',
        model: Lead,
        attributes: ['name', 'id', 'phone', 'companyName']
      }, { as: 'office', model: Office, attributes: ['name'], include: [{ as: 'building', model: Building, attributes: ['locationId'] }] }],
      offset: data.offset,
      limit: data.limit
    });
    log.write("BookingService ::: getVisits :: Visits count : " + results.length);
    var visits = [];
    for (var i = 0; i < results.length; i++) {
      var r = results[i].toJSON();
      r.location = r.office ? (await systemUtils.getLocation(r.office.building.locationId)) : '';
      visits.push(r);
    }

    return visits;
  } catch (e) {
    log.write("BookingsService ::: getVisits :: exception :", e);
    throw (e);
  }
}
service.getVisit = async (id) => {
  try {
    log.write("BookingService ::: getVisit :: id : ", id);
    var where = { id: id };
    var visit = await Visit.findOne({
      where: where,
      include: [
        { as: 'lead', model: Lead, attributes: ['name', 'phone', 'email', 'companyName'] },
        { as: 'assigned', model: User, attributes: ['name', 'phone'] },
        { as: 'office', model: Office, attributes: ['name', 'locationId'] }
      ]
    });
    log.write("BookingService ::: getVisit :: Visit : " + visit.toJSON());
    var visit = {
      id: visit.id,
      type: visit.type,
      status: visit.status,
      from: utils.moment(visit.date).clone().format("MMM DD, YYYY hh:mm a"),
      to: utils.moment(visit.date).clone().add(1, 'hours').format("MMM DD, YYYY hh:mm a"),
      lead: visit.lead,
      assigned: visit.assigned,
      office: visit.office,
      location: await systemUtils.getLocation(visit.office.locationId)
    }
    return visit;
  } catch (e) {
    log.write("BookingsService ::: getVisit :: exception :", e);
    throw (e);
  }
}

exports.service = service;