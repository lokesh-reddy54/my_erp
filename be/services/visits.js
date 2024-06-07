'use strict';

var Q = require('q');
var moment = require('moment');
var _ = require('underscore');
var Op = require("sequelize").Op;
var Sequelize = require("sequelize");
var nodemailer = require('nodemailer');
var atob = require('atob');
const webpush = require('web-push');
var jwt = require('jsonwebtoken');
var request = require('async-request');

var config = require('../utils/config').config;
var session = require("./session");
var services = require("./services").service;
var log = require('../utils/log').log;
var utils = require('../utils/utils').utils;
var systemUtils = require('./utils/system_util').utils;

var Constants = require("./models/constants");
var Visitor = require("./models/base").Visitor;
var Subscription = require("./models/base").Subscription;
var VmVisit = require("./models/base").VmVisit;
var Client = require("./models/base").Client;
var OtpPassword = require("./models/base").OtpPassword;

const publicVapidKey = "BPqx2ONABMV-7hvZQz801jPnxKGtcn63Fcb0RnOooW8MyNCBlGfwpJjcko_sd4_y90rbHRCNFUWRzxOfRPFt-4U";
const privateVapidKey = "yuRJV2BCMIsnZzHBhLhAFjSNm7s9nFx4MONBSzSRSDs";

webpush.setVapidDetails('mailto:sam@squareplums.com', publicVapidKey, privateVapidKey);

var service = {};

service.listVisits = async (data) => {
  try {
    log.write("APIService ::: listVisits :: data : ", data);
    var where = {};
    var attributes;
    if (data.filters.status && data.filters.status != '') {
      where['status'] = data.filters.status;
    }
    if (data.filters.id && data.filters.id != '') {
      where['id'] = data.filters.id;
    }
    if (data.filters.clientId && data.filters.clientId != '') {
      where['$subscription.clientId$'] = data.filters.clientId;
    }
    if (data.filters.companyId && data.filters.companyId != '') {
      where['$subscription.companyId$'] = data.filters.companyId;
    }
    if (data.filters.search) {
      var query = data.filters;
      var $or = [];
      $or.push(Sequelize.where(Sequelize.fn('lower', Sequelize.literal('visiteeName')), {
        $like: query.search.toLowerCase() + "%"
      }))
      $or.push(Sequelize.where(Sequelize.fn('lower', Sequelize.literal('visiteePhone')), {
        $like: query.search.toLowerCase() + "%"
      }))
      $or.push(Sequelize.where(Sequelize.fn('lower', Sequelize.literal('visiteeCompany')), {
        $like: query.search.toLowerCase() + "%"
      }))
      $or.push(Sequelize.where(Sequelize.fn('lower', Sequelize.literal('visitor.name')), {
        $like: query.search.toLowerCase() + "%"
      }))
      $or.push(Sequelize.where(Sequelize.fn('lower', Sequelize.literal('visitor.phone')), {
        $like: query.search.toLowerCase() + "%"
      }))
      where['$and'] = { $or: $or }
    }
    log.write("APIService ::: listVisits :: where : ", where);
    var visits = await VmVisit.findAll({
      where: where,
      include: ['visitor', 'subscription'],
      offset: data.offset,
      limit: data.limit,
      order: [
        ['id', 'desc']
      ]
    });
    log.write("APIService ::: listVisits :: visits count : " + visits.length);

    return visits;
  } catch (e) {
    log.write("APIService ::: listVisits :: exception : ", e);
    throw (e);
  }
}

service.listVisitors = async (data) => {
  try {
    log.write("APIService ::: listVisitors :: data : ", data);
    var where = {};
    var attributes;
    if (data.filters.status && data.filters.status != '') {
      where['status'] = data.filters.status;
    }
    if (data.filters.clientId && data.filters.clientId != '') {
      where['clientId'] = data.filters.clientId;
    }
    if (data.filters.companyId && data.filters.companyId != '') {
      where['companyId'] = data.filters.companyId;
    }
    if (data.filters.search) {
      var query = data.filters;
      var $or = [];
      $or.push(Sequelize.where(Sequelize.fn('lower', Sequelize.literal('name')), {
        $like: query.search.toLowerCase() + "%"
      }))
      $or.push(Sequelize.where(Sequelize.fn('lower', Sequelize.literal('phone')), {
        $like: query.search.toLowerCase() + "%"
      }))
      $or.push(Sequelize.where(Sequelize.fn('lower', Sequelize.literal('comingFrom')), {
        $like: query.search.toLowerCase() + "%"
      }))
      where['$and'] = { $or: $or }
    }
    log.write("APIService ::: listVisitors :: where : ", where);
    var visitors = await Visitor.findAll({
      where: where,
      offset: data.offset,
      limit: data.limit,
      order: [
        ['id', 'desc']
      ]
    });
    log.write("APIService ::: listVisitors :: visitors count : " + visitors.length);

    return visitors;
  } catch (e) {
    log.write("APIService ::: listVisitors :: exception : ", e);
    throw (e);
  }
}

service.listSubscriptions = async (data) => {
  try {
    log.write("APIService ::: listSubscriptions :: data : ", data);
    var where = {};
    var attributes;
    if (data.filters.status && data.filters.status != '') {
      where['status'] = data.filters.status;
    }
    if (data.filters.clientId && data.filters.clientId != '') {
      where['clientId'] = data.filters.clientId;
    }
    if (data.filters.companyId && data.filters.companyId != '') {
      where['companyId'] = data.filters.companyId;
    }

    if (data.filters.search) {
      var query = data.filters;
      var $or = [];
      $or.push(Sequelize.where(Sequelize.fn('lower', Sequelize.literal('name')), {
        $like: query.search.toLowerCase() + "%"
      }))
      $or.push(Sequelize.where(Sequelize.fn('lower', Sequelize.literal('phone')), {
        $like: query.search.toLowerCase() + "%"
      }))
      $or.push(Sequelize.where(Sequelize.fn('lower', Sequelize.literal('email')), {
        $like: query.search.toLowerCase() + "%"
      }))
      where['$and'] = { $or: $or }
    }
    log.write("APIService ::: listSubscriptions :: where : ", where);
    var subscriptions = await Subscription.findAll({
      where: where,
      offset: data.offset,
      limit: data.limit,
      order: [
        ['id', 'desc']
      ]
    });
    log.write("APIService ::: listSubscriptions :: subscriptions count : " + subscriptions.length);

    return subscriptions;
  } catch (e) {
    log.write("APIService ::: listSubscriptions :: exception : ", e);
    throw (e);
  }
}

service.getDashboard = async (id) => {
  try {
    log.write("APIService ::: getDashboard :: id : ", id);
    var dashboard = {};

    return dashboard;
  } catch (e) {
    log.write("APIService ::: getDashboard :: exception : ", e);
    throw (e);
  }
}

service.registerVisitor = async (data) => {
  try {
    var visitor = await Visitor.findOne({ where: { phone: data.phone } });
    if (!visitor) {
      data['registeredOn'] = new Date();
      visitor = await Visitor.create(data);
      log.write("VisitorService ::: requestVisitorOTP :: visitor ", visitor.toJSON());
    } else {
      data.lastVisit = new Date();
      await Visitor.update(data, { where: { phone: data.phone } });
    }
    return visitor;
  } catch (e) {
    log.write("VisitorService ::: registerVisitor :: exception :: ", e);
  }
}

service.subscribe = async (data) => {
  try {
    log.write("VisitorService ::: subscribe :: data :: ", data);
    var subscription = await Subscription.findOne({ where: { phone: data.phone } });
    if (!subscription) {
      data['date'] = new Date();
      subscription = await Subscription.create(data);
    } else {
      data['updated'] = new Date();
      Subscription.update(data, { where: { phone: data['phone'] } })
    }
    return subscription;
  } catch (e) {
    log.write("VisitorService ::: subscribe :: exception :: ", e);
  }
}

service.updateVisitor = async (data) => {
  try {
    await Visitor.update(data, { where: { visitor_id: data['visitor_id'] } });
  } catch (e) {
    log.write("VisitorService ::: updateVisitor :: exception :: ", e);
  }
}

service.requestVisitorOTP = async (data) => {
  try {
    var otp = Math.floor(100000 + Math.random() * 900000);
    var otpData = {
      otp: otp,
      phone: data.phone
    }
    var otpHash = jwt.sign(otpData, config.jwtTokenSecret);
    log.write("VisitorService ::: requestVisitorOTP :: OTP hash generated :: ", otpHash);

    var otpPassword = {
      context: 'VisitorVerification',
      hash: otpHash,
      date: new Date(),
      isUsed: 0,
      email: data.email || '',
      validTill: moment().add(15, 'minutes').toDate(),
      phone: data.phone,
      companyId: data.companyId
    }

    var savedOtp = await OtpPassword.create(otpPassword);
    log.write("VisitorService ::: requestVisitorOTP :: savedOtp ", savedOtp.toJSON());

    var messageData = {
      otp_password: otp,
      validity_time: 15
    }
    var sms = {
      templateCode: "022",
      messageData: messageData,
      receiverName: data['name'] || '',
      receiverPhone: data['phone']
    }

    var smsModel = {
      companyId: data.companyId,
      sms: sms,
      send: true
    }

    try {
      // mailServer.storeSms(smsModel);

      var message = "Your OTP for Acko Visitor Management system is " + otp + ". Valid for 15 minutes only."
      var to = data.phone + "";
      var response = await services.sendSMS(to, message);
      log.write("VisitorService ::: requestVisitorOTP :: SMS ", message + " to " + to);
      log.write("VisitorService ::: requestVisitorOTP :: response ", response);

      return savedOtp;
    } catch (e) {
      log.write("VisitorService ::: requestVisitorOTP :: exception in sending SMS ", e);
      throw (e);
    }
  } catch (e) {
    log.write("VisitorService ::: requestVisitorOTP :: exception ", e);
    throw (e);
  }
}

service.verifyVisitorOTP = async (data, username) => {
  log.write("VisitorService ::: verifyVisitorOTP :: data ", data);
  var otpPassword = await OtpPassword.findOne({
    where: { context: 'VisitorVerification', isUsed: 0, phone: data.phone },
    order: [
      ['id', 'DESC']
    ]
  })
  if (otpPassword) {
    log.write("VisitorService ::: verifyVisitorOTP :: otpPassword ", otpPassword.toJSON());
    var decoded = jwt.decode(otpPassword['hash'], { complete: true });
    log.write("VisitorService ::: verifyVisitorOTP :: decoded OTP ", decoded);
    if (decoded && decoded.payload && decoded.payload.phone == data.phone && decoded.payload.otp == data.otp) {
      otpPassword.set('isUsed', true);
      otpPassword.save();
      var response = { verified: true }
      var visitor = await Visitor.findOne({ where: { phone: data.phone }, attributes: ['name', 'imageId', 'phone', 'comingFrom', 'status'] });
      if (visitor) {
        response.hasVisitor = true;
        response.visitor = visitor;
        // visitor.set('lastVisit', new Date());
        // visitor.save();
        return response;
      } else {
        response.hasVisitor = false;
        return response;
      }
    } else {
      throw ("Invalid OTP, please try again with correct OTP ")
    }
  } else {
    throw ("Invalid Request")
  }
}

service.sendNotifications = async (data) => {
  try {
    log.write("VisitsService ::: sendNotifications :: data : ", data);
    var subscription = await Subscription.findOne({ where: { phone: data.phone } });
    // var body = data.visitorName + " from " + data.visitorComingFrom + " has came to " + data.purpose + ". ";
    var body = data.body;

    var visit = await VmVisit.create({
      visitorId: data.visitorId,
      subscriptionId: subscription ? subscription.id : null,
      date: new Date(),
      message: body,
      purpose: data.purpose,
      visiteeName: data.name,
      visiteePhone: data.phone,
      status: "Sent"
    })
    if (subscription) {
      log.write("VisitsService ::: sendNotifications :: Subscription : ", subscription.toJSON());
      var title = "Acko Visitor Notification";
      var options = {
        icon: 'https://www.acko.com/static/images/Acko_Logo_Pale.png',
        body: body,
        data: {
          url: 'https://acko.hustlehub.xyz/#' + visit.id
        }
      }
      const payload = JSON.stringify({ title: title, options: options });
      log.write("VisitsService ::: sendNotifications :: payload : ", payload);
      if (subscription['desktopSubscription']) {
        try {
          var desktopSubscription = JSON.parse(subscription['desktopSubscription']);
          webpush.sendNotification(desktopSubscription, payload).catch(error => {
            log.write("VisitsService ::: sendNotifications :: sending desktop Subscription : error : ", error);
          });
        } catch (e) {}
      }
      if (subscription['androidSubscription']) {
        try {
          var androidSubscription = JSON.parse(subscription['androidSubscription']);
          webpush.sendNotification(androidSubscription, payload).catch(error => {
            log.write("VisitsService ::: sendNotifications :: sending android Subscription : error : ", error);
          });
        } catch (e) {}
      }
    } else {
      log.write("VisitorService ::: sendNotifications :: no subscription found for  " + data.phone);
    }

    var notification = "";
    var messageData = {
      notification: notification
    }
    var sms = {
      templateCode: "024",
      messageData: messageData,
      receiverName: data['name'] || '',
      receiverPhone: data['phone']
    }

    var smsModel = {
      companyId: data.companyId,
      sms: sms,
      send: true
    }

    try {
      // mailServer.storeSms(smsModel);
      var message = "Acko Visitor Notification : " + body;
      var to = data.phone + "";
      var response = await services.sendSMS(to, message);
      log.write("VisitorService ::: sendNotifications :: response ", response.body);

      return data;
    } catch (e) {
      log.write("VisitorService ::: sendNotifications :: exception in sending SMS ", e);
      throw (e);
    }
  } catch (e) {
    log.write("VisitorService ::: subscribe :: exception :: ", e);
  }
}



exports.service = service;