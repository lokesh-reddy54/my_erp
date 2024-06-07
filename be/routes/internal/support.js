'use strict';

var express = require('express');
var controllers = require('../../controllers/internal').controllers;
var utils = require('../../utils/utils.js').utils;
var config = require('../../utils/config.js').config;
var route = express.Router();

if (config.checkAuth) {
  route.use(utils.authChecker);
}

route.get('/getTicket/:id', controllers.support.getTicket);
route.post('/getTicketMessages/:id', controllers.support.getTicketMessages);
route.post('/getTicketMails/:id', controllers.support.getTicketMails);
route.post('/getTicketCalls/:id', controllers.support.getTicketCalls);
route.get('/assignTicket/:id', controllers.support.assignTicket);
route.get('/deleteTicket/:id', controllers.support.deleteTicket);
route.post('/getSupportUsers', controllers.support.getSupportUsers);
route.post('/getManagerUsers', controllers.support.getManagerUsers);
route.post('/listTickets', controllers.support.listTickets);
route.post('/saveTicket', controllers.support.saveTicket);
route.post('/saveTicketMessage', controllers.support.saveTicketMessage);
route.post('/getCategories', controllers.support.getCategories);
route.post('/getPriorities', controllers.support.getPriorities);
route.post('/saveTicketCategory', controllers.support.saveTicketCategory);
route.post('/saveTicketSubCategory', controllers.support.saveTicketSubCategory);
route.post('/saveTicketContext', controllers.support.saveTicketContext);
route.post('/savePriority', controllers.support.savePriority);

exports.route = route;