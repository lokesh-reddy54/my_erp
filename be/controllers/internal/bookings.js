"use strict";

var Q = require("q");
var util = require("util");
var request = require("request-promise");
var jwt = require("jsonwebtoken");
var requestIp = require("request-ip");

var config = require("../../utils/config").config;
var log = require("../../utils/log").log;
var utils = require("../../utils/utils").utils;
var bookingsService = require("../../services/bookings").service;

var controller = {};

controller.listClients = async (req, res) => {
  try {
    // log.write("ControllerService ::: listClients :: data ", req.body);
    var users = await bookingsService.listClients(utils.body(req));
    res.json({ data: users });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
};
controller.listResourceBookings = async (req, res) => {
  try {
    // log.write("ControllerService ::: listResourceBookings :: data ", req.body);
    var users = await bookingsService.listResourceBookings(utils.body(req));
    res.json({ data: users });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
};
controller.listBookings = async (req, res) => {
  try {
    // log.write("ControllerService ::: listBookings :: data ", req.body);
    var users = await bookingsService.listBookings(utils.body(req));
    res.json({ data: users });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
};
controller.listParkingBookings = async (req, res) => {
  try {
    // log.write("ControllerService ::: listBookings :: data ", req.body);
    var users = await bookingsService.listParkingBookings(utils.body(req));
    res.json({ data: users });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
};

controller.searchBookings = async (req, res) => {
  try {
    // log.write("ControllerService ::: searchBookings :: data ", req.body);
    var users = await bookingsService.searchBookings(utils.body(req));
    res.json({ data: users });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
};
controller.getBookings = async (req, res) => {
  try {
    // log.write("ControllerService ::: getBookings :: data ", req.body);
    var users = await bookingsService.getBookings(utils.body(req));
    res.json({ data: users });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
};
controller.saveBooking = async (req, res) => {
  try {
    // log.write("ControllerService ::: saveBooking :: data ", req.body);
    var user = await bookingsService.saveBooking(
      req.body,
      utils.getUserName(req)
    );
    res.json({ data: user });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
};
controller.saveResourceBooking = async (req, res) => {
  try {
    // log.write("ControllerService ::: saveResourceBooking :: data ", req.body);
    var user = await bookingsService.saveResourceBooking(
      req.body,
      utils.getUserName(req)
    );
    res.json({ data: user });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
};
controller.listBookingMails = async (req, res) => {
  try {
    // log.write("ControllerService ::: listBookingMails :: data ", req.body);
    var user = await bookingsService.listBookingMails(
      req.body,
      utils.getUserName(req)
    );
    res.json({ data: user });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
};
controller.getBooking = async (req, res) => {
  try {
    // log.write("ControllerService ::: getBooking :: data ", req.body);
    var user = await bookingsService.getBooking(req.params.id);
    res.json({ data: user });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
};
controller.getBookingExitRequest = async (req, res) => {
  try {
    // log.write("ControllerService ::: getBookingExitRequest :: data ", req.body);
    var user = await bookingsService.getBookingExitRequest(req.params.id);
    res.json({ data: user });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
};
controller.getInvoices = async (req, res) => {
  try {
    // log.write("ControllerService ::: getInvoices :: data ", req.body);
    var invoices = await bookingsService.getInvoices(req.params.id);
    res.json({ data: invoices });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
};
controller.getAllInvoices = async (req, res) => {
  try {
    // log.write("ControllerService ::: getInvoices :: data ", req.body);
    var invoices = await bookingsService.getAllInvoices(utils.body(req));
    res.json({ data: invoices });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
};
controller.updateInvoiceStatus = async (req, res) => {
  try {
    // log.write("ControllerService ::: getInvoices :: data ", req.body);
    var invoices = await bookingsService.updateInvoiceStatus(utils.body(req));
    res.json({ data: invoices });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
};
controller.getPayments = async (req, res) => {
  try {
    // log.write("ControllerService ::: getPayments :: data ", req.body);
    var invoices = await bookingsService.getPayments(req.params.id);
    res.json({ data: invoices });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
};
controller.getContracts = async (req, res) => {
  try {
    // log.write("ControllerService ::: getContracts :: data ", req.body);
    var invoices = await bookingsService.getContracts(req.params.id);
    res.json({ data: invoices });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
};
controller.getResourceBookings = async (req, res) => {
  try {
    // log.write("ControllerService ::: getResourceBookings :: data ", req.body);
    var data = await bookingsService.getResourceBookings(req.params.id);
    res.json({ data: data });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
};
controller.getBuildingMeetingRoomPaxPrice = async (req, res) => {
  try {
    // log.write("ControllerService ::: getBuildingMeetingRoomPaxPrice :: data ", req.body);
    var data = await bookingsService.getBuildingMeetingRoomPaxPrice(
      req.params.officeId
    );
    res.json({ data: data });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
};
controller.getEmployees = async (req, res) => {
  try {
    // log.write("ControllerService ::: getEmployees :: data ", req.body);
    var data = await bookingsService.getEmployees(req.params.clientId);
    res.json({ data: data });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
};
controller.deleteBooking = async (req, res) => {
  try {
    // log.write("ControllerService ::: deleteBooking :: data ", req.body);
    var user = await bookingsService.deleteBooking(req.params.id);
    res.json({ data: user });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
};
controller.cancelBooking = async (req, res) => {
  try {
    // log.write("ControllerService ::: cancelBooking :: data ", req.body);
    var user = await bookingsService.cancelBooking(req.params.id);
    res.json({ data: user });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
};
controller.generateAgreement = async (req, res) => {
  try {
    // log.write("ControllerService ::: generateAgreement :: data ", req.body);
    var user = await bookingsService.generateAgreementPdf(req.params.id);
    res.json({ data: user });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
};
controller.extendedContract = async (req, res) => {
  try {
    // log.write("ControllerService ::: extendedContract :: data ", req.body);
    var user = await bookingsService.extendedContract(
      req.body,
      utils.getUserName(req)
    );
    res.json({ data: user });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
};
controller.requestExit = async (req, res) => {
  try {
    // log.write("ControllerService ::: requestExit :: data ", req.body);
    var user = await bookingsService.requestExit(
      req.body,
      utils.getUserName(req)
    );
    res.json({ data: user });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
};
controller.updateFreeCredits = async (req, res) => {
  try {
    // log.write("ControllerService ::: updateFreeCredits :: data ", req.body);
    var user = await bookingsService.updateFreeCredits(
      utils.body(req),
      utils.getUserName(req)
    );
    res.json({ data: user });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
};
controller.settleShortTermBookings = async (req, res) => {
  try {
    // log.write("ControllerService ::: settleShortTermBookings :: data ", req.body);
    var user = await bookingsService.settleShortTermBookings(
      utils.body(req),
      utils.getUserName(req)
    );
    res.json({ data: user });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
};
controller.cancelExitRequest = async (req, res) => {
  try {
    // log.write("ControllerService ::: cancelExitRequest :: data ", req.body);
    var user = await bookingsService.cancelExitRequest(
      req.params.id,
      utils.getUserName(req)
    );
    res.json({ data: user });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
};
controller.saveAcr = async (req, res) => {
  try {
    // log.write("ControllerService ::: saveAcr :: data ", req.body);
    var item = await bookingsService.saveAcr(req.body, utils.getUserName(req));
    res.json({ data: item });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
};
controller.saveDeduction = async (req, res) => {
  try {
    // log.write("ControllerService ::: saveDeduction :: data ", req.body);
    var item = await bookingsService.saveDeduction(
      req.body,
      utils.getUserName(req)
    );
    res.json({ data: item });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
};
controller.saveExitComment = async (req, res) => {
  try {
    // log.write("ControllerService ::: saveExitComment :: data ", req.body);
    var item = await bookingsService.saveExitComment(
      req.body,
      utils.getUserName(req)
    );
    res.json({ data: item });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
};
controller.saveExitRequest = async (req, res) => {
  try {
    // log.write("ControllerService ::: saveExitRequest :: data ", req.body);
    var item = await bookingsService.saveExitRequest(
      req.body,
      utils.getUserName(req)
    );
    res.json({ data: item });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
};
controller.approveFinalStatement = async (req, res) => {
  try {
    // log.write("ControllerService ::: approveFinalStatement :: data ", req.body);
    var item = await bookingsService.approveFinalStatement(
      req.body,
      utils.getUserName(req)
    );
    res.json({ data: item });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
};
controller.acceptFinalStatement = async (req, res) => {
  try {
    // log.write("ControllerService ::: acceptFinalStatement :: data ", req.body);
    var item = await bookingsService.acceptFinalStatement(
      req.body,
      utils.getUserName(req)
    );
    res.json({ data: item });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
};
controller.updateBookingsLedger = async (req, res) => {
  try {
    // log.write("ControllerService ::: updateBookingsLedger :: data ", req.body);
    var item = await bookingsService.updateBookingsLedger(
      utils.body(req),
      utils.getUserName(req)
    );
    res.json({ data: item });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
};

controller.searchOffices = async (req, res) => {
  try {
    // log.write("ControllerService ::: searchOffices :: data ", req.body);
    var item = await bookingsService.searchOffices(utils.body(req));
    res.json({ data: item });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
};

controller.searchParking = async (req, res) => {
  try {
    // log.write("ControllerService ::: searchOffices :: data ", req.body);
    var item = await bookingsService.searchParking(utils.body(req));
    res.json({ data: item });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
};

controller.createBooking = async (req, res) => {
  try {
    // log.write("ControllerService ::: createBooking :: data ", req.body);
    var item = await bookingsService.createBooking(utils.body(req));
    res.json({ data: item });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
};
controller.createParkingBooking = async (req, res) => {
  try {
    // log.write("ControllerService ::: createBooking :: data ", req.body);
    var item = await bookingsService.createParkingBooking(utils.body(req));
    res.json({ data: item });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
};


controller.saveContract = async (req, res) => {
  try {
    // log.write("ControllerService ::: saveContract :: data ", req.body);
    var item = await bookingsService.saveContract(utils.body(req));
    res.json({ data: item });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
};
controller.saveContractTerm = async (req, res) => {
  try {
    // log.write("ControllerService ::: saveContractTerm :: data ", req.body);
    var item = await bookingsService.saveContractTerm(utils.body(req));
    res.json({ data: item });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
};
controller.saveAdditionalInvoice = async (req, res) => {
  try {
    // log.write("ControllerService ::: saveAdditionalInvoice :: data ", req.body);
    var item = await bookingsService.saveAdditionalInvoice(utils.body(req));
    res.json({ data: item });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
};
controller.saveClient = async (req, res) => {
  try {
    // log.write("ControllerService ::: saveClient :: data ", req.body);
    var item = await bookingsService.saveClient(utils.body(req));
    res.json({ data: item });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
};
controller.saveBookedDesk = async (req, res) => {
  try {
    // log.write("ControllerService ::: saveBookedDesk :: data ", req.body);
    var item = await bookingsService.saveBookedDesk(utils.body(req));
    res.json({ data: item });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
};
controller.saveEmployee = async (req, res) => {
  try {
    // log.write("ControllerService ::: saveEmployee :: data ", req.body);
    var item = await bookingsService.saveEmployee(utils.body(req));
    res.json({ data: item });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
};
controller.listEmployees = async (req, res) => {
  try {
    // log.write("ControllerService ::: listEmployees :: data ", req.body);
    var item = await bookingsService.listEmployees(utils.body(req));
    res.json({ data: item });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
};
controller.sendEmployeeVerification = async (req, res) => {
  try {
    // log.write("ControllerService ::: sendEmployeeVerification :: data ", req.body);
    var item = await bookingsService.sendEmployeeVerification(utils.body(req));
    res.json({ data: item });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
};
controller.deleteEmployee = async (req, res) => {
  try {
    // log.write("ControllerService ::: deleteEmployee :: data ", req.body);
    var user = await bookingsService.deleteEmployee(req.params.id);
    res.json({ data: user });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
};
controller.saveInvoice = async (req, res) => {
  try {
    // log.write("ControllerService ::: saveInvoice :: data ", req.body);
    var item = await bookingsService.saveInvoice(
      req.body,
      utils.getUserName(req)
    );
    res.json({ data: item });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
};
controller.savePayment = async (req, res) => {
  try {
    // log.write("ControllerService ::: savePayment :: data ", req.body);
    var item = await bookingsService.savePayment(
      req.body,
      utils.getUserName(req)
    );
    res.json({ data: item });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
};
controller.saveUrnPayment = async (req, res) => {
  try {
    // log.write("ControllerService ::: saveUrnPayment :: data ", req.body);
    var item = await bookingsService.saveUrnPayment(
      req.body,
      utils.getUserName(req)
    );
    res.json({ data: item });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
};
controller.sendInvoice = async (req, res) => {
  try {
    // log.write("ControllerService ::: sendInvoice :: data ", req.body);
    var data = await bookingsService.sendInvoice(req.params.id);
    res.json({ data: data });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
};
controller.raiseInvoices = async (req, res) => {
  try {
    // log.write("ControllerService ::: raiseInvoices :: data ", req.body);
    var data = await bookingsService.raiseInvoices(req.body);
    res.json({ data: data });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
};
controller.raiseParkingInvoices = async (req, res) => {
  try {
    // log.write("ControllerService ::: raiseInvoices :: data ", req.body);
    var data = await bookingsService.raiseParkingInvoices(req.body);
    res.json({ data: data });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
};
controller.raiseNextMonthInvoice = async (req, res) => {
  try {
    // log.write("ControllerService ::: raiseInvoices :: data ", req.body);
    var data = await bookingsService.raiseNextMonthInvoice(req.body);
    res.json({ data: data });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
};
controller.cancelInvoice = async (req, res) => {
  try {
    // log.write("ControllerService ::: cancelInvoice :: data ", req.body);
    var user = await bookingsService.cancelInvoice(
      req.body,
      utils.getUserName(req)
    );
    res.json({ data: user });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
};
controller.regenerateInvoices = async (req, res) => {
  try {
    // log.write("ControllerService ::: regenerateInvoices :: data ", req.body);
    var user = await bookingsService.regenerateInvoices(utils.body(req));
    res.json({ data: user });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
};
controller.sendInvoiceNotifications = async (req, res) => {
  try {
    // log.write("ControllerService ::: sendInvoiceNotifications :: data ", req.body);
    var user = await bookingsService.sendInvoiceNotifications(utils.body(req));
    res.json({ data: user });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
};
controller.updateRentFreePeriod = async (req, res) => {
  try {
    // log.write("ControllerService ::: updateRentFreePeriod :: data ", req.body);
    var user = await bookingsService.updateRentFreePeriod(utils.body(req));
    res.json({ data: user });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
};

controller.searchResources = async (req, res) => {
  try {
    // log.write("ControllerService ::: searchResources :: data ", req.body);
    var item = await bookingsService.searchResources(utils.body(req));
    res.json({ data: item });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
};
controller.createResourceBooking = async (req, res) => {
  try {
    // log.write("ControllerService ::: createResourceBooking :: data ", req.body);
    var item = await bookingsService.createResourceBooking(utils.body(req));
    res.json({ data: item });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
};
controller.getBookingCreditHistory = async (req, res) => {
  try {
    // log.write("ControllerService ::: getBookingCreditHistory :: data ", req.body);
    var item = await bookingsService.getBookingCreditHistory(
      req.params.bookingId
    );
    res.json({ data: item });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
};
controller.deleteCreditEntry = async (req, res) => {
  try {
    // log.write("ControllerService ::: deleteCreditEntry :: data ", req.body);
    var item = await bookingsService.deleteCreditEntry(
      req.params.id,
      utils.getUserName(req)
    );
    res.json({ data: item });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
};
controller.saveCreditEntry = async (req, res) => {
  try {
    // log.write("ControllerService ::: saveCreditEntry :: data ", req.body);
    var item = await bookingsService.saveCreditEntry(
      req.body,
      utils.getUserName(req)
    );
    res.json({ data: item });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
};
controller.saveCreditUsed = async (req, res) => {
  try {
    // log.write("ControllerService ::: saveCreditUsed :: data ", req.body);
    var item = await bookingsService.saveCreditUsed(
      req.body,
      utils.getUserName(req)
    );
    res.json({ data: item });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
};

controller.getSchedules = async (req, res) => {
  try {
    // log.write("ControllerService ::: getSchedules :: data ", req.body);
    var item = await bookingsService.getSchedules(
      req.body,
      utils.getUserName(req)
    );
    res.json({ data: item });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
};
controller.getSchedule = async (req, res) => {
  try {
    // log.write("ControllerService ::: getSchedule :: data ", req.body);
    var item = await bookingsService.getSchedule(req.params.id);
    res.json({ data: item });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
};
controller.saveSchedule = async (req, res) => {
  try {
    // log.write("ControllerService ::: saveSchedule :: data ", req.body);
    var item = await bookingsService.saveSchedule(
      req.body,
      utils.getUserName(req)
    );
    res.json({ data: item });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
};

controller.bookingExpansion = async (req, res) => {
  try {
    // log.write("ControllerService ::: bookingExpansion :: data ", req.body);
    var item = await bookingsService.bookingExpansion(
      req.body,
      utils.getUserName(req)
    );
    res.json({ data: item });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
};
controller.bookingContraction = async (req, res) => {
  try {
    // log.write("ControllerService ::: bookingContraction :: data ", req.body);
    var item = await bookingsService.bookingContraction(
      req.body,
      utils.getUserName(req)
    );
    res.json({ data: item });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
};
controller.bookingRelocation = async (req, res) => {
  try {
    // log.write("ControllerService ::: bookingRelocation :: data ", req.body);
    var item = await bookingsService.bookingRelocation(
      req.body,
      utils.getUserName(req)
    );
    res.json({ data: item });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
};
controller.vacateOffice = async (req, res) => {
  try {
    // log.write("ControllerService ::: bookingRelocation :: data ", req.body);
    var item = await bookingsService.vacateOffice(
      req.body,
      utils.getUserName(req)
    );
    res.json({ data: item });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
};
controller.getContractRenewalBookings = async (req, res) => {
  try {
    // log.write("ControllerService ::: getContractRenewalBookings :: data ", req.body);
    var item = await bookingsService.getContractRenewalBookings(
      utils.body(req),
      utils.getUserName(req)
    );
    res.json({ data: item });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
};
controller.renewContract = async (req, res) => {
  try {
    // log.write("ControllerService ::: renewContract :: data ", req.body);
    var item = await bookingsService.renewContract(
      utils.body(req),
      utils.getUserName(req)
    );
    res.json({ data: item });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
};
controller.refundLiability = async (req, res) => {
  try {
    // log.write("ControllerService ::: refundLiability :: data ", req.body);
    var item = await bookingsService.refundLiability(
      utils.body(req),
      utils.getUserName(req)
    );
    res.json({ data: item });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
};

exports.controller = controller;
