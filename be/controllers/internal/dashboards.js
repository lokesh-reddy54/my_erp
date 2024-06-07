'use strict';

var Q = require('q');
var util = require('util');
var request = require('request-promise');
var jwt = require('jsonwebtoken');
var requestIp = require('request-ip');

var config = require('../../utils/config').config;
var log = require('../../utils/log').log;
var utils = require('../../utils/utils').utils;
var dashboardsService = require('../../services/dashboards').service;

var controller = {};

controller.getBuildingMetrics = async (req, res) => {
  try {
    // log.write("ControllerService ::: getBuildingMetrics :: data ", req.body);
    var data = await dashboardsService.getBuildingMetrics(utils.body(req));
    res.json({ data: data });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
}
controller.getCapexDashboard = async (req, res) => {
  try {
    // log.write("ControllerService ::: getCapexDashboard :: data ", req.body);
    var data = await dashboardsService.getCapexDashboard(utils.body(req));
    res.json({ data: data });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
}
controller.getExpensesDashboard = async (req, res) => {
  try {
    // log.write("ControllerService ::: getExpensesDashboard :: data ", req.body);
    var data = await dashboardsService.getExpensesDashboard(utils.body(req));
    res.json({ data: data });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
}
controller.getProfitandLossDashboard = async (req, res) => {
  try {
    // log.write("ControllerService ::: getProfitandLossDashboard :: data ", req.body);
    var data = await dashboardsService.getProfitandLossDashboard(utils.body(req));
    res.json({ data: data });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
}
controller.getRevenueDashboard = async (req, res) => {
  try {
    // log.write("ControllerService ::: getRevenueDashboard :: data ", req.body);
    var data = await dashboardsService.getRevenueDashboard(utils.body(req));
    res.json({ data: data });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
}

controller.getAccountsCards = async (req, res) => {
  try {
    // log.write("ControllerService ::: getAccountsCards :: data ", req.body);
    var data = await dashboardsService.getAccountsCards(utils.body(req));
    res.json({ data: data });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
}
controller.getAccountsCardsList = async (req, res) => {
  try {
    // log.write("ControllerService ::: getAccountsCardsList :: data ", req.body);
    var data = await dashboardsService.getAccountsCardsList(utils.body(req));
    res.json({ data: data });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
}

exports.controller = controller;