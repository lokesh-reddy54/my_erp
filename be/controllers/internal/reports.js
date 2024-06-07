'use strict';

var Q = require('q');
var util = require('util');
var request = require('request-promise');
var jwt = require('jsonwebtoken');
var requestIp = require('request-ip');
var zip = require('express-zip');

var config = require('../../utils/config').config;
var log = require('../../utils/log').log;
var utils = require('../../utils/utils').utils;
var reportsService = require('../../services/reports').service;

var controller = {};

controller.downloadBills = async (req, res) => {
  try {
    // log.write("ControllerService ::: downloadBills :: data ", req.body);
    var invoices = await reportsService.downloadBills({ companyId: req.params.companyId, month: req.params.month });
    // log.write("ControllerService ::: downloadBills :: invoices ", invoices);
    res.zip(invoices, req.params.month + "-bills.zip");
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
}
controller.downloadInvoices = async (req, res) => {
  try {
    // log.write("ControllerService ::: downloadInvoices :: data ", req.body);
    var invoices = await reportsService.downloadInvoices({ companyId: req.params.companyId, month: req.params.month });
    // log.write("ControllerService ::: downloadInvoices :: invoices ", invoices);
    res.zip(invoices, req.params.month + "-invoices.zip");
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
}
controller.listVendors = async (req, res) => {
  try {
    // log.write("ControllerService ::: listVendors :: data ", req.body);
    var data = await reportsService.listVendors(utils.body(req));
    res.json({ data: data });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
}
controller.listCustomers = async (req, res) => {
  try {
    // log.write("ControllerService ::: listCustomers :: data ", req.body);
    var data = await reportsService.listCustomers(utils.body(req));
    res.json({ data: data });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
}
controller.getExpenseBills = async (req, res) => {
  try {
    // log.write("ControllerService ::: getExpenseBills :: data ", req.body);
    var data = await reportsService.getExpenseBills(utils.body(req));
    res.json({ data: data });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
}
controller.listTdsDueClients = async (req, res) => {
  try {
    // log.write("ControllerService ::: listTdsDueClients :: data ", req.body);
    var data = await reportsService.listTdsDueClients(utils.body(req));
    res.json({ data: data });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
}
controller.listProducts = async (req, res) => {
  try {
    // log.write("ControllerService ::: listProducts :: data ", req.body);
    var data = await reportsService.listProducts(utils.body(req));
    res.json({ data: data });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
}
controller.getRevenueInvoices = async (req, res) => {
  try {
    // log.write("ControllerService ::: getRevenueInvoices :: data ", req.body);
    var data = await reportsService.getRevenueInvoices(utils.body(req));
    res.json({ data: data });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
}
controller.listActivities = async (req, res) => {
  try {
    // log.write("ControllerService ::: listActivities :: data ", req.body);
    var data = await reportsService.listActivities(utils.body(req));
    res.json({ data: data });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
}
controller.getExpensesReport = async (req, res) => {
  try {
    // log.write("ControllerService ::: getExpensesReport :: data ", req.body);
    var data = await reportsService.getExpensesReport(utils.body(req));
    res.json({ data: data });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
}
controller.getBillsReport = async (req, res) => {
  try {
    // log.write("ControllerService ::: getBillsReport :: data ", req.body);
    var data = await reportsService.getBillsReport(utils.body(req));
    res.json({ data: data });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
}
controller.getRevenueReport = async (req, res) => {
  try {
    // log.write("ControllerService ::: getRevenueReport :: data ", req.body);
    var data = await reportsService.getRevenueReport(utils.body(req));
    res.json({ data: data });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
}
controller.getSupportReport = async (req, res) => {
  try {
    // log.write("ControllerService ::: getSupportReport :: data ", req.body);
    var data = await reportsService.getSupportReport(utils.body(req));
    res.json({ data: data });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
}
controller.getProductsAnalysis = async (req, res) => {
  try {
    // log.write("ControllerService ::: getProductsAnalysis :: data ", req.body);
    var data = await reportsService.getProductsAnalysis(utils.body(req));
    res.json({ data: data });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
}
controller.getLiabilityReport = async (req, res) => {
  try {
    // log.write("ControllerService ::: getLiabilityReport :: data ", req.body);
    var data = await reportsService.getLiabilityReport(utils.body(req));
    res.json({ data: data });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
}

controller.getARReport = async (req, res) => {
  try {
    // log.write("ControllerService ::: getARReport :: data ", req.body);
    var data = await reportsService.getARReport(utils.body(req));
    res.json({ data: data });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
}
controller.getInvoiceSummery = async (req, res) => {
  try {
    // log.write("ControllerService ::: getARReport :: data ", req.body);
    var data = await reportsService.getInvoiceSummery(utils.body(req));
    res.json({ data: data });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
}
controller.getTDSARReport = async (req, res) => {
  try {
    // log.write("ControllerService ::: getTDSARReport :: data ", req.body);
    var data = await reportsService.getTDSARReport(utils.body(req));
    res.json({ data: data });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
}
controller.getTDSAPReport = async (req, res) => {
  try {
    // log.write("ControllerService ::: getTDSAPReport :: data ", req.body);
    var data = await reportsService.getTDSAPReport(utils.body(req));
    res.json({ data: data });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
}
controller.sendTDSARNotifications = async (req, res) => {
  try {
    // log.write("ControllerService ::: sendTDSARNotifications :: data ", req.body);
    var data = await reportsService.sendTDSARNotifications(utils.body(req));
    res.json({ data: data });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
}

controller.getAvailabilityReport = async (req, res) => {
  try {
    // log.write("ControllerService ::: getAvailabilityReport :: data ", req.body);
    var data = await reportsService.getAvailabilityReport(utils.body(req));
    res.json({ data: data });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
}
controller.listArCallHistory = async (req, res) => {
  try {
    // log.write("ControllerService ::: listArCallHistory :: data ", req.body);
    var data = await reportsService.listArCallHistory(utils.body(req));
    res.json({ data: data });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
}
controller.saveArCallHistory = async (req, res) => {
  try {
    // log.write("ControllerService ::: saveArCallHistory :: data ", req.body);
    var data = await reportsService.saveArCallHistory(utils.body(req), utils.getUserName(req));
    res.json({ data: data });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
}
controller.listMiData = async (req, res) => {
  try {
    // log.write("ControllerService ::: listMiData :: data ", req.body);
    var data = await reportsService.listMiData(utils.body(req));
    res.json({ data: data });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
}
controller.saveMiData = async (req, res) => {
  try {
    // log.write("ControllerService ::: saveMiData :: data ", req.body);
    var data = await reportsService.saveMiData(utils.body(req), utils.getUserName(req));
    res.json({ data: data });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
}

controller.getUserDashboards = async (req, res) => {
  try {
    // log.write("ControllerService ::: getUserDashboards :: data ", req.body);
    var data = await reportsService.getUserDashboards(utils.body(req), utils.getUserName(req));
    res.json({ data: data });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
}
controller.getClientDashboards = async (req, res) => {
  try {
    // log.write("ControllerService ::: getClientDashboards :: data ", req.body);
    var data = await reportsService.getClientDashboards(utils.body(req), utils.getUserName(req));
    res.json({ data: data });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
}
controller.getWorkBenches = async (req, res) => {
  try {
    // log.write("ControllerService ::: getWorkBenches :: data ", req.body);
    var data = await reportsService.getWorkBenches(utils.body(req), utils.getUserName(req));
    res.json({ data: data });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
}
controller.loadBuildingBookings = async (req, res) => {
  try {
    // log.write("ControllerService ::: loadBuildingBookings :: data ", req.body);
    var data = await reportsService.loadBuildingBookings(utils.body(req), utils.getUserName(req));
    res.json({ data: data });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
}
controller.loadBuildingTickets = async (req, res) => {
  try {
    // log.write("ControllerService ::: loadBuildingTickets :: data ", req.body);
    var data = await reportsService.loadBuildingTickets(utils.body(req), utils.getUserName(req));
    res.json({ data: data });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
}
controller.getTicketsByStatus = async (req, res) => {
  try {
    // log.write("ControllerService ::: getTicketsByStatus :: data ", req.body);
    var data = await reportsService.getTicketsByStatus(utils.body(req), utils.getUserName(req));
    res.json({ data: data });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
}
controller.loadBuildingProjects = async (req, res) => {
  try {
    // log.write("ControllerService ::: loadBuildingProjects :: data ", req.body);
    var data = await reportsService.loadBuildingProjects(utils.body(req), utils.getUserName(req));
    res.json({ data: data });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
}
controller.getProjectsByStatus = async (req, res) => {
  try {
    // log.write("ControllerService ::: getProjectsByStatus :: data ", req.body);
    var data = await reportsService.getProjectsByStatus(utils.body(req), utils.getUserName(req));
    res.json({ data: data });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
}
controller.loadBuildingPurchaseOrders = async (req, res) => {
  try {
    // log.write("ControllerService ::: loadBuildingPurchaseOrders :: data ", req.body);
    var data = await reportsService.loadBuildingPurchaseOrders(utils.body(req), utils.getUserName(req));
    res.json({ data: data });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
}
controller.getPurchaseOrdersByStatus = async (req, res) => {
  try {
    // log.write("ControllerService ::: getPurchaseOrdersByStatus :: data ", req.body);
    var data = await reportsService.getPurchaseOrdersByStatus(utils.body(req), utils.getUserName(req));
    res.json({ data: data });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
}
controller.loadBuildingWorkOrders = async (req, res) => {
  try {
    // log.write("ControllerService ::: loadBuildingWorkOrders :: data ", req.body);
    var data = await reportsService.loadBuildingWorkOrders(utils.body(req), utils.getUserName(req));
    res.json({ data: data });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
}
controller.getWorkOrdersByStatus = async (req, res) => {
  try {
    // log.write("ControllerService ::: getWorkOrdersByStatus :: data ", req.body);
    var data = await reportsService.getWorkOrdersByStatus(utils.body(req), utils.getUserName(req));
    res.json({ data: data });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
}
controller.loadBuildingBills = async (req, res) => {
  try {
    // log.write("ControllerService ::: loadBuildingBills :: data ", req.body);
    var data = await reportsService.loadBuildingBills(utils.body(req), utils.getUserName(req));
    res.json({ data: data });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
}
controller.getBillsByStatus = async (req, res) => {
  try {
    // log.write("ControllerService ::: getBillsByStatus :: data ", req.body);
    var data = await reportsService.getBillsByStatus(utils.body(req), utils.getUserName(req));
    res.json({ data: data });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
}

controller.loadBuildingBillsQueue = async (req, res) => {
  try {
    // log.write("ControllerService ::: loadBuildingBillsQueue :: data ", req.body);
    var data = await reportsService.loadBuildingBillsQueue(utils.body(req), utils.getUserName(req));
    res.json({ data: data });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
}
controller.getBillsQueueByStatus = async (req, res) => {
  try {
    // log.write("ControllerService ::: getBillsQueueByStatus :: data ", req.body);
    var data = await reportsService.getBillsQueueByStatus(utils.body(req), utils.getUserName(req));
    res.json({ data: data });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
}

controller.getVendorStats = async (req, res) => {
  try {
    // log.write("ControllerService ::: getVendorStats :: data ", req.body);
    var data = await reportsService.getVendorStats(utils.body(req), utils.getUserName(req));
    res.json({ data: data });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
}

controller.getPurchaseBuilingWisePayables = async (req, res) => {
  try {
    // log.write("ControllerService ::: getPurchaseBuilingWisePayables :: data ", req.body);
    var data = await reportsService.getPurchaseBuilingWisePayables(utils.body(req), utils.getUserName(req));
    res.json({ data: data });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
}
controller.getPurchaseDueMilestones = async (req, res) => {
  try {
    // log.write("ControllerService ::: getPurchaseDueMilestones :: data ", req.body);
    var data = await reportsService.getPurchaseDueMilestones(utils.body(req), utils.getUserName(req));
    res.json({ data: data });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
}

exports.controller = controller;