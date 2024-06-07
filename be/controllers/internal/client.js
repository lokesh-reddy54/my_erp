'use strict';

var Q = require('q');
var util = require('util');
var request = require('request-promise');
var jwt = require('jsonwebtoken');
var atob = require('atob');
var _ = require('lodash');
var requestIp = require('request-ip');

var config = require('../../utils/config').config;
var log = require('../../utils/log').log;
var utils = require('../../utils/utils').utils;
var visitsService = require('../../services/visits').service;
var adminService = require('../../services/admin').service;
var bookingsService = require('../../services/bookings').service;

var controller = {};

controller.listCompanies = async (req, res) => {
  try {
    // log.write("ControllerService ::: listCompanies :: data ", req.body);
    var users = await adminService.listCompanies(req.body);
    res.json({ data: users });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
}
controller.saveCompany = async (req, res) => {
  try {
    // log.write("ControllerService ::: saveCompany :: data ", req.body);
    var user = await adminService.saveCompany(req.body);
    res.json({ data: user })
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
}
controller.authenticate = async (req, res) => {
  try {
    var data = req.body;
    if (!data.otpVerified) {
      var items = await adminService.listUsers(req.body);
      if (items.length) {
        var user = items[0];
        log.write("ClientController ::: authenticate :: user : ", user.toJSON());
        if (user.active) {
          var roles = null;
          var managerRoles = [];
          var geoTags = {};
          _.each(user.userRoles, function(r) {
            // log.write("ClientController ::: authenticate :: user role : ", r.toJSON());
            if (r.enum) {
              if (r.enum.indexOf('_MANAGER')) {
                managerRoles.push(r.enum.replace("_MANAGER", ""));
              }
            }
            if (r.isGeoSpecific) {
              if (r['user_roles'].cityIds) {
                if (!geoTags.cityIds) {
                  geoTags.cityIds = [];
                }
                var cityIds = r['user_roles'].cityIds.split(",");
                // log.write("ClientController ::: authenticate :: added city geotags : ", cityIds);
                geoTags.cityIds = geoTags.cityIds.concat(cityIds);
                // geoTags.cityIds = _.uniq(geoTags.cityIds);
                // log.write("ClientController ::: authenticate :: added city geotags : ", geoTags);
              }
              if (r['user_roles'].locationIds) {
                if (!geoTags.locationIds) {
                  geoTags.locationIds = [];
                }
                var locationIds = r['user_roles'].locationIds.split(",");
                // log.write("ClientController ::: authenticate :: added location geotags : ", locationIds);
                geoTags.locationIds = geoTags.locationIds.concat(locationIds);
                geoTags.locationIds = _.uniq(geoTags.locationIds);
                // log.write("ClientController ::: authenticate :: added location geotags : ", geoTags);
              }
              if (r['user_roles'].buildingIds) {
                if (!geoTags.buildingIds) {
                  geoTags.buildingIds = [];
                }
                var buildingIds = r['user_roles'].buildingIds.split(",");
                // log.write("ClientController ::: authenticate :: added building geotags : ", buildingIds);
                geoTags.buildingIds = geoTags.buildingIds.concat(buildingIds);
                // log.write("ClientController ::: authenticate :: added building geotags : ", geoTags);
                geoTags.buildingIds = _.uniq(geoTags.buildingIds);
              }
            }

            if (r.json) {
              var json = JSON.parse(r.json);
              // log.write("ClientController ::: authenticate :: json : ", json);
              for (var key in json) {
                if (!roles) {
                  roles = {};
                }
                var userKey = roles[key];
                if (!userKey) {
                  userKey = {}
                }
                // log.write("ClientController ::: authenticate :: key : ", key);
                // log.write("ClientController ::: authenticate :: userKey : ", userKey);
                // log.write("ClientController ::: authenticate :: json[key] : ", json[key]);
                for (var feature in json[key]) {
                  // log.write("ClientController ::: authenticate :: userKey[feature] : " + userKey[feature]);
                  // log.write("ClientController ::: authenticate :: key[feature] : " + json[key][feature]);
                  if (!userKey[feature] && json[key][feature]) {
                    userKey[feature] = true;
                  }
                  // log.write("ClientController ::: authenticate :: userKey : ", userKey);
                }
                roles[key] = userKey;
              }
            }
          });

          var tokenData = {
            id: user.id,
            name: user.name,
            username: user.username,
            companyId: user.company.id,
          }
          log.write("ControllerService ::: authenticate :: tokenData ", tokenData);
          var token = jwt.sign(tokenData, config.jwtTokenSecret);

          res.json({
            data: {
              id: user.id,
              name: user.name,
              email: user.email,
              phone: user.phone,
              token: token,
              roles: roles,
              managerRoles: managerRoles,
              geoTags: geoTags,
              companyId: user.company.id,
              companyName: user.company.name,
              logo: user.company.logo,
              primaryColor: user.company.primaryColor,
              accentColor: user.company.accentColor,
              modules: user.company.modules ? JSON.parse(user.company.modules) : {}
            }
          });
        } else {
          res.json({ error: "Your account is Inactive, please contact with Admin" });
        }
      }
    }

    if (data.otpVerified || !items.length) {
      // log.write("ControllerService ::: authenticate :: data ", req.body);
      var user = await bookingsService.findEmployee(data);
      log.write("ControllerService ::: authenticate :: user ", user.toJSON());
      if (user) {
        if (user.hasAccess) {
          if (user.verified) {
            if (data.otpVerified || user.password == atob(data.filters.password)) {
              res.json({
                data: {
                  id: user.id,
                  clientId: user.clientId,
                  name: user.name,
                  email: user.email,
                  phone: user.phone,
                  clientCompany: user.client.company,
                  companyId: user.company.id,
                  companyName: user.company.name,
                  logo: user.company.logo,
                  primaryColor: user.company.primaryColor,
                  accentColor: user.company.accentColor
                }
              });
            } else {
              res.json({ error: { 'message': 'Incorrect password, please try again' } });
            }
          } else {
            res.json({ error: { 'message': 'Employee is not verified yet to access SelfCare Portal' } });
          }
        } else {
          res.json({ error: { 'message': 'Employee is not allowed for SelfCare Portal access' } });
        }
      } else {
        res.json({ error: { 'message': 'No user exists' } });
      }
    }
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
}

controller.listVisits = async (req, res) => {
  try {
    // log.write("ControllerService ::: listVisits :: data ", req.body);
    var items = await visitsService.listVisits(req.body);
    res.json({ data: items });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
}

controller.listVisitors = async (req, res) => {
  try {
    // log.write("ControllerService ::: listVisitors :: data ", req.body);
    var items = await visitsService.listVisitors(req.body);
    res.json({ data: items });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
}
controller.listSubscriptions = async (req, res) => {
  try {
    // log.write("ControllerService ::: listSubscriptions :: data ", req.body);
    var items = await visitsService.listSubscriptions(req.body);
    res.json({ data: items });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
}

controller.getDashboard = async (req, res) => {
  try {
    // log.write("ControllerService ::: getDashboard :: data ", req.body);
    var items = await visitsService.getDashboard(req.param.id);
    res.json({ data: items });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
}

controller.getBookings = async (req, res) => {
  try {
    // log.write("ControllerService ::: getBookings :: data ", req.body);
    var items = await bookingsService.listBookings(req.body);
    res.json({ data: items });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
}

controller.getBooking = async (req, res) => {
  try {
    // log.write("ControllerService ::: getBooking :: data ", req.body);
    var booking = await bookingsService.getBooking(req.param.id);
    res.json({ data: booking });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
}


exports.controller = controller;