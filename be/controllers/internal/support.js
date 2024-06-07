'use strict';

var Q = require('q');
var util = require('util');
var request = require('request-promise');
var jwt = require('jsonwebtoken');
var requestIp = require('request-ip');

var config = require('../../utils/config').config;
var log = require('../../utils/log').log;
var utils = require('../../utils/utils').utils;
var supportService = require('../../services/support').service;

var controller = {};

controller.listTickets = async (req, res) => {
  try {
    // log.write("ControllerService ::: listTickets :: data ", req.body);
    var data = await supportService.listTickets(req.body);
    res.json({ data: data })
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
}
controller.getTicket = async (req, res) => {
  try {
    // log.write("ControllerService ::: getTicket :: data ", req.body);
    var data = await supportService.getTicket(req.params.id);
    res.json({ data: data })
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
}
controller.assignTicket = async (req, res) => {
  try {
    // log.write("ControllerService ::: assignTicket :: data ", req.body);
    var data = await supportService.assignTicket(req.params.id);
    res.json({ data: data })
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
}
controller.getTicketMessages = async (req, res) => {
  try {
    // log.write("ControllerService ::: getTicketMessages :: data ", req.body);
    var data = await supportService.getTicketMessages(req.params.id);
    res.json({ data: data })
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
}
controller.getTicketMails = async (req, res) => {
  try {
    // log.write("ControllerService ::: getTicketMails :: data ", req.body);
    var data = await supportService.getTicketMails(req.params.id);
    res.json({ data: data })
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
}
controller.getTicketCalls = async (req, res) => {
  try {
    // log.write("ControllerService ::: getTicketCalls :: data ", req.body);
    var data = await supportService.getTicketCalls(req.params.id);
    res.json({ data: data })
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
}
controller.deleteTicket = async (req, res) => {
  try {
    // log.write("ControllerService ::: deleteTicket :: data ", req.body);
    var data = await supportService.deleteTicket(req.params.id, utils.getUserName(req));
    res.json({ data: data })
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
}
controller.saveTicket = async (req, res) => {
  try {
    // log.write("ControllerService ::: saveTicket :: data ", req.body);
    var data = await supportService.saveTicket(utils.body(req), utils.getUserName(req));
    res.json({ data: data })
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
}
controller.getSupportUsers = async (req, res) => {
  try {
    // log.write("ControllerService ::: getSupportUsers :: data ", req.body);
    var data = await supportService.getSupportUsers(utils.body(req), utils.getUserName(req));
    res.json({ data: data })
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
}
controller.getManagerUsers = async (req, res) => {
  try {
    // log.write("ControllerService ::: getManagerUsers :: data ", req.body);
    var data = await supportService.getManagerUsers(utils.body(req), utils.getUserName(req));
    res.json({ data: data })
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
}
controller.saveTicketMessage = async (req, res) => {
  try {
    var data = await supportService.saveTicketMessage(utils.body(req));
    res.json({ data: data })
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
}


controller.getCategories = async (req, res) => {
  try {
    // log.write("ControllerService ::: getCategories :: data ", req.body);
    var data = await supportService.getCategories();
    res.json({ data: data })
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
}
controller.getPriorities = async (req, res) => {
  try {
    // log.write("ControllerService ::: getPriorities :: data ", req.body);
    var data = await supportService.getPriorities();
    res.json({ data: data })
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
}
controller.saveTicketCategory = async (req, res) => {
  try {
    // log.write("ControllerService ::: saveTicketCategory :: data ", req.body);
    var data = await supportService.saveTicketCategory(req.body, utils.getUserName(req));
    res.json({ data: data })
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
}
controller.saveTicketSubCategory = async (req, res) => {
  try {
    // log.write("ControllerService ::: saveTicketSubCategory :: data ", req.body);
    var data = await supportService.saveTicketSubCategory(req.body, utils.getUserName(req));
    res.json({ data: data })
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
}
controller.saveTicketContext = async (req, res) => {
  try {
    // log.write("ControllerService ::: saveTicketContext :: data ", req.body);
    var data = await supportService.saveTicketContext(req.body, utils.getUserName(req));
    res.json({ data: data })
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
}
controller.savePriority = async (req, res) => {
  try {
    // log.write("ControllerService ::: savePriority :: data ", req.body);
    var data = await supportService.savePriority(req.body, utils.getUserName(req));
    res.json({ data: data })
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
}

exports.controller = controller;