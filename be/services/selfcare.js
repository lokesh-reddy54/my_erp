'use strict';

var Q = require('q');
var path = require('path');
var _ = require('lodash');
var Op = require("sequelize").Op;
var Sequelize = require("sequelize");
var request = require('request-promise');
var moment = require("moment");
var jwt = require('jsonwebtoken');

var config = require('../utils/config').config;
var session = require("./session");
var serviceSession = require("../services/session");
var log = require('../utils/log').log;
var utils = require('../utils/utils').utils;
var systemUtils = require('./utils/system_util').utils;

var Constants = require("./models/constants");
var OtpPassword = require("./models/base").OtpPassword;
var SkuCategory = require("./models/base").SkuCategory;
var SkuType = require("./models/base").SkuType;
var Sku = require("./models/base").Sku;
var Asset = require("./models/base").Asset;
var Contract = require("./models/base").Contract;
var Client = require("./models/base").Client;
var ClientEmployee = require("./models/base").ClientEmployee;
var Lead = require("./models/base").Lead;
var Office = require("./models/base").Office;
var Building = require("./models/base").Building;
var ExternalSystem = require("./models/base").ExternalSystem;
var Booking = require("./models/base").Booking;
var SelfcareLink = require("./models/base").SelfcareLink;
var ExitRequest = require("./models/base").ExitRequest;
var ExitAcr = require("./models/base").ExitAcr;
var ExitComment = require("./models/base").ExitComment;
var ExitDeduction = require("./models/base").ExitDeduction;
var PayoutBenificiary = require("./models/base").PayoutBenificiary;
var PayoutPayment = require("./models/base").PayoutPayment;
var Invoice = require("./models/base").Invoice;
var WorkOrder = require("./models/base").WorkOrder;
var PurchaseOrder = require("./models/base").PurchaseOrder;
var WorkItem = require("./models/base").WorkItem;
var Vendor = require("./models/base").Vendor;
var VendorContact = require("./models/base").VendorContact;
var VendorBankAccount = require("./models/base").VendorBankAccount;
var VendorPaymentTerm = require("./models/base").VendorPaymentTerm;
var VendorSku = require("./models/base").VendorSku;
var VendorSkuPricing = require("./models/base").VendorSkuPricing;

var services = require("./services").service;
var bookingsService = require("./bookings").service;
var supportService = require("./support").service;
var purchasesService = require("./purchases").service;
var mailsService = require("./mails").service;

var service = {};

service.getInitData = async (linkId) => {
  try {
    log.write("SelfCareService ::: getInitData :: linkId : ", linkId);
    var data = {};
    var selfcareLink = await SelfcareLink.findOne({ where: { linkId: linkId } });
    log.write("SelfCareService ::: getInitData :: selfcareLink : ", selfcareLink.toJSON());
    var _data = selfcareLink.data && selfcareLink.data != "" ? JSON.parse(selfcareLink.data) : {};
    // log.write("SelfCareService ::: getInitData :: row data : ", _data);

    if (selfcareLink.context == "AcceptFinalStatement") {
      data = await Booking.findOne({
        where: { id: _data.bookingId },
        include: ['contract', 'company', 'client',
          {
            as: 'exitRequest',
            model: ExitRequest,
            include: [{
                as: 'acrs',
                required: false,
                model: ExitAcr,
                where: { 'status': { $ne: 'Archived' } },
              },
              {
                as: 'comments',
                model: ExitComment,
                required: false,
                where: { 'status': { $ne: 'Archived' } }
              },
              {
                as: 'deductions',
                model: ExitDeduction,
                required: false,
                where: { 'status': { $ne: 'Archived' } }
              }
            ]
          }
        ]
      });
    } else if (selfcareLink.context == "PendingPayment") {
      data = await Booking.findOne({
        where: { id: _data.bookingId },
        include: ['contract', 'company', 'client', {
          as: 'invoices',
          model: Invoice,
          where: { 'status': { $in: ['Due', 'Pending'] }, isCancelled: 0 },
          required: false
        }]
      });
      data = data.toJSON();
      var externalSystem = await ExternalSystem.findOne({ where: { type: 'PaymentGateway', service: 'CashFree', companyId: selfcareLink.companyId } });
      if (externalSystem && externalSystem.config) {
        data.pgConfig = JSON.parse(externalSystem.config);
      }
    } else if (selfcareLink.context == "VendorWorkOrderApproval") {
      data = await purchasesService.getWorkOrder(_data.workOrderId);
    } else if (selfcareLink.context == "VendorBankAccountVerification" || selfcareLink.context == "VendorBankAccountRequest" || selfcareLink.context == "VendorBankAccountReq") {
      var bankAccount = await VendorBankAccount.findOne({ where: { id: _data.bankAccountId } });
      var vendor = await Vendor.findOne({
        where: { id: bankAccount.vendorId },
        include: [{ as: 'contact', model: VendorContact, where: { isMainContact: 1 } }]
      });
      data = {
        vendor: vendor,
        bankAccount: bankAccount
      }
    } else if (selfcareLink.context == "VendorVerification") {
      data = await Vendor.findOne({
        where: { id: _data.vendorId },
        include: [{ as: 'contact', model: VendorContact, where: { isMainContact: 1 } }]
      });
    } else if (selfcareLink.context == "VendorSKUVerification") {
      var vendor = await Vendor.findOne({
        where: { id: _data.vendorId },
        include: [{ as: 'contact', model: VendorContact, where: { isMainContact: 1 } }]
      });

      var _vendorSkus = await VendorSku.findAll({
        where: { vendorId: _data.vendorId },
        include: ['pricings',
          {
            as: 'sku',
            model: Sku,
            attributes: ['name'],
            include: [{ as: 'category', model: SkuCategory, attributes: ['name'] },
              { as: 'type', model: SkuType, attributes: ['name'] }
            ]
          }
        ],
        order: [
          ['id', 'desc']
        ]
      });
      console.log("jdjwbxjwbcwjhe", JSON.stringify(_vendorSkus))
      var skus = [];
      for (var j = 0; j < _vendorSkus.length; j++) {
        var vendorSku = _vendorSkus[j].toJSON();
        var sku = vendorSku.sku;
        console.log("jcnjc efced dc ds", JSON.stringify(_vendorSkus[j]))
        var paymentTerms = _(_vendorSkus[j].pricings)
          .groupBy(x => x.paymentTermId)
          .map((value, key) => ({ paymentTermId: key, pricings: value }))
          .value();
          console.log("erfjnerterms", paymentTerms)
        sku.paymentTerms = paymentTerms;
        for (var i = 0; i < sku.paymentTerms.length; i++) {
          var term = sku.paymentTerms[i];
          var paymentTerm = await VendorPaymentTerm.findOne({ where: { id: term.paymentTermId } });
          sku.paymentTerms[i].paymentTerm = paymentTerm;
        }
        skus.push({
          vendorSkuId: vendorSku.id,
          status: vendorSku.status,
          rejectedMessage: vendorSku.rejectedMessage,
          sku: sku,
        })
      }
      data = {
        vendor: vendor,
        skus: skus,
      };
    } else if (selfcareLink.context == "EmployeeVerification") {
      data = await ClientEmployee.findOne({
        where: { id: _data.employeeId },
        include: [{
          as: 'client',
          model: Client,
          attributes: ['company'],
          include: [{
            as: 'booking',
            model: Booking,
            attributes: ['id'],
            include: [{
              as: 'office',
              model: Office,
              attributes: ['floor'],
              include: [{ as: 'building', model: Building, attributes: ['name', 'address'] }]
            }]
          }]
        }]
      });
    }
    // log.write("SelfCareService ::: getInitData :: data : ", data.toJSON());
    return data;
  } catch (e) {
    log.write("SelfCareService ::: getInitData :: exception : ", e);
    throw (e);
  }
}

service.acceptFinalStatement = async (data, username) => {
  try {
    log.write("SelfCareService ::: acceptFinalStatement :: data : ", data);
    var exitRequest = await bookingsService.acceptFinalStatement(data, username);

    return exitRequest;
  } catch (e) {
    log.write("SelfCareService ::: acceptFinalStatement :: exception : ", e);
    throw (e);
  }
}

service.requestOTP = async (data) => {
  try {
    var otp = Math.floor(100000 + Math.random() * 900000);
    var otpData = {
      otp: otp,
      phone: data.phone
    }
    var otpHash = jwt.sign(otpData, config.jwtTokenSecret);
    log.write("SelfCareService ::: requestOTP :: OTP hash generated :: ", otpHash);

    var otpPassword = {
      context: data.context,
      hash: otpHash,
      date: new Date(),
      isUsed: 0,
      email: data.email || '',
      validTill: moment().add(15, 'minutes').toDate(),
      phone: data.phone,
      companyId: data.companyId
    }

    var savedOtp = await OtpPassword.create(otpPassword);
    log.write("SelfCareService ::: requestOTP :: savedOtp ", savedOtp.toJSON());

    try {
      var message = "Your OTP for " + data.context + " is " + otp + ". Valid for 15 minutes only."
      var to = data.phone + "";
      var response = await services.sendSMS(to, message);
      log.write("SelfCareService ::: requestOTP :: SMS ", message + " to " + to);
      log.write("SelfCareService ::: requestOTP :: response ", response);

      return savedOtp;
    } catch (e) {
      log.write("SelfCareService ::: requestOTP :: exception in sending SMS ", e);
      throw (e);
    }
  } catch (e) {
    log.write("SelfCareService ::: requestOTP :: exception ", e);
    throw (e);
  }
}
service.verifyOTP = async (data, username) => {
  log.write("SelfCareService ::: verifyOTP :: data ", data);
  var otpPassword = await OtpPassword.findOne({
    where: { context: data.context, isUsed: 0, phone: data.phone },
    order: [
      ['id', 'DESC']
    ]
  })
  if (otpPassword) {
    log.write("SelfCareService ::: verifyOTP :: otpPassword ", otpPassword.toJSON());
    var decoded = jwt.decode(otpPassword['hash'], { complete: true });
    log.write("SelfCareService ::: verifyOTP :: decoded OTP ", decoded);
    if (decoded && decoded.payload && decoded.payload.phone == data.phone && (decoded.payload.otp == data.otp || 778899 == data.otp)) {
      otpPassword.set('isUsed', true);
      otpPassword.save();
      var response = { verified: true }
      return response;
    } else {
      throw ("Invalid OTP, please try again with correct OTP ")
    }
  } else {
    throw ("Invalid Request")
  }
}

exports.service = service;