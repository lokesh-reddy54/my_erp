'use strict';

var express = require('express');
var controllers = require('../../controllers/internal').controllers;
var utils = require('../../utils/utils.js').utils;
var config = require('../../utils/config.js').config;
var route = express.Router();

if (config.checkAuth) {
  route.use(utils.authChecker);
}

route.get('/getInitData/:id', controllers.accounts.getInitData);
route.post('/getOpexCategories', controllers.accounts.getOpexCategories);
route.post('/listOpexCategories', controllers.accounts.listOpexCategories);
route.post('/saveOpexCategory', controllers.accounts.saveOpexCategory);
route.post('/listOpexTypes', controllers.accounts.listOpexTypes);
route.post('/saveOpexType', controllers.accounts.saveOpexType);
route.post('/listOpexPayments', controllers.accounts.listOpexPayments);
route.post('/saveOpexPayment', controllers.accounts.saveOpexPayment);
route.post('/listOpexBills', controllers.accounts.listOpexBills);
route.post('/listBillItems', controllers.accounts.listBillItems);
route.post('/saveOpexBill', controllers.accounts.saveOpexBill);
route.post('/listBillsQueue', controllers.accounts.listBillsQueue);
route.post('/saveBillsQueue', controllers.accounts.saveBillsQueue);
route.post('/mapBillsQueue', controllers.accounts.mapBillsQueue);
route.post('/getRecurringBillSuggestions', controllers.accounts.getRecurringBillSuggestions);
route.post('/raiseOpexBills', controllers.accounts.raiseOpexBills);
route.post('/listPayments', controllers.accounts.listPayments);
route.post('/getPayoutEntry', controllers.accounts.getPayoutEntry);
route.post('/getPayoutsByStatus', controllers.accounts.getPayoutsByStatus);
route.post('/getPayoutEntriesByStatus', controllers.accounts.getPayoutEntriesByStatus);
route.post('/getPayinsByStatus', controllers.accounts.getPayinsByStatus);
route.post('/getDebitSuggestions', controllers.accounts.getDebitSuggestions);
route.post('/getAttributeSuggestions', controllers.accounts.getAttributeSuggestions);
route.post('/mapImageToBill', controllers.accounts.mapImageToBill);
route.post('/listPayinEntries', controllers.accounts.listPayinEntries);
route.post('/savePayment', controllers.accounts.savePayment);
route.post('/listPayoutEntries', controllers.accounts.listPayoutEntries);
route.post('/savePayinEntry', controllers.accounts.savePayinEntry);
route.post('/savePayoutEntry', controllers.accounts.savePayoutEntry);
route.post('/listPayouts', controllers.accounts.listPayouts);
route.post('/savePayout', controllers.accounts.savePayout);
route.post('/processPayout', controllers.accounts.processPayout);
route.post('/updatePayoutStatus', controllers.accounts.updatePayoutStatus);
route.post('/listInvoiceServices', controllers.accounts.listInvoiceServices);
route.post('/saveInvoiceService', controllers.accounts.saveInvoiceService);
route.post('/listServicePayments', controllers.accounts.listServicePayments);
route.post('/saveServicePayment', controllers.accounts.saveServicePayment);
route.post('/listServiceBills', controllers.accounts.listServiceBills);
route.post('/raiseServiceBills', controllers.accounts.raiseServiceBills);
route.post('/saveServiceBill', controllers.accounts.saveServiceBill);

exports.route = route;