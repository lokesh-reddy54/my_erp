'use strict';

var Q = require('q');
var fs = require('fs');
var path = require('path');
var _ = require('lodash');
var Op = require("sequelize").Op;
var Sequelize = require("sequelize");
var request = require('request-promise');
var moment = require("moment");

var config = require('../utils/config').config;
var session = require("./session");
var log = require('../utils/log').log;
var utils = require('../utils/utils').utils;
var systemUtils = require('./utils/system_util').utils;

var Constants = require("./models/constants");
var Booking = require("./models/base").Booking;
var Location = require("./models/base").Location;
var Office = require("./models/base").Office;
var Floor = require("./models/base").Floor;
var Cabin = require("./models/base").Cabin;
var Desk = require("./models/base").Desk;
var Mail = require("./models/base").Mail;
var Sms = require("./models/base").Sms;
var Lead = require("./models/base").Lead;
var BookedDesk = require("./models/base").BookedDesk;
var Client = require("./models/base").Client;
var Contract = require("./models/base").Contract;
var ExitRequest = require("./models/base").ExitRequest;
var OfficePricing = require("./models/base").OfficePricing;
var FacilitySet = require("./models/base").FacilitySet;
var Invoice = require("./models/base").Invoice;
var InvoiceItem = require("./models/base").InvoiceItem;
var Payment = require("./models/base").Payment;
var Resource = require("./models/base").Resource;
var ResourceBooking = require("./models/base").ResourceBooking;
var ClientEmployee = require("./models/base").ClientEmployee;
var CreditEntry = require("./models/base").CreditEntry;
var CreditUsed = require("./models/base").CreditUsed;

var services = require("./services").service;
var bookingsService = require("./bookings").service;

var service = {};



exports.service = service;