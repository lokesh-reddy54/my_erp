'use strict';

var express = require('express');
var controllers = require('../../controllers/internal').controllers;
var utils = require('../../utils/utils.js').utils;
var config = require('../../utils/config.js').config;
var route = express.Router();

if (config.checkAuth) {
  route.use(utils.authChecker);
}

route.post('/getBuildingMetrics', controllers.dashboards.getBuildingMetrics);
route.post('/getCapexDashboard', controllers.dashboards.getCapexDashboard);
route.post('/getExpensesDashboard', controllers.dashboards.getExpensesDashboard);
route.post('/getProfitandLossDashboard', controllers.dashboards.getProfitandLossDashboard);
route.post('/getRevenueDashboard', controllers.dashboards.getRevenueDashboard);
route.post('/getAccountsCards', controllers.dashboards.getAccountsCards);
route.post('/getAccountsCardsList', controllers.dashboards.getAccountsCardsList);

exports.route = route;