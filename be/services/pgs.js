'use strict';

var Q = require('q');
var _ = require('underscore');
var Op = require("sequelize").Op;
var Sequelize = require("sequelize");
var crypto = require('crypto-js');

var config = require('../utils/config').config;
var session = require("./session");
var log = require('../utils/log').log;
var utils = require('../utils/utils').utils;
var moment = require('moment');

var systemUtils = require('./utils/system_util').util;
var PgTransaction = require("./models/base").PgTransaction;
var PgTransactionRequest = require("./models/base").PgTransactionRequest;
var PgTransactionResponse = require("./models/base").PgTransactionResponse;
var Booking = require("./models/base").Booking;
var Invoice = require("./models/base").Invoice;
var Payment = require("./models/base").Payment;
var PayinEntry = require("./models/base").PayinEntry;
var ExternalSystem = require("./models/base").ExternalSystem;

var bookingService = require("./bookings").service;

var service = {};

service.loadTransactionInfo = function(transactionId) {
  return PgTransaction.findOne({
    where: {
      id: transactionId
    }
  })
}

/**
 *  Input Data params:
 *    orderId
 *    businessId
 *    businessType,
 *    isPreAuth (optional),
 *    currency,
 *    amount,
 *    customer {
   *      firstName,
          lastName,
          phoneCountryCode,
          phone,
          email
   *    },
 *    additionalData (optional)
 */
service.storeTransactionInfo = async (data) => {
  try {
    log.write("PGService ::: storeTransactionInfo :: data : ", data);
    // prepare data
    var transactionData = data;

    var info = {
      pgOrderId: data['orderId'],
      status: 'INCOMPLETE',
      date: new Date(),
      paymentMode: data.paymentMode || 'NetBanking',
      transactionData: JSON.stringify(transactionData)
    }

    var pgSystem = await ExternalSystem.findOne({
      where: {
        active: 1,
        type: 'PaymentGateway',
        companyId: data.companyId || 1
      }
    });

    if (!pgSystem) {
      throw 'Active Paymemt gateway not found .';
    }
    // deduct pg
    var pgConfig = pgSystem.config && pgSystem.config != "" ? JSON.parse(pgSystem.config) : {};
    info['pgProvider'] = pgSystem['service'];
    info['pgSystemId'] = pgSystem.id;
    info['pgCharge'] = pgConfig.pgCharge || 0;

    var ti = await PgTransaction.create(info);
    return ti;
  } catch (e) {
    log.write("PGService ::: storeTransactionInfo :: exception : ", e);
    throw (e);
  }
}

service.updateTransactionInfo = async (data) => {
  try {
    return await PgTransaction.update({
      pgOrderId: data['pgOrderId'],
      status: data['status'],
      pgTransactionId: data['pgTransactionId'],
      paymentMode: data['paymentMode']
    }, {
      where: {
        id: data['id']
      }
    });
  } catch (e) {
    log.write("PGService ::: updateTransactionInfo :: exception : ", e);
    throw (e);
  }
}

service.storeTransactionRequest = async (data) => {
  try {
    data.date = new Date();
    if (data.id) {
      return await PgTransactionRequest.update(data, { where: { id: data.id } });
    } else {
      return await PgTransactionRequest.create(data);
    }
  } catch (e) {
    log.write("PGService ::: storeTransactionRequest :: exception : ", e);
    throw (e);
  }
}

service.storeTransactionResponse = async (data) => {
  try {
    data.date = new Date();
    if (data.id) {
      return await PgTransactionResponse.update(data, { where: { id: data.id } });
    } else {
      return await PgTransactionResponse.create(data);
    }
  } catch (e) {
    log.write("PGService ::: storeTransactionResponse :: exception : ", e);
    throw (e);
  }
}

service.cancelTransaction = async (transactionId) => {
  try {
    return PgTransaction.update({
      status: 'CANCELLED'
    }, {
      where: {
        id: transactionId
      }
    })
  } catch (e) {
    log.write("PGService ::: cancelTransaction :: exception : ", e);
    throw (e);
  }
}

service.changeTransactionStatus = async (data) => {
  try {
    return PgTransaction.update({
      status: data.status
    }, {
      where: {
        id: data.transactionId
      }
    })
  } catch (e) {
    log.write("PGService ::: changeTransactionStatus :: exception : ", e);
    throw (e);
  }
}

service.storePgPayment = async (paymentData, username) => {
  try {
    log.write("PgService ::: storePgPayment ::paymentData : ", paymentData);
    var baseAmount = paymentData.amount / (1 + ((paymentData.pgCharge || 0) / 100));
    var pgCharge = paymentData.amount - baseAmount;
    var payment = await Payment.create({
      amount: baseAmount,
      bookingId: paymentData.bookingId,
      type: 'Online',
      date: new Date(),
      updatedBy: username || data.userName,
      updated: new Date()
    });
    var booking = await Booking.findOne({ where: { id: paymentData.bookingId } });
    await PayinEntry.create({
      amount: baseAmount,
      paymentId: payment.id,
      bookingId: paymentData.bookingId,
      companyId: booking.companyId,
      addedOn: new Date(),
      addedBy: 'system',
      paymentMode: 'CashFree',
      status: 'Attributed',
      attributed: 1,
      attributedBy: 'system',
      attributedOn: new Date(),
      updatedBy: username || data.userName,
      updated: new Date()
    })
    await bookingService.updateBookingLedger(paymentData.bookingId);

    if (pgCharge > 0) {
      await Payment.create({
        amount: pgCharge,
        bookingId: paymentData.bookingId,
        type: 'PgCharge',
        date: new Date(),
        updatedBy: username || data.userName,
        updated: new Date()
      });
    }
    return payment;
  } catch (e) {
    log.write("PGService ::: storePgPayment :: exception : ", e);
    throw (e);
  }
}


// ================== Cashfree APIs =============================
service.cashfreeGenerateChecksum = async (data) => {
  var pgSystem = await ExternalSystem.findOne({
    where: {
      id: data.pgSystemId
    }
  });
  var config = pgSystem.config && pgSystem.config != "" ? JSON.parse(pgSystem.config) : {};
  // log.write("razorpayPgClients ::: createOrder :: pgSystem : ", pgSystem);

  var appId = config['key'];
  var secretKey = config['secret'];

  var tokenData = 'appId=' + appId + '&orderId=' + data['orderId'] + '&orderAmount=' + data['amount'] + '&returnUrl=&paymentModes=';
  var token = crypto.enc.Base64.stringify(crypto.HmacSHA256(tokenData, secretKey));

  return {
    appId: appId,
    token: token
  }
}


// ================== RazorPay APIs =============================
service.razorPayCreateOrder = async (data) => {
  // log.write("razorpayPgClients ::: createOrder :: data : ", data);
  var pgSystem = await ExternalSystem.findOne({
    where: {
      id: data.systemId
    }
  });
  var config = pgSystem.config && pgSystem.config != "" ? JSON.parse(pgSystem.config) : {};
  // log.write("razorpayPgClients ::: createOrder :: pgSystem : ", pgSystem);

  var accountId = config['key']; //'rzp_test_ysfqwpqilrVflZ';
  var secretKey = config['secret']; //'hSuza0egealNJHgHH1llAEmy';

  var postData = {
    amount: data['amount'] * 100,
    currency: data['currency'] || 'INR',
    receipt: data['orderId'] || '',
    payment_capture: 1
  };

  // store request
  var request = await PgTransactionRequest.create({
    pgTransactionId: data.transactionId,
    date: new Date(),
    url: data.url,
    postData: JSON.stringify(postData)
  });

  var url = pgSystem['configuration']['apiUrl'] + '/orders'; //  'https://api.razorpay.com/v1/orders';
  url = url.replace("https://", "https://" + accountId + ":" + secretKey + "@");

  var response = await request({
    method: 'POST',
    uri: url,
    body: postData,
    json: true
  });

  console.log(JSON.stringify(response, null, 2));

  // store response
  request.set("response", JSON.stringify(response));
  request.save();

  return {
    keyId: accountId,
    orderId: response['id']
  };
}


exports.service = service;