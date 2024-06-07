'use strict';

var Q = require('q');
var util = require('util');
var request = require('request-promise');
var jwt = require('jsonwebtoken');
var requestIp = require('request-ip');

var config = require('../../utils/config').config;
var log = require('../../utils/log').log;
var utils = require('../../utils/utils').utils;
var accountsService = require('../../services/accounts').service;
var bookingsService = require('../../services/bookings').service;

var controller = {};

controller.getInitData = async (req, res) => {
  try {
    // log.write("ControllerService ::: getInitData :: data ", req.body);
    var data = await accountsService.getInitData(req.params.id);
    res.json({ data: data })
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
}
controller.getOpexCategories = async (req, res) => {
  try {
    // log.write("ControllerService ::: getOpexCategories :: data ", req.body);
    var data = await accountsService.getOpexCategories(utils.body(req));
    res.json({ data: data })
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
}
controller.listOpexCategories = async (req, res) => {
  try {
    // log.write("ControllerService ::: listOpexCategories :: data ", req.body);
    var data = await accountsService.listOpexCategories(utils.body(req));
    res.json({ data: data })
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
}
controller.saveOpexCategory = async (req, res) => {
  try {
    // log.write("ControllerService ::: saveOpexCategory :: data ", req.body);
    var data = await accountsService.saveOpexCategory(utils.body(req));
    res.json({ data: data })
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
}
controller.listOpexTypes = async (req, res) => {
  try {
    // log.write("ControllerService ::: listOpexTypes :: data ", req.body);
    var data = await accountsService.listOpexTypes(utils.body(req));
    res.json({ data: data })
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
}
controller.saveOpexType = async (req, res) => {
  try {
    // log.write("ControllerService ::: saveOpexType :: data ", req.body);
    var data = await accountsService.saveOpexType(utils.body(req));
    res.json({ data: data })
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
}
controller.listOpexPayments = async (req, res) => {
  try {
    // log.write("ControllerService ::: listOpexPayments :: data ", req.body);
    var data = await accountsService.listOpexPayments(utils.body(req));
    res.json({ data: data })
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
}
controller.saveOpexPayment = async (req, res) => {
  try {
    // log.write("ControllerService ::: saveOpexPayment :: data ", req.body);
    var data = await accountsService.saveOpexPayment(utils.body(req));
    res.json({ data: data })
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
}
controller.listOpexBills = async (req, res) => {
  try {
    // log.write("ControllerService ::: listOpexBills :: data ", req.body);
    var data = await accountsService.listOpexBills(utils.body(req));
    res.json({ data: data })
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
}
controller.listBillItems = async (req, res) => {
  try {
    // log.write("ControllerService ::: listBillItems :: data ", req.body);
    var data = await accountsService.listBillItems(utils.body(req));
    res.json({ data: data })
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
}
controller.saveOpexBill = async (req, res) => {
  try {
    // log.write("ControllerService ::: saveOpexBill :: data ", req.body);
    var data = await accountsService.saveOpexBill(utils.body(req), utils.getUserName(req));
    res.json({ data: data })
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
}
controller.getRecurringBillSuggestions = async (req, res) => {
  try {
    // log.write("ControllerService ::: getRecurringBillSuggestions :: data ", req.body);
    var data = await accountsService.getRecurringBillSuggestions(utils.body(req), utils.getUserName(req));
    res.json({ data: data })
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
}
controller.listBillsQueue = async (req, res) => {
  try {
    // log.write("ControllerService ::: listBillsQueue :: data ", req.body);
    var data = await accountsService.listBillsQueue(utils.body(req));
    res.json({ data: data })
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
}
controller.saveBillsQueue = async (req, res) => {
  try {
    // log.write("ControllerService ::: saveBillsQueue :: data ", req.body);
    var data = await accountsService.saveBillsQueue(utils.body(req), utils.getUserName(req));
    res.json({ data: data })
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
}
controller.mapBillsQueue = async (req, res) => {
  try {
    // log.write("ControllerService ::: mapBillsQueue :: data ", req.body);
    var data = await accountsService.mapBillsQueue(utils.body(req), utils.getUserName(req));
    res.json({ data: data })
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
}
controller.raiseOpexBills = async (req, res) => {
  try {
    // log.write("ControllerService ::: raiseOpexBills :: data ", req.body);
    var data = await accountsService.raiseOpexBills(utils.body(req));
    res.json({ data: data })
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
}
controller.listPayments = async (req, res) => {
  try {
    // log.write("ControllerService ::: listPayments :: data ", req.body);
    var data = await accountsService.listPayments(utils.body(req));
    res.json({ data: data })
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
}
controller.getPayinsByStatus = async (req, res) => {
  try {
    // log.write("ControllerService ::: getPayinsByStatus :: data ", req.body);
    var data = await accountsService.getPayinsByStatus(utils.body(req));
    res.json({ data: data })
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
}
controller.getPayoutsByStatus = async (req, res) => {
  try {
    // log.write("ControllerService ::: getPayoutsByStatus :: data ", req.body);
    var data = await accountsService.getPayoutsByStatus(utils.body(req));
    res.json({ data: data })
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
}
controller.getPayoutEntry = async (req, res) => {
  try {
    // log.write("ControllerService ::: getPayoutEntry :: data ", req.body);
    var data = await accountsService.getPayoutEntry(utils.body(req));
    res.json({ data: data })
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
}
controller.getPayoutEntriesByStatus = async (req, res) => {
  try {
    // log.write("ControllerService ::: getPayoutEntriesByStatus :: data ", req.body);
    var data = await accountsService.getPayoutEntriesByStatus(utils.body(req));
    res.json({ data: data })
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
}
controller.getDebitSuggestions = async (req, res) => {
  try {
    // log.write("ControllerService ::: getDebitSuggestions :: data ", req.body);
    var data = await accountsService.getDebitSuggestions(utils.body(req));
    res.json({ data: data })
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
}
controller.getAttributeSuggestions = async (req, res) => {
  try {
    // log.write("ControllerService ::: getAttributeSuggestions :: data ", req.body);
    var data = await accountsService.getAttributeSuggestions(utils.body(req));
    res.json({ data: data })
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
}
controller.mapImageToBill = async (req, res) => {
  try {
    // log.write("ControllerService ::: mapImageToBill :: data ", req.body);
    var data = await accountsService.mapImageToBill(utils.body(req), utils.getUserName(req));
    res.json({ data: data })
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
}
controller.listPayinEntries = async (req, res) => {
  try {
    // log.write("ControllerService ::: listPayinEntries :: data ", req.body);
    var data = await accountsService.listPayinEntries(utils.body(req));
    res.json({ data: data })
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
}
controller.savePayment = async (req, res) => {
  try {
    // log.write("ControllerService :::.savePayment :: data ", req.body);
    var data = await bookingsService.savePayment(utils.body(req), utils.getUserName(req));
    res.json({ data: data })
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
}
controller.savePayinEntry = async (req, res) => {
  try {
    // log.write("ControllerService ::: savePayinEntry :: data ", req.body);
    var data = await accountsService.savePayinEntry(utils.body(req), utils.getUserName(req));
    res.json({ data: data })
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
}
controller.listPayoutEntries = async (req, res) => {
  try {
    // log.write("ControllerService ::: listPayoutEntries :: data ", req.body);
    var data = await accountsService.listPayoutEntries(utils.body(req));
    res.json({ data: data })
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
}
controller.savePayoutEntry = async (req, res) => {
  try {
    // log.write("ControllerService ::: savePayoutEntry :: data ", req.body);
    var data = await accountsService.savePayoutEntry(utils.body(req), utils.getUserName(req));
    res.json({ data: data })
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
}
controller.listPayouts = async (req, res) => {
  try {
    // log.write("ControllerService ::: listPayouts :: data ", req.body);
    var data = await accountsService.listPayouts(utils.body(req));
    res.json({ data: data })
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
}
controller.savePayout = async (req, res) => {
  try {
    // log.write("ControllerService ::: savePayout :: data ", req.body);
    var data = await accountsService.savePayout(utils.body(req), utils.getUserName(req));
    res.json({ data: data })
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
}
controller.processPayout = async (req, res) => {
  try {
    // log.write("ControllerService ::: processPayout :: data ", req.body);
    var data = await accountsService.processPayout(utils.body(req), utils.getUserName(req));
    res.json({ data: data })
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
}
controller.updatePayoutStatus = async (req, res) => {
  try {
    // log.write("ControllerService ::: updatePayoutStatus :: data ", req.body);
    var data = await accountsService.updatePayoutStatus(utils.body(req), utils.getUserName(req));
    res.json({ data: data })
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
}
controller.listInvoiceServices = async (req, res) => {
  try {
    // log.write("ControllerService ::: listInvoiceServices :: data ", req.body);
    var data = await accountsService.listInvoiceServices(utils.body(req));
    res.json({ data: data })
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
}
controller.saveInvoiceService = async (req, res) => {
  try {
    // log.write("ControllerService ::: saveInvoiceService :: data ", req.body);
    var data = await accountsService.saveInvoiceService(utils.body(req));
    res.json({ data: data })
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
}

controller.listServicePayments = async (req, res) => {
  try {
    // log.write("ControllerService ::: listServicePayments :: data ", req.body);
    var data = await accountsService.listServicePayments(utils.body(req));
    res.json({ data: data })
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
}
controller.saveServicePayment = async (req, res) => {
  try {
    // log.write("ControllerService ::: saveServicePayment :: data ", req.body);
    var data = await accountsService.saveServicePayment(utils.body(req), utils.getUserName(req));
    res.json({ data: data })
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
}
controller.listServiceBills = async (req, res) => {
  try {
    // log.write("ControllerService ::: listServiceBills :: data ", req.body);
    var data = await accountsService.listServiceBills(utils.body(req));
    res.json({ data: data })
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
}
controller.raiseServiceBills = async (req, res) => {
  try {
    // log.write("ControllerService ::: raiseServiceBills :: data ", req.body);
    var data = await accountsService.raiseServiceBills(utils.body(req), utils.getUserName(req));
    res.json({ data: data })
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
}
controller.saveServiceBill = async (req, res) => {
  try {
    // log.write("ControllerService ::: saveServiceBill :: data ", req.body);
    var data = await accountsService.saveServiceBill(utils.body(req), utils.getUserName(req));
    res.json({ data: data })
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
}


exports.controller = controller;