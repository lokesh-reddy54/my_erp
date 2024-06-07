'use strict';

var Q = require('q');
var fs = require('fs');
var lodash = require('lodash');
var config = require('../utils/config').config;
var log = require('../utils/log').log;

var Sequelize = require("sequelize");
var db = new Sequelize(config.db, config.dbUserName, config.dbPassword, {
  host: config.dbHost,
  dialect: 'mysql',
  logging: config.dbLogging,
  timezone: config.timezone,
  pool: {
    max: 100,
    min: 0,
    idle: 10000,
    acquire: 200000
  }
});

exports.recreateTables = config.recreateTables; // set to true if you need to drop and create tables again

var session = {}
session.init = function() {
  var deferred = Q.defer();
  log.write("Initialising " + config.db + " database Session ... ! ");

  // require("./utils/system_util");
  db.authenticate()
    .then(() => {
      log.write(config.db + ' database Connection has been established successfully.');
      deferred.resolve();
    })
    .catch(err => {
      log.write('Unable to connect to the ' + config.db + ' database:', err);
    });
  return deferred.promise;
}

session.close = function() {
  db.close();
  log.write(config.db + " database connection has been closed .. ");
}

exports.session = session;
exports.db = db;