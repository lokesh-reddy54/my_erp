'use strict';

var Q = require('q');
var util = require('util');
var request = require('request-promise');
var jwt = require('jsonwebtoken');
var requestIp = require('request-ip');

var config = require('../../utils/config').config;
var log = require('../../utils/log').log;
var utils = require('../../utils/utils').utils;
var visitsService = require('../../services/visits').service;

var controller = {};

controller.listVisits = async (req, res) => {
  try {
    // log.write("ControllerService ::: listVisits :: data ", req.body);
    var users = await visitsService.listVisits(req.body);
    res.json({ data: users });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
}

controller.listVisitors = async (req, res) => {
  try {
    // log.write("ControllerService ::: listVisitors :: data ", req.body);
    var users = await visitsService.listVisitors(req.body);
    res.json({ data: users });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
}

controller.getDashboard = async (req, res) => {
  try {
    // log.write("ControllerService ::: getDashboard :: data ", req.body);
    var users = await visitsService.getDashboard(req.body);
    res.json({ data: users });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
}

controller.registerVisitor = async (req, res) => {
  try {
    // log.write("ControllerService ::: registerVisitor :: data ", req.body);
    var users = await visitsService.registerVisitor(req.body);
    res.json({ data: users });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
}

controller.subscribe = async (req, res) => {
  try {
    // log.write("ControllerService ::: subscribe :: data ", req.body);
    var users = await visitsService.subscribe(req.body);
    res.json({ data: users });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
}

controller.updateVisitor = async (req, res) => {
  try {
    // log.write("ControllerService ::: updateVisitor :: data ", req.body);
    var users = await visitsService.updateVisitor(req.body);
    res.json({ data: users });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
}

controller.requestVisitorOTP = async (req, res) => {
  try {
    // log.write("ControllerService ::: requestVisitorOTP :: data ", req.body);
    var users = await visitsService.requestVisitorOTP(req.body);
    res.json({ data: users });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
}
controller.verifyVisitorOTP = async (req, res) => {
  try {
    // log.write("ControllerService ::: verifyVisitorOTP :: data ", req.body);
    var users = await visitsService.verifyVisitorOTP(req.body);
    res.json({ data: users });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
}
controller.sendNotifications = async (req, res) => {
  try {
    // log.write("ControllerService ::: sendNotifications :: data ", req.body);
    var users = await visitsService.sendNotifications(req.body);
    res.json({ data: users });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
}

exports.controller = controller;