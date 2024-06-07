'use strict';

var express = require('express');
var controllers = require('../../controllers/internal').controllers;
var utils = require('../../utils/utils.js').utils;
var config = require('../../utils/config.js').config;
var route = express.Router();

if (config.checkAuth) {
  route.use(utils.authChecker);
}

route.post('/transaction', controllers.pgs.storeTransactionInfo);
route.post('/transaction/:id/update', controllers.pgs.updateTransactionInfo);
route.post('/transaction/:id/status', controllers.pgs.updateTransactionInfo);
route.post('/transaction/:id/request', controllers.pgs.storeTransactionRequest);
route.post('/transaction/:id/response', controllers.pgs.storeTransactionResponse);
route.post('/transaction/:id/cancel', controllers.pgs.cancelTransaction);
route.post('/storePgPayment', controllers.pgs.storePgPayment);

route.post('/cashfree/checksum', controllers.pgs.cashfreeGenerateChecksum);

route.post('/razorpay/createorder', controllers.pgs.razorPayCreateOrder);

exports.route = route;