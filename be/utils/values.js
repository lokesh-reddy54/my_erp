"use strict";

let values = {
  isDev: true,
  isLocalMachine: false,
  timezone: "+05:30",
  apiVersion: "v1",
  
  port: 9900,
  domainUrl: "hustlehub.xyz",
  uploadsUrl: "https://i.hustlehub.xyz/",
  selfcareUrl: "http://uat.hustlehub.tech/",

  mailParser: false,

  dbHost: `127.0.0.1`,
  db: `erp_prod`,
  dbUserName: `root`,
  dbPassword: `pa88w0rd`,

  // dbHost: `95.217.59.234`,
  // db: `erp_dev2`,
  // dbUserName: `root`,
  // dbPassword: `pa88w0rd`,

  // dbSync: false,
  dbLogging: true,
  alterTables: false, // alter table during syncing
  recreateTables: false, // never make it to true
  checkAuth: false, // to enable check of jwttoken for Authorisation
};


module.exports = values;
