'use strict';

var express = require('express');
var controllers = require('../../controllers/internal').controllers;
var utils = require('../../utils/utils.js').utils;
var config = require('../../utils/config.js').config;
var route = express.Router();

if (config.checkAuth) {
  route.use(utils.authChecker);
}

route.get('/downloadInvoices/:companyId/:month', controllers.reports.downloadInvoices);
route.get('/downloadBills/:companyId/:month', controllers.reports.downloadBills);
route.post('/listCustomers', controllers.reports.listCustomers);
route.post('/listProducts', controllers.reports.listProducts);
route.post('/listVendors', controllers.reports.listVendors);
route.post('/listTdsDueClients', controllers.reports.listTdsDueClients);
route.post('/getExpenseBills', controllers.reports.getExpenseBills);
route.post('/getRevenueInvoices', controllers.reports.getRevenueInvoices);
route.post('/listActivities', controllers.reports.listActivities);
route.post('/getExpenses', controllers.reports.getExpensesReport);
route.post('/getBills', controllers.reports.getBillsReport);
route.post('/getAR', controllers.reports.getARReport);
route.post('/getInvoiceSummery', controllers.reports.getInvoiceSummery);
route.post('/getTDSAR', controllers.reports.getTDSARReport);
route.post('/getTDSAPReport', controllers.reports.getTDSAPReport);
route.post('/sendTDSARNotifications', controllers.reports.sendTDSARNotifications);
route.post('/getRevenue', controllers.reports.getRevenueReport);
route.post('/getSupport', controllers.reports.getSupportReport);
route.post('/getProductsAnalysis', controllers.reports.getProductsAnalysis);
route.post('/getLiability', controllers.reports.getLiabilityReport);
route.post('/getAvailability', controllers.reports.getAvailabilityReport);
route.post('/listArCallHistory', controllers.reports.listArCallHistory);
route.post('/saveArCallHistory', controllers.reports.saveArCallHistory);
route.post('/listMiData', controllers.reports.listMiData);
route.post('/saveMiData', controllers.reports.saveMiData);
route.post('/getUserDashboards', controllers.reports.getUserDashboards);
route.post('/getClientDashboards', controllers.reports.getClientDashboards);
route.post('/getWorkBenches', controllers.reports.getWorkBenches);
route.post('/loadBuildingBookings', controllers.reports.loadBuildingBookings);
route.post('/loadBuildingTickets', controllers.reports.loadBuildingTickets);
route.post('/getTicketsByStatus', controllers.reports.getTicketsByStatus);
route.post('/loadBuildingProjects', controllers.reports.loadBuildingProjects);
route.post('/getProjectsByStatus', controllers.reports.getProjectsByStatus);
route.post('/loadBuildingWorkOrders', controllers.reports.loadBuildingWorkOrders);
route.post('/getWorkOrdersByStatus', controllers.reports.getWorkOrdersByStatus);
route.post('/loadBuildingPurchaseOrders', controllers.reports.loadBuildingPurchaseOrders);
route.post('/getPurchaseOrdersByStatus', controllers.reports.getPurchaseOrdersByStatus);
route.post('/loadBuildingBills', controllers.reports.loadBuildingBills);
route.post('/getBillsByStatus', controllers.reports.getBillsByStatus);
route.post('/loadBuildingBillsQueue', controllers.reports.loadBuildingBillsQueue);
route.post('/getBillsQueueByStatus', controllers.reports.getBillsQueueByStatus);
route.post('/getPurchaseBuilingWisePayables', controllers.reports.getPurchaseBuilingWisePayables);
route.post('/getPurchaseDueMilestones', controllers.reports.getPurchaseDueMilestones);
route.post('/getVendorStats', controllers.reports.getVendorStats);

exports.route = route;