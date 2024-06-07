'use strict';

var express = require('express');
var controllers = require('../../controllers/internal').controllers;
var utils = require('../../utils/utils.js').utils;
var config = require('../../utils/config.js').config;
var route = express.Router();

if (config.checkAuth) {
  route.use(utils.authChecker);
}

route.post('/listVisits', controllers.visits.listVisits);
route.post('/listVisitors', controllers.visits.listVisitors);
route.post('/getDashboard', controllers.visits.getDashboard);
route.post('/registerVisitor', controllers.visits.registerVisitor);
route.post('/subscribe', controllers.visits.subscribe);
route.post('/updateVisitor', controllers.visits.updateVisitor);
route.post('/requestVisitorOTP', controllers.visits.requestVisitorOTP);
route.post('/verifyVisitorOTP', controllers.visits.verifyVisitorOTP);
route.post('/sendNotifications', controllers.visits.sendNotifications);

exports.route = route;