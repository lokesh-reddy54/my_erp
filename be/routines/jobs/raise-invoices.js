'use strict';

var fs = require('fs');
var moment = require('moment');

var db = require('../../services/session').session;
var utils = require('../../utils/utils.js').utils;

module.exports = function(agenda) {
  agenda.define('raise invoices', function(job, done) {

    // console.log("Raise invocies job : ", job);
    console.log("Raise invocies job data : ", job.attrs.data);
    console.log("Raise invocies job time : ", utils.moment());
  });
};