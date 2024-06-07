'use strict';

var express = require('express');
var controllers = require('../../controllers/internal').controllers;
var utils = require('../../utils/utils.js').utils;
var config = require('../../utils/config.js').config;
var route = express.Router();

if (config.checkAuth) {
  route.use(utils.authChecker);
}

route.get('/getInitData/:id', controllers.selfcare.getInitData);
route.post('/acceptFinalStatement', controllers.selfcare.acceptFinalStatement);
route.post('/requestOTP', controllers.selfcare.requestOTP);
route.post('/verifyOTP', controllers.selfcare.verifyOTP);

exports.route = route;