"use strict";

let values = require("./values.js");

let config = {
  isDev: values.isDev != null ? values.isDev : false,
  isLocalMachine: values.isLocalMachine != null ? values.isLocalMachine : false,
  timezone: values.timezone != null ? values.timezone : "+05:30",
  apiVersion: "v1",
  hasSSL: values.hasSSL != null ? values.hasSSL : false,
  port: values.port != null ? values.port : 9000,
  domainUrl:
    values.domainUrl != null ? values.domainUrl : "https://nerp.hustlehub.xyz",
  uploadsUrl:
    values.uploadsUrl != null ? values.uploadsUrl : "http://i.coworkops.in/",
  selfcareUrl:
    values.selfcareUrl != null ? values.selfcareUrl : "http://selfcare.coworkops.in/",

  mailParser: values.mailParser != null ? values.mailParser : false,
  dbHost: values.dbHost,
  db: values.db,

  dbUserName: values.dbUserName,
  dbPassword: values.dbPassword,

  dbTableOptions: {
    underscored: false,
    timestamps: false,
    freezeTableName: true,
  },
  dbSync: values.dbSync,
  dbLogging: values.dbLogging,
  alterTables: values.alterTables, // alter table during syncing
  recreateTables: values.recreateTables, // never make it to true
  checkAuth: values.checkAuth, // to enable check of jwttoken for Authorisation

  jwtTokenSecret: "Password1",
  sendEmails: false,
  generateAgreementPdf: false,
};
exports.config = config;
