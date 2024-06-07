'use strict';

var express = require('express');
var controllers = require('../../controllers/internal').controllers;
var utils = require('../../utils/utils.js').utils;
var config = require('../../utils/config.js').config;
var route = express.Router();

if (config.checkAuth) {
  route.use(utils.authChecker);
}

route.get('/globalSearch/:search', controllers.leads.globalSearch);
route.get('/getLead/:id', controllers.leads.getLead);
route.post('/getLeadPropositions/:id', controllers.leads.getLeadPropositions);
route.post('/getLeadMails/:id', controllers.leads.getLeadMails);
route.post('/getLeadCalls/:id', controllers.leads.getLeadCalls);
route.post('/getLeadComments/:id', controllers.leads.getLeadComments);
route.post('/getLeadVisits/:id', controllers.leads.getLeadVisits);
route.get('/deleteLead/:id', controllers.leads.deleteLead);
route.get('/updateLeadPropositions/:id', controllers.leads.updateLeadPropositions);
route.get('/getPropositionQuotes/:id', controllers.leads.getPropositionQuotes);
route.post('/createPropositionQuote', controllers.leads.createPropositionQuote);
route.post('/copyPropositionQuote', controllers.leads.copyPropositionQuote);
route.post('/updatePropositionQuote', controllers.leads.updatePropositionQuote);
route.post('/savePriceQuote', controllers.leads.savePriceQuote);
route.post('/savePriceContract', controllers.leads.savePriceContract);
route.post('/sendQuotationMail', controllers.leads.sendQuotationMail);
route.post('/listLeads', controllers.leads.listLeads);
route.post('/saveLead', controllers.leads.saveLead);
route.post('/saveLeadComment', controllers.leads.saveLeadComment);
route.post('/saveLeadProposition', controllers.leads.saveLeadProposition);
route.post('/saveLeadVisit', controllers.leads.saveLeadVisit);
route.post('/saveLeadCall', controllers.leads.saveLeadCall);
route.get('/sendLeadPropositions/:id', controllers.leads.sendLeadPropositions);
route.post('/getVisits', controllers.leads.getVisits);
route.get('/getVisit/:id', controllers.leads.getVisit);

exports.route = route;