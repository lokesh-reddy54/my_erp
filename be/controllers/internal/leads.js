'use strict';

var Q = require('q');
var util = require('util');
var request = require('request-promise');
var jwt = require('jsonwebtoken');
var requestIp = require('request-ip');

var config = require('../../utils/config').config;
var log = require('../../utils/log').log;
var utils = require('../../utils/utils').utils;
var leadsService = require('../../services/leads').service;

var controller = {};


controller.listLeads = async (req, res) => {
  try {
    // log.write("ControllerService ::: listLeads :: data ", req.body);
    var data = await leadsService.listLeads(req.body);
    res.json({ data: data })
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
}
controller.globalSearch = async (req, res) => {
  try {
    // log.write("ControllerService ::: globalSearch :: data ", req.body);
    var data = await leadsService.globalSearch(req.params.search);
    res.json({ data: data })
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
}
controller.getLead = async (req, res) => {
  try {
    // log.write("ControllerService ::: getLead :: data ", req.body);
    var data = await leadsService.getLead(req.params.id);
    res.json({ data: data })
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
}
controller.getLeadPropositions = async (req, res) => {
  try {
    // log.write("ControllerService ::: getLeadPropositions :: data ", req.body);
    var data = await leadsService.getLeadPropositions(req.params.id);
    res.json({ data: data })
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
}
controller.getLeadMails = async (req, res) => {
  try {
    // log.write("ControllerService ::: getLeadMails :: data ", req.body);
    var data = await leadsService.getLeadMails(req.params.id);
    res.json({ data: data })
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
}
controller.getLeadCalls = async (req, res) => {
  try {
    // log.write("ControllerService ::: getLeadCalls :: data ", req.body);
    var data = await leadsService.getLeadCalls(req.params.id);
    res.json({ data: data })
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
}
controller.getLeadComments = async (req, res) => {
  try {
    // log.write("ControllerService ::: getLeadComments :: data ", req.body);
    var data = await leadsService.getLeadComments(req.params.id);
    res.json({ data: data })
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
}
controller.getLeadVisits = async (req, res) => {
  try {
    // log.write("ControllerService ::: getLeadVisits :: data ", req.body);
    var data = await leadsService.getLeadVisits(req.params.id);
    res.json({ data: data })
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
}

controller.deleteLead = async (req, res) => {
  try {
    // log.write("ControllerService ::: deleteLead :: data ", req.body);
    var data = await leadsService.deleteLead(req.params.id);
    res.json({ data: data })
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
}
controller.saveLead = async (req, res) => {
  try {
    // log.write("ControllerService ::: saveLead :: data ", req.body);
    var data = await leadsService.saveLead(utils.body(req), utils.getUserName(req));
    res.json({ data: data })
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
}
controller.saveLeadComment = async (req, res) => {
  try {
    // log.write("ControllerService ::: saveLeadComment :: data ", req.body);
    var data = await leadsService.saveLeadComment(req.body, utils.getUserName(req));
    res.json({ data: data })
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
}
controller.saveLeadProposition = async (req, res) => {
  try {
    // log.write("ControllerService ::: saveLeadProposition :: data ", req.body);
    var data = await leadsService.saveLeadProposition(req.body, utils.getUserName(req));
    res.json({ data: data })
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
}
controller.saveLeadCall = async (req, res) => {
  try {
    // log.write("ControllerService ::: saveLeadCall :: data ", req.body);
    var data = await leadsService.saveLeadCall(req.body, utils.getUserName(req));
    res.json({ data: data })
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
}
controller.saveLeadVisit = async (req, res) => {
  try {
    // log.write("ControllerService ::: saveLeadVisit :: data ", req.body);
    var data = await leadsService.saveLeadVisit(req.body, utils.getUserName(req));
    res.json({ data: data })
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
}


controller.sendQuotationMail = async (req, res) => {
  try {
    // log.write("ControllerService ::: sendQuotationMail :: data ", req.body);
    var data = await leadsService.sendQuotationMail(req.body, utils.getUserName(req));
    res.json({ data: data })
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
}
controller.savePriceQuote = async (req, res) => {
  try {
    // log.write("ControllerService ::: savePriceQuote :: data ", req.body);
    var data = await leadsService.savePriceQuote(req.body, utils.getUserName(req));
    res.json({ data: data })
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
}
controller.savePriceContract = async (req, res) => {
  try {
    log.write("ControllerService ::: savePriceContract :: data ", req.body);
    var data = await leadsService.savePriceContract(req.body, utils.getUserName(req));
    res.json({ data: data })
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
}
controller.getPropositionQuotes = async (req, res) => {
  try {
    // log.write("ControllerService ::: getPropositionQuotes :: data ", req.body);
    var data = await leadsService.getPropositionQuotes(req.params.id);
    res.json({ data: data })
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
}
controller.createPropositionQuote = async (req, res) => {
  try {
    // log.write("ControllerService ::: createPropositionQuote :: data ", req.body);
    var data = await leadsService.createPropositionQuote(req.body, utils.getUserName(req));
    res.json({ data: data })
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
}
controller.copyPropositionQuote = async (req, res) => {
  try {
    // log.write("ControllerService ::: copyPropositionQuote :: data ", req.body);
    var data = await leadsService.copyPropositionQuote(req.body, utils.getUserName(req));
    res.json({ data: data })
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
}
controller.updatePropositionQuote = async (req, res) => {
  try {
    // log.write("ControllerService ::: updatePropositionQuote :: data ", req.body);
    var data = await leadsService.updatePropositionQuote(req.body, utils.getUserName(req));
    res.json({ data: data })
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
}

controller.updateLeadPropositions = async (req, res) => {
  try {
    // log.write("ControllerService ::: updateLeadPropositions :: data ", req.body);
    var data = await leadsService.updateLeadPropositions(req.params.id);
    res.json({ data: data })
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
}

controller.sendLeadPropositions = async (req, res) => {
  try {
    // log.write("ControllerService ::: sendLeadPropositions :: data ", req.body);
    var data = await leadsService.sendLeadPropositions(req.params.id);
    res.json({ data: data })
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
}

controller.getVisits = async (req, res) => {
  try {
    // log.write("ControllerService ::: getVisits :: data ", req.body);
    var data = await leadsService.getVisits(req.body);
    res.json({ data: data })
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
}
controller.getVisit = async (req, res) => {
  try {
    // log.write("ControllerService ::: getVisit :: data ", req.body);
    var data = await leadsService.getVisit(req.params.id);
    res.json({ data: data })
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
}

exports.controller = controller;