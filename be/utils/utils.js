'use strict';

var moment = require('moment');
let log = require('./log.js').log;
let config = require('./config.js').config;
let humps = require('./humps.js');
var jwt = require('jsonwebtoken');

let utils = {

  setDefault: function(value, defaultValue) {
    return value && value != null && value != 'NaN' ? value : defaultValue;
  },

  isBefore: function(date1, date2) {
    return moment(date1).isBefore(date2);
  },

  moment: function(date, timezone) {
    var _date;
    if (date) {
      _date = moment(date, "YYYY-MM-DD HH:mm");
    } else {
      _date = moment();
    }
    if (timezone) {
      _date = _date.utcOffset(timezone);
    }
    return _date.clone();
  },

  getCurrentTime: function() {
    return moment().utcOffset(config.timezone);
  },

  getDaysBetween: function(start, end) {
    var a = moment(start);
    var b = moment(end);
    // console.log("utils ::: getDaysBetween :: startDate ", a);
    // console.log("utils ::: getDaysBetween :: endDate ", b);
    var days = a.diff(b, 'days') + 1;
    if (a.isBefore(b)) {
      days = 0;
    }
    return days;
  },

  getHoursBetween: function(start, end) {
    var a = moment(start);
    var b = moment(end);
    // console.log("utils ::: getHoursBetween :: startTime ", a);
    // console.log("utils ::: getHoursBetween :: endTime ", b);
    var hours = a.diff(b, 'hours');
    if (a.isBefore(b)) {
      hours = 0;
    }
    return hours;
  },

  getMinutesBetween: function(start, end) {
    start = moment(start);
    end = moment(end);
    // console.log("utils ::: getHoursBetween :: startTime ", start);
    // console.log("utils ::: getHoursBetween :: endTime ", end);
    var mins = end.diff(start, 'minutes');
    // console.log("utils ::: getMinutesBetween :: minutes ", mins);
    return mins;
  },

  formatCurrency: function(value) {
    //TODO
    return value;
  },

  formatDate: function(date) {
    if (date == "" || date == null) {
      return "";
    }
    var format = "DD-MM-YYYY";
    format = format.toUpperCase();
    // console.log("formatDate :: format : " + format);
    return moment(date).format(format);
  },

  formatTime: function(date) {
    if (date == "" || date == null) {
      return "";
    }
    var format = "HH:mm";
    return moment(date).format(format);
  },

  formatDecimals: function(number) {
    // console.log("formatDecimals :: number : " + number);
    if (number == 0 || !number || number == "") {
      var num = Number((0).toFixed(2));
      // console.log("formatDecimals :: zero : " + (num > 0));
      return num;
    }
    var num = number.toFixed ? Number(number.toFixed(2)) : number;
    return num
  },

  generateUUID: function() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
      s4() + '-' + s4() + s4() + s4();
  },

  authChecker: function(req, res, next) {
    var token = req.body.token || req.headers['x-access-token'] || req.headers.authorizatio;

    if (token) {
      token = token.replace("Bearer ", "");
      jwt.verify(token, config.jwtTokenSecret, function(tokenError) {
        if (tokenError) {
          return res.status(403).json({
            message: "Invalid token, please Log and try"
          });
        }
        next();
      });
    } else {
      return res.status(403).json({
        message: "Token not found, please log in and try"
      });
    }
  },

  getAuthUser: function(req) {
    var token = req.body.token || req.headers['x-access-token'] || req.headers.authorization;

    // console.log("Utils ::: getUserName :: token ", token);
    if (token) {
      token = token.replace("Bearer ", "");
      var decoded = jwt.decode(token, { complete: true });
      // console.log("Utils ::: getUserName :: decoded ", decoded);
      if (decoded && decoded.payload) {
        return decoded.payload;
      } else {
        return { username: "sam", company_id: 1, name: "sampath", email: "sam@hustlehub.xyz" };
      }
    } else {
      return { username: "sam", company_id: 1, name: "sampath", email: "sam@hustlehub.xyz" };
    }
  },

  getUserName: function(req) {
    // console.log("Utils ::: getUserName :: req.headers ", req.headers);
    var token = req.body.token || req.headers['x-access-token'] || req.headers.authorization;

    // console.log("Utils ::: getUserName :: token ", token);
    if (token && token != "" && token.replace) {
      token = token.replace("Bearer ", "");
      var decoded = jwt.decode(token, { complete: true });
      // console.log("Utils ::: getUserName :: decoded " + decoded.payload.username, decoded);
      if (decoded && decoded.payload) {
        return decoded.payload.username;
      } else {
        return "sam";
      }
    } else {
      return "sam";
    }
  },

  body: function(req) {
    // console.log("body :: ", req);
    var body = req.body;
    body.companyId = body.companyId || parseInt(req.headers.companyid) || null;
    body.timezone = parseInt(req.headers.timezone) || null;
    return body;
  },

  decam: function(object) {
    return humps.decamelizeKeys(object);
  },

  cam: function(object) {
    return humps.camelizeKeys(object);
  },

  firstError: function(error) {
    if (error.errors) {
      return error.errors[0].message;
    } else {
      return error.message || error;
    }
  },

  clone: function(obj) {
    return JSON.parse(JSON.stringify(obj));
  },

  getPlain: function(obj) {
    if (obj.get) {
      return obj.get({ plain: true });
    } else {
      return "Not a sequelize model";
    }
  },

  toWords: function(num) {
    var a = ['', 'one ', 'two ', 'three ', 'four ', 'five ', 'six ', 'seven ', 'eight ', 'nine ', 'ten ', 'eleven ', 'twelve ', 'thirteen ', 'fourteen ', 'fifteen ', 'sixteen ', 'seventeen ', 'eighteen ', 'nineteen '];
    var b = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];

    if ((num = num.toString()).length > 9) return '';
    var n = ('000000000' + num).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
    if (!n) return "";
    var str = '';
    str += (n[1] != 0) ? (a[Number(n[1])] || b[n[1][0]] + ' ' + a[n[1][1]]) + 'crore ' : '';
    str += (n[2] != 0) ? (a[Number(n[2])] || b[n[2][0]] + ' ' + a[n[2][1]]) + 'lakh ' : '';
    str += (n[3] != 0) ? (a[Number(n[3])] || b[n[3][0]] + ' ' + a[n[3][1]]) + 'thousand ' : '';
    str += (n[4] != 0) ? (a[Number(n[4])] || b[n[4][0]] + ' ' + a[n[4][1]]) + 'hundred ' : '';
    str += (n[5] != 0) ? ((str != '') ? 'and ' : '') + (a[Number(n[5])] || b[n[5][0]] + ' ' + a[n[5][1]]) + 'only ' : '';
    return utils.capitalizeFirstLetter(str);
  },

  capitalizeFirstLetter: function(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  },

  sleep: async (millis) => {
    return new Promise(resolve => setTimeout(resolve, millis));
  }
}

String.prototype.replaceAll = function(search, replacement) {
  var target = this;
  return target.replace(new RegExp(search, 'g'), replacement);
};

exports.utils = utils;