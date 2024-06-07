'use strict';

var express = require('express');
var controllers = require('../../controllers/internal').controllers;
var utils = require('../../utils/utils.js').utils;
var config = require('../../utils/config.js').config;
var route = express.Router();

if (config.checkAuth) {
  //route.use(utils.authChecker);
}

route.post('/listCompanies', controllers.admin.listCompanies);
route.post('/saveCompany', controllers.admin.saveCompany);
route.post('/authenticate', controllers.client.authenticate);
route.post('/listVisits', controllers.client.listVisits);
route.post('/listVisitors', controllers.client.listVisitors);
route.post('/listSubscriptions', controllers.client.listSubscriptions);
route.post('/getDashboard', controllers.client.getDashboard);
route.post('/getBookings', controllers.client.getBookings);
route.post('/getBooking/:id', controllers.client.getBooking);

exports.route = route;