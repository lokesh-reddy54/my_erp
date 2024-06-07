'use strict';

var express = require('express');
var controllers = require('../../controllers/internal').controllers;
var utils = require('../../utils/utils.js').utils;
var config = require('../../utils/config.js').config;
var route = express.Router();

if (config.checkAuth) {
  route.use(utils.authChecker);
}


route.post('/listClients', controllers.bookings.listClients);
route.post('/listResourceBookings', controllers.bookings.listResourceBookings);
route.post('/listBookings', controllers.bookings.listBookings);
route.post('/searchBookings', controllers.bookings.searchBookings);
route.post('/getBookings', controllers.bookings.getBookings);
route.post('/saveBooking', controllers.bookings.saveBooking);
route.post('/saveResourceBooking', controllers.bookings.saveResourceBooking);
route.post('/listBookingMails', controllers.bookings.listBookingMails);
route.get('/getBooking/:id', controllers.bookings.getBooking);
route.get('/getBookingExitRequest/:id', controllers.bookings.getBookingExitRequest);
route.get('/getInvoices/:id', controllers.bookings.getInvoices);
route.post('/getAllInvoices', controllers.bookings.getAllInvoices);
route.post('/updateInvoiceStatus', controllers.bookings.updateInvoiceStatus);
route.get('/getPayments/:id', controllers.bookings.getPayments);
route.get('/getContracts/:id', controllers.bookings.getContracts);
route.get('/getResourceBookings/:id', controllers.bookings.getResourceBookings);
route.get('/getBuildingMeetingRoomPaxPrice/:officeId', controllers.bookings.getBuildingMeetingRoomPaxPrice);
route.get('/getEmployees/:clientId', controllers.bookings.getEmployees);
route.get('/deleteBooking/:id', controllers.bookings.deleteBooking);
route.get('/cancelBooking/:id', controllers.bookings.cancelBooking);
route.get('/generateAgreement/:id', controllers.bookings.generateAgreement);
route.post('/updateFreeCredits', controllers.bookings.updateFreeCredits);
route.post('/settleShortTermBookings', controllers.bookings.settleShortTermBookings);
route.post('/extendedContract', controllers.bookings.extendedContract);
route.post('/requestExit', controllers.bookings.requestExit);
route.post('/saveAcr', controllers.bookings.saveAcr);
route.post('/saveDeduction', controllers.bookings.saveDeduction);
route.post('/saveExitComment', controllers.bookings.saveExitComment);
route.post('/saveExitRequest', controllers.bookings.saveExitRequest);
route.post('/acceptFinalStatement', controllers.bookings.acceptFinalStatement);
route.post('/approveFinalStatement', controllers.bookings.approveFinalStatement);
route.get('/cancelExitRequest/:id', controllers.bookings.cancelExitRequest);
route.post('/listEmployees', controllers.bookings.listEmployees);
route.post('/saveEmployee', controllers.bookings.saveEmployee);
route.post('/sendEmployeeVerification', controllers.bookings.sendEmployeeVerification);
route.get('/deleteEmployee/:id', controllers.bookings.deleteEmployee);
route.post('/searchOffices', controllers.bookings.searchOffices);
route.post('/searchParking', controllers.bookings.searchParking);
route.post('/listParkingBookings', controllers.bookings.listParkingBookings);
route.post('/createParkingBooking', controllers.bookings.createParkingBooking);
route.post('/createBooking', controllers.bookings.createBooking);
route.post('/saveContract', controllers.bookings.saveContract);
route.post('/saveContractTerm', controllers.bookings.saveContractTerm);
route.post('/saveAdditionalInvoice', controllers.bookings.saveAdditionalInvoice);
route.post('/saveClient', controllers.bookings.saveClient);
route.post('/saveBookedDesk', controllers.bookings.saveBookedDesk);
route.post('/saveInvoice', controllers.bookings.saveInvoice);
route.post('/savePayment', controllers.bookings.savePayment);
route.post('/saveUrnPayment', controllers.bookings.saveUrnPayment);
route.get('/sendInvoice/:id', controllers.bookings.sendInvoice);
route.post('/raiseInvoices', controllers.bookings.raiseInvoices);
route.post('/raiseParkingInvoices', controllers.bookings.raiseParkingInvoices);
route.post('/raiseNextMonthInvoice', controllers.bookings.raiseNextMonthInvoice);
route.post('/cancelInvoice', controllers.bookings.cancelInvoice);
route.post('/updateBookingsLedger', controllers.bookings.updateBookingsLedger);
route.post('/regenerateInvoices', controllers.bookings.regenerateInvoices);
route.post('/sendInvoiceNotifications', controllers.bookings.sendInvoiceNotifications);
route.post('/updateRentFreePeriod', controllers.bookings.updateRentFreePeriod);

route.post('/searchResources', controllers.bookings.searchResources);
route.post('/createResourceBooking', controllers.bookings.createResourceBooking);
route.get('/getBookingCreditHistory/:bookingId', controllers.bookings.getBookingCreditHistory);
route.get('/deleteCreditEntry/:id', controllers.bookings.deleteCreditEntry);
route.post('/saveCreditEntry', controllers.bookings.saveCreditEntry);
route.post('/saveCreditUsed', controllers.bookings.saveCreditUsed);

route.post('/getSchedules', controllers.bookings.getSchedules);
route.get('/getSchedule/:id', controllers.bookings.getSchedule);
route.post('/saveSchedule', controllers.bookings.saveSchedule);

route.post('/bookingExpansion', controllers.bookings.bookingExpansion);
route.post('/bookingContraction', controllers.bookings.bookingContraction);
route.post('/bookingRelocation', controllers.bookings.bookingRelocation);
route.post('/vacateOffice', controllers.bookings.vacateOffice);
route.post('/getContractRenewalBookings', controllers.bookings.getContractRenewalBookings);
route.post('/renewContract', controllers.bookings.renewContract);
route.post('/refundLiability', controllers.bookings.refundLiability);

exports.route = route;