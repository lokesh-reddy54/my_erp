'use strict';

var Q = require('q');
var util = require('util');
var request = require('request-promise');
var jwt = require('jsonwebtoken');
var requestIp = require('request-ip');

var config = require('../../utils/config').config;
var log = require('../../utils/log').log;
var utils = require('../../utils/utils').utils;
var pgsService = require('../../services/pgs').service;

var controller = {};

controller.storeTransactionInfo = async (req, res) => {
  try {
    // log.write("ControllerService ::: storeTransactionInfo :: data ", req.body);
    var data = await pgsService.storeTransactionInfo(req.body);
    res.json({ data: data });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
}
controller.updateTransactionInfo = async (req, res) => {
  try {
    // log.write("ControllerService ::: updateTransactionInfo :: data ", req.body);
    var data = req.body;
    data.id = req.params.id;
    var data = await pgsService.updateTransactionInfo(data);
    res.json({ data: data });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
}
controller.storeTransactionRequest = async (req, res) => {
  try {
    // log.write("ControllerService ::: storeTransactionRequest :: data ", req.body);
    var data = req.body;
    data.pgTransactionId = req.params.id;
    // log.write("ControllerService ::: storeTransactionRequest :: data ", req.body);
    var data = await pgsService.storeTransactionRequest(data);
    res.json({ data: data });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
}
controller.storeTransactionResponse = async (req, res) => {
  try {
    // log.write("ControllerService ::: storeTransactionResponse :: data ", req.params);
    var data = req.body;
    data.pgTransactionId = req.params.id;
    // log.write("ControllerService ::: storeTransactionRequest :: data ", req.body);
    var data = await pgsService.storeTransactionResponse(data);
    res.json({ data: data });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
}
controller.cancelTransaction = async (req, res) => {
  try {
    // log.write("ControllerService ::: cancelTransaction :: data ", req.body);
    var data = await pgsService.cancelTransaction(req.params.id);
    res.json({ data: data });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
}
controller.changeTransactionStatus = async (req, res) => {
  try {
    // log.write("ControllerService ::: changeTransactionStatus :: data ", req.body);
    var data = await pgsService.changeTransactionStatus(req.body);
    res.json({ data: data });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
}
controller.storePgPayment = async (req, res) => {
  try {
    // log.write("ControllerService ::: storePgPayment :: data ", req.body);
    var data = await pgsService.storePgPayment(req.body, utils.getUserName(req));
    res.json({ data: data });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
}


controller.cashfreeGenerateChecksum = async (req, res) => {
  try {
    // log.write("ControllerService ::: cashfreeGenerateChecksum :: data ", req.body);
    var data = await pgsService.cashfreeGenerateChecksum(req.body, utils.getUserName(req));
    res.json({ data: data });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
}


controller.razorPayCreateOrder = async (req, res) => {
  try {
    // log.write("ControllerService ::: razorPayCreateOrder :: data ", req.body);
    var data = await pgsService.razorPayCreateOrder(req.body, utils.getUserName(req));
    res.json({ data: data });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
}

exports.controller = controller;