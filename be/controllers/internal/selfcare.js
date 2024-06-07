'use strict';

var Q = require('q');
var util = require('util');
var request = require('request-promise');
var jwt = require('jsonwebtoken');
var requestIp = require('request-ip');

var config = require('../../utils/config').config;
var log = require('../../utils/log').log;
var utils = require('../../utils/utils').utils;
var selfcareService = require('../../services/selfcare').service;

var controller = {};

controller.getInitData = async (req, res) => {
  try {
    // log.write("ControllerService ::: getInitData :: data ", req.body);
    var data = await selfcareService.getInitData(req.params.id);
    res.json({ data: data })
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
}
controller.requestOTP = async (req, res) => {
  try {
    // log.write("ControllerService ::: requestOTP :: data ", req.body);
    var data = await selfcareService.requestOTP(utils.body(req));
    res.json({ data: data })
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
}
controller.verifyOTP = async (req, res) => {
  try {
    // log.write("ControllerService ::: verifyOTP :: data ", req.body);
    var data = await selfcareService.verifyOTP(utils.body(req));
    res.json({ data: data })
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
}
controller.acceptFinalStatement = async (req, res) => {
  try {
    // log.write("ControllerService ::: acceptFinalStatement :: data ", req.body);
    var data = await selfcareService.acceptFinalStatement(req.body);
    res.json({ data: data })
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
}


exports.controller = controller;