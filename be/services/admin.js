"use strict";

var Q = require("q");
var moment = require("moment");
var _ = require("lodash");
var Op = require("sequelize").Op;
var Sequelize = require("sequelize");
var nodemailer = require("nodemailer");
var request = require("request-promise");
var atob = require("atob");
// var request = require("request");

var config = require("../utils/config").config;
var session = require("./session");
var log = require("../utils/log").log;
var utils = require("../utils/utils").utils;
var systemUtils = require("./utils/system_util").utils;

var Constants = require("./models/constants");
var Company = require("./models/base").Company;
var CompanyContact = require("./models/base").CompanyContact;
var Client = require("./models/base").Client;
var ClientEmployee = require("./models/base").ClientEmployee;
var Role = require("./models/base").Role;
var Notification = require("./models/base").Notification;
var NotificationReceiver = require("./models/base").NotificationReceiver;
var User = require("./models/base").User;
var UserMessage = require("./models/base").UserMessage;
var UserRole = require("./models/base").UserRole;
var Country = require("./models/base").Country;
var City = require("./models/base").City;
var Location = require("./models/base").Location;
var Building = require("./models/base").Building;
var BuildingContractTerm = require("./models/base").BuildingContractTerm;
var BuildingContact = require("./models/base").BuildingContact;
var BuildingImage = require("./models/base").BuildingImage;
var BuildingProperty = require("./models/base").BuildingProperty;
var PropertyContact = require("./models/base").PropertyContact;
var PropertyImage = require("./models/base").PropertyImage;
var PropertyContract = require("./models/base").PropertyContract;
var PropertyContractNegotiation =
  require("./models/base").PropertyContractNegotiation;
var BuildingService = require("./models/base").BuildingService;
var BuildingServiceAssignee = require("./models/base").BuildingServiceAssignee;
var Office = require("./models/base").Office;
var OfficePricing = require("./models/base").OfficePricing;
var Floor = require("./models/base").Floor;
var Resource = require("./models/base").Resource;
var ResourceImage = require("./models/base").ResourceImage;
var HelpNote = require("./models/base").HelpNote;
var BusinessTerm = require("./models/base").BusinessTerm;
var Cabin = require("./models/base").Cabin;
var Desk = require("./models/base").Desk;
var Mail = require("./models/base").Mail;
var Sms = require("./models/base").Sms;
var SkuCategory = require("./models/base").SkuCategory;
var Sku = require("./models/base").Sku;
var Asset = require("./models/base").Asset;
var BuildingAmc = require("./models/base").BuildingAmc;
var BuildingAmcItem = require("./models/base").BuildingAmcItem;
var Facility = require("./models/base").Facility;
var FacilitySet = require("./models/base").FacilitySet;
var SetFacility = require("./models/base").SetFacility;
var ExternalSystem = require("./models/base").ExternalSystem;
var Provider = require("./models/base").Provider;
var ProviderBankAccount = require("./models/base").ProviderBankAccount;
var ProviderPortal = require("./models/base").ProviderPortal;
var ProviderContact = require("./models/base").ProviderContact;
var ProviderService = require("./models/base").ProviderService;
var ProviderPayment = require("./models/base").ProviderPayment;
var ProviderBill = require("./models/base").ProviderBill;
var OpexCategory = require("./models/base").OpexCategory;
var OpexType = require("./models/base").OpexType;
var OpexItem = require("./models/base").OpexItem;
var PettyCashAccount = require("./models/base").PettyCashAccount;
var PettyCashAccountUser = require("./models/base").PettyCashAccountUser;
var DebitCardAccount = require("./models/base").DebitCardAccount;
var DebitCardAccountUser = require("./models/base").DebitCardAccountUser;
var ParkingLot = require("./models/base").ParkingLots;
var ParkingSpot =require("./models/base").ParkingSpots;

var services = require("./services").service;

var service = {};

service.listCompanies = async (data) => {
  try {
    log.write("APIService ::: listCompanies :: data : ", data);
    var where = {};
    var attributes;
    var include = [
      "contacts",
      {
        as: "users",
        model: User,
        where: { roles: { $eq: null } },
        required: false,
      },
    ];
    if (data.filters.getCompany) {
      attributes = [
        "logo",
        "squareLogo",
        "primaryColor",
        "accentColor",
        "name",
        "shortName",
      ];
    }
    if (data.filters.domain && data.filters.domain != "") {
      where.erpDomain = { $like: "%" + data.filters.domain + "%" };
    }
    if (data.filters.id && data.filters.id != "") {
      where.id = data.filters.id;
    }
    if (data.filters.search) {
      var query = data.filters;
      var $or = [];
      $or.push(
        Sequelize.where(Sequelize.fn("lower", Sequelize.literal("name")), {
          $like: "%" + query.search.toLowerCase() + "%",
        })
      );
      $or.push(
        Sequelize.where(Sequelize.fn("lower", Sequelize.literal("erpDomain")), {
          $like: "%" + query.search.toLowerCase() + "%",
        })
      );
      $or.push(
        Sequelize.where(Sequelize.fn("lower", Sequelize.literal("website")), {
          $like: "%" + query.search.toLowerCase() + "%",
        })
      );
      where["$and"] = { $or: $or };
    }
    log.write("APIService ::: listCompanies :: where : ", where);
    var companies = await Company.findAll({
      where: where,
      attributes: attributes,
      include: include,
      offset: data.offset,
      limit: data.limit,
      orderBy: [["id", "asc"]],
    });
    log.write(
      "APIService ::: listCompanies :: companies count : " + companies.length
    );

    return companies;
  } catch (e) {
    log.write("APIService ::: listCompanies :: exception : ", e);
    throw e;
  }
};
service.saveCompany = async (data, username) => {
  try {
    log.write("APIService ::: saveCompany :: data : ", data);
    var company = {};
    data.updated = new Date();
    data.updatedBy = username;
    if (data.id) {
      await Company.update(data, { where: { id: data.id } });
      company = data;
    } else {
      data.added = new Date();
      company = await Company.create(data);
    }
    return company;
  } catch (e) {
    log.write("APIService ::: saveCompany :: exception : ", e);
    throw e;
  }
};
service.saveCompanyContact = async (data, username) => {
  try {
    log.write("APIService ::: saveCompanyContact :: data : ", data);
    var company = {};
    data.updated = new Date();
    data.updatedBy = username;
    if (data.id) {
      await CompanyContact.update(data, { where: { id: data.id } });
      company = data;
    } else {
      data.added = new Date();
      company = await CompanyContact.create(data);
    }
    return company;
  } catch (e) {
    log.write("APIService ::: saveCompanyContact :: exception : ", e);
    throw e;
  }
};

service.listPettyCashAccounts = async (data) => {
  try {
    log.write("APIService ::: listPettyCashAccounts :: data : ", data);
    var where = { companyId: data.companyId };
    if (data.filters && data.filters.active) {
      where.active = 1;
    }
    log.write("APIService ::: listPettyCashAccounts :: where : ", where);
    var results = await PettyCashAccount.findAll({
      where: where,
      include: [
        {
          as: "accountUsers",
          model: PettyCashAccountUser,
          where: { active: 1 },
          include: [
            {
              as: "user",
              model: User,
              attributes: ["id", "name", "email", "phone"],
            },
          ],
        },
      ],
    });
    log.write(
      "APIService ::: listPettyCashAccounts :: results count : " +
        results.length
    );
    var accounts = [];
    _.each(results, function (r) {
      r = r.toJSON();
      r.users = [];
      _.each(r.accountUsers, function (u) {
        r.users.push(u.user.name);
      });
      r.users = r.users.join(", ");
      accounts.push(r);
    });
    return accounts;
  } catch (e) {
    log.write("APIService ::: listPettyCashAccounts :: exception : ", e);
    throw e;
  }
};
service.savePettyCashAccount = async (data, username) => {
  try {
    log.write("APIService ::: savePettyCashAccount :: data : ", data);
    var account = {};
    data.updatedBy = username;
    data.updated = new Date();
    if (data.id) {
      await PettyCashAccount.update(data, { where: { id: data.id } });
      account = data;
    } else {
      data.addedOn = new Date();
      data.addedBy = username;
      data.active = 1;
      account = await PettyCashAccount.create(data);
    }
    return account;
  } catch (e) {
    log.write("APIService ::: savePettyCashAccount :: exception : ", e);
    throw e;
  }
};
service.savePettyCashAccountUser = async (data, username) => {
  try {
    log.write("APIService ::: savePettyCashAccountUser :: data : ", data);
    var account = {};
    if (data.id) {
      data.updatedBy = username;
      data.updated = new Date();
      await PettyCashAccountUser.update(data, { where: { id: data.id } });
      account = data;
    } else {
      data.addedOn = new Date();
      data.addedBy = username;
      data.active = 1;
      account = await PettyCashAccountUser.create(data);
    }
    return account;
  } catch (e) {
    log.write("APIService ::: savePettyCashAccountUser :: exception : ", e);
    throw e;
  }
};

service.listDebitCardAccounts = async (data) => {
  try {
    log.write("APIService ::: listDebitCardAccounts :: data : ", data);
    var where = { companyId: data.companyId };
    if (data.filters && data.filters.active) {
      where.active = 1;
    }
    log.write("APIService ::: listDebitCardAccounts :: where : ", where);
    var results = await DebitCardAccount.findAll({
      where: where,
      include: [
        "serviceProvider",
        {
          as: "accountUsers",
          model: DebitCardAccountUser,
          required: false,
          where: { active: 1 },
          include: [
            {
              as: "user",
              model: User,
              attributes: ["id", "name", "email", "phone"],
            },
          ],
        },
      ],
    });
    log.write(
      "APIService ::: listDebitCardAccounts :: results count : " +
        results.length
    );
    var accounts = [];
    _.each(results, function (r) {
      r = r.toJSON();
      r.provider = r.serviceProvider.name;
      r.users = [];
      _.each(r.accountUsers, function (u) {
        r.users.push(u.user.name);
      });
      r.users = r.users.join(", ");
      accounts.push(r);
    });
    return accounts;
  } catch (e) {
    log.write("APIService ::: listDebitCardAccounts :: exception : ", e);
    throw e;
  }
};
service.saveDebitCardAccount = async (data, username) => {
  try {
    log.write("APIService ::: saveDebitCardAccount :: data : ", data);
    var account = {};
    data.updatedBy = username;
    data.updated = new Date();
    if (data.id) {
      await DebitCardAccount.update(data, { where: { id: data.id } });
      account = data;
    } else {
      data.addedOn = new Date();
      data.addedBy = username;
      data.active = 1;
      account = await DebitCardAccount.create(data);
    }
    return account;
  } catch (e) {
    log.write("APIService ::: saveDebitCardAccount :: exception : ", e);
    throw e;
  }
};
service.saveDebitCardAccountUser = async (data, username) => {
  try {
    log.write("APIService ::: saveDebitCardAccountUser :: data : ", data);
    var account = {};
    if (data.id) {
      data.updatedBy = username;
      data.updated = new Date();
      await DebitCardAccountUser.update(data, { where: { id: data.id } });
      account = data;
    } else {
      data.addedOn = new Date();
      data.addedBy = username;
      data.active = 1;
      account = await DebitCardAccountUser.create(data);
    }
    return account;
  } catch (e) {
    log.write("APIService ::: saveDebitCardAccountUser :: exception : ", e);
    throw e;
  }
};

service.listRoles = async (data) => {
  try {
    log.write("APIService ::: listRoles :: data : ", data);
    var where = { companyId: data.companyId, active: 1 };
    log.write("APIService ::: listRoles :: where : ", where);
    var roles = await Role.findAll({ where: where });
    log.write("APIService ::: listRoles :: roles count : " + roles.length);
    return roles;
  } catch (e) {
    log.write("APIService ::: listRoles :: exception : ", e);
    throw e;
  }
};
service.saveRole = async (data, username) => {
  try {
    log.write("APIService ::: saveRole :: data : ", data);
    var role = {};
    data.updatedBy = username;
    data.updated = new Date();
    if (data.id) {
      await Role.update(data, { where: { id: data.id } });
      role = data;
    } else {
      role = await Role.create(data);
    }
    return role;
  } catch (e) {
    log.write("APIService ::: saveRole :: exception : ", e);
    throw e;
  }
};

service.listBusinessTerms = async (data) => {
  try {
    log.write("APIService ::: listBusinessTerms :: data : ", data);
    var where = { companyId: data.companyId };
    log.write("APIService ::: listBusinessTerms :: where : ", where);
    var roles = await BusinessTerm.findAll({ where: where });
    log.write(
      "APIService ::: listBusinessTerms :: roles count : " + roles.length
    );
    return roles;
  } catch (e) {
    log.write("APIService ::: listBusinessTerms :: exception : ", e);
    throw e;
  }
};
service.saveBusinessTerm = async (data, username) => {
  try {
    log.write("APIService ::: saveBusinessTerm :: data : ", data);
    var role = {};
    data.updatedBy = username;
    data.updated = new Date();
    if (data.id) {
      await BusinessTerm.update(data, { where: { id: data.id } });
      role = data;
    } else {
      role = await BusinessTerm.create(data);
    }
    return role;
  } catch (e) {
    log.write("APIService ::: saveBusinessTerm :: exception : ", e);
    throw e;
  }
};
service.deleteBusinessTerm = async (id) => {
  try {
    log.write("APIService ::: deleteBusinessTerm :: id : ", id);
    var result = await BusinessTerm.destroy({ where: { id: id } });
    return result;
  } catch (e) {
    log.write("APIService ::: deleteBusinessTerm :: exception : ", e);
    throw e;
  }
};

service.listHelpNotes = async (data) => {
  try {
    log.write("APIService ::: listHelpNotes :: data : ", data);
    var where = { companyId: data.companyId };
    log.write("APIService ::: listHelpNotes :: where : ", where);
    var roles = await HelpNote.findAll({ where: where });
    log.write("APIService ::: listHelpNotes :: roles count : " + roles.length);
    return roles;
  } catch (e) {
    log.write("APIService ::: listHelpNotes :: exception : ", e);
    throw e;
  }
};
service.saveHelpNote = async (data, username) => {
  try {
    log.write("APIService ::: saveHelpNote :: data : ", data);
    var role = {};
    data.updatedBy = username;
    data.updated = new Date();
    if (data.id) {
      await HelpNote.update(data, { where: { id: data.id } });
      role = data;
    } else {
      role = await HelpNote.create(data);
    }
    return role;
  } catch (e) {
    log.write("APIService ::: saveBusinessTerm :: exception : ", e);
    throw e;
  }
};
service.deleteHelpNote = async (id) => {
  try {
    log.write("APIService ::: deleteHelpNote :: id : ", id);
    var result = await HelpNote.destroy({ where: { id: id } });
    return result;
  } catch (e) {
    log.write("APIService ::: deleteHelpNote :: exception : ", e);
    throw e;
  }
};
// ####################### Start of Users ################################
service.listUsers = async (data) => {
  try {
    log.write("APIService ::: listUsers :: data : ", data);
    var where = {};
    if (data.companyId) {
      where.companyId = data.companyId;
    }
    var attributes;
    var include = [
      "company",
      {
        as: "userRoles",
        model: Role,
        required: false,
        attributes: ["id", "name", "json", "isGeoSpecific", "isSupport"],
      },
    ];
    if (data.filters.email) {
      where["email"] = data.filters.email;
    }
    if (data.filters.active) {
      where["active"] = data.filters.active;
    }
    if (data.filters.isSupport) {
      where["$userRoles.isSupport$"] = 1;
    }
    if (data.filters.password) {
      where["password"] = atob(data.filters.password);
      where["active"] = 1;
      attributes = ["id", "username", "name", "email", "phone", "active"];
      include = ["company", "userRoles"];
    }
    if (data.filters.search) {
      var query = data.filters;
      var $or = [];
      $or.push(
        Sequelize.where(
          Sequelize.fn("lower", Sequelize.literal("`users`.`name`")),
          {
            $like: "%" + query.search.toLowerCase() + "%",
          }
        )
      );
      $or.push(
        Sequelize.where(Sequelize.fn("lower", Sequelize.literal("email")), {
          $like: "%" + query.search.toLowerCase() + "%",
        })
      );
      $or.push(
        Sequelize.where(Sequelize.fn("lower", Sequelize.literal("phone")), {
          $like: "%" + query.search.toLowerCase() + "%",
        })
      );
      where["$and"] = { $or: $or };
      include = null;
    }
    log.write("APIService ::: listUsers :: where : ", where);
    var users = await User.findAll({
      where: where,
      subQuery: false,
      attributes: attributes,
      include: include,
      offset: data.offset,
      limit: data.limit,
    });
    log.write("APIService ::: listUsers :: users count : " + users.length);

    return users;
  } catch (e) {
    log.write("APIService ::: listUsers :: exception : ", e);
    throw e;
  }
};
service.saveUser = async (data, username) => {
  try {
    log.write("APIService ::: saveUser :: data : ", data);
    var user = {};
    data.updated = new Date();
    data.updatedBy = username;
    if (data.id) {
      await User.update(data, { where: { id: data.id } });
      if (data.userRoles) {
        await UserRole.destroy({ where: { userId: data.id } });
        for (var j = 0; j < data.userRoles.length; j++) {
          var role = data.userRoles[j];
          var _role = {
            userId: data.id,
            roleId: role.id,
            cityIds: role.cityIds,
            locationIds: role.locationIds,
            buildingIds: role.buildingIds,
            supportLevel: role.supportLevel,
            assigneeTypes: role.assigneeTypes,
          };
          log.write("APIService ::: saveUser :: userRole : ", _role);
          UserRole.create(_role);

          await BuildingServiceAssignee.update(
            { active: 0 },
            { where: { userId: data.id } }
          );
          if (role.buildingIds && role.buildingIds != "") {
            var buildingIds = role.buildingIds.split(",");
            for (var i = 0; i < buildingIds.length; i++) {
              var buildingService = await BuildingService.findOne({
                where: {
                  buildingId: buildingIds[i],
                  serviceCode: role.assigneeType,
                },
              });
              if (buildingService) {
                service.saveBuildingServiceAssignee(
                  {
                    buildingServiceId: buildingService.id,
                    userId: data.id,
                    active: 1,
                  },
                  username,
                  true
                );
              }
            }
          }
        }
      }
      user = data;
    } else {
      data.added = new Date();
      var names = data.name.trim().split(" ");
      if (names.length > 1) {
        data.username =
          names[0].toLowerCase() + "." + names[1].toLowerCase()[0];
      } else {
        data.username = names[0].toLowerCase();
      }
      user = await User.create(data);
    }
    return user;
  } catch (e) {
    log.write("APIService ::: saveUser :: exception : ", e);
    throw e;
  }
};
service.deleteUser = async (id) => {
  try {
    log.write("APIService ::: deleteUser :: id : ", id);
    var result = await User.destroy({ where: { id: id } });
    return result;
  } catch (e) {
    log.write("APIService ::: deleteUser :: exception : ", e);
    throw e;
  }
};

// ####################### Start of Locations ################################

service.listCountries = async (data) => {
  try {
    log.write("APIService ::: listCountries :: data : ", data);
    var where = {};
    if (data.filters.search && data.filters.search != "") {
      where["name"] = { $like: "%" + data.filters.search + "%" };
    }
    if (data.filters.status && data.filters.status != "") {
      where["status"] = data.filters.status;
    }
    var results = await Country.findAll({
      where: where,
      offset: data.offset,
      limit: data.limit,
    });
    log.write(
      "APIService ::: listCountries :: Countries count : " + results.length
    );
    return results;
  } catch (e) {
    log.write("APIService ::: listCountries :: exception : ", e);
    throw e;
  }
};
service.saveCountry = async (data) => {
  try {
    log.write("APIService ::: saveCountry :: data : ", data);
    var location = {};
    if (data.id) {
      await Country.update(data, { where: { id: data.id } });
      location = data;
    } else {
      location = await Country.create(data);
    }
    return location;
  } catch (e) {
    log.write("APIService ::: saveCountry :: exception : ", e);
    throw e;
  }
};
service.deleteCountry = async (id) => {
  try {
    log.write("APIService ::: deleteCountry :: id : ", id);
    var result = await Country.destroy({ where: { id: id } });
    return result;
  } catch (e) {
    log.write("APIService ::: deleteCountry :: exception : ", e);
    throw e;
  }
};

service.getCitiesWithBuildings = async (data) => {
  try {
    log.write("APIService ::: getCitiesWithBuildings :: data : ", data);
    var where = { active: 1 };
    var results = await City.findAll({
      where: where,
      attributes: ["id", "name"],
      include: [
        {
          as: "locations",
          model: Location,
          attributes: ["id", "name"],
          include: [
            {
              as: "buildings",
              model: Building,
              attributes: ["id", "name"],
              where: { companyId: data.companyId },
            },
          ],
        },
      ],
    });
    log.write(
      "APIService ::: getCitiesWithBuildings :: cities count : " +
        results.length
    );
    return results;
  } catch (e) {
    log.write("APIService ::: getCitiesWithBuildings :: exception : ", e);
    throw e;
  }
};
service.listCities = async (data) => {
  try {
    log.write("APIService ::: listCities :: data : ", data);
    var where = {};
    if (data.filters.search && data.filters.search != "") {
      where["name"] = { $like: "%" + data.filters.search + "%" };
    }
    if (data.filters.countryId && data.filters.countryId != "") {
      where["countryId"] = data.filters.countryId;
    }
    if (data.filters.active && data.filters.active != "") {
      where["active"] = data.filters.active;
    }
    var results = await City.findAll({
      where: where,
      offset: data.offset,
      limit: data.limit,
    });
    log.write("APIService ::: listCities :: cities count : " + results.length);
    return results;
  } catch (e) {
    log.write("APIService ::: listCities :: exception : ", e);
    throw e;
  }
};
service.saveCity = async (data) => {
  try {
    log.write("APIService ::: saveCity :: data : ", data);
    var location = {};
    if (data.id) {
      await City.update(data, { where: { id: data.id } });
      location = data;
    } else {
      location = await City.create(data);
    }
    return location;
  } catch (e) {
    log.write("APIService ::: saveCity :: exception : ", e);
    throw e;
  }
};
service.deleteCity = async (id) => {
  try {
    log.write("APIService ::: deleteCity :: id : ", id);
    var result = await City.destroy({ where: { id: id } });
    return result;
  } catch (e) {
    log.write("APIService ::: deleteCity :: exception : ", e);
    throw e;
  }
};

service.listLocations = async (data) => {
  try {
    log.write("APIService ::: listLocations :: data : ", data);
    var where = {};
    if (data.filters.search && data.filters.search != "") {
      where["name"] = { $like: "%" + data.filters.search + "%" };
    }
    if (data.filters.active && data.filters.active != "") {
      where["active"] = data.filters.active;
    }
    if (data.filters.cityId && data.filters.cityId != "") {
      where["cityId"] = data.filters.cityId;
    }
    var results = await Location.findAll({
      where: where,
      offset: data.offset,
      limit: data.limit,
    });
    log.write(
      "APIService ::: listLocations :: Locations count : " + results.length
    );
    return results;
  } catch (e) {
    log.write("APIService ::: listLocations :: exception : ", e);
    throw e;
  }
};
service.saveLocation = async (data) => {
  try {
    log.write("APIService ::: saveLocation :: data : ", data);
    var location = {};
    if (data.id) {
      await Location.update(data, { where: { id: data.id } });
      location = data;
    } else {
      location = await Location.create(data);
    }
    return location;
  } catch (e) {
    log.write("APIService ::: saveLocation :: exception : ", e);
    throw e;
  }
};
service.deleteLocation = async (id) => {
  try {
    log.write("APIService ::: deleteLocation :: id : ", id);
    var result = await Location.destroy({ where: { id: id } });
    return result;
  } catch (e) {
    log.write("APIService ::: deleteLocation :: exception : ", e);
    throw e;
  }
};

// ####################### Start of Offices ################################
service.listBuildings = async (data) => {
  try {
    log.write("APIService ::: listBuildings :: data : ", data);
    var where = { companyId: data.companyId || 1 };
    if (data.filters) {
      if (data.filters.search && data.filters.search != "") {
        // where['name'] = { $like: '%' + data.filters.search + '%' }
        var query = data.filters;
        var $or = [];
        $or.push(
          Sequelize.where(
            Sequelize.fn("lower", Sequelize.literal("buildings.name")),
            {
              $like: "%" + query.search.toLowerCase() + "%",
            }
          )
        );
        $or.push(
          Sequelize.where(
            Sequelize.fn("lower", Sequelize.literal("location.name")),
            {
              $like: "%" + query.search.toLowerCase() + "%",
            }
          )
        );
        where["$and"] = { $or: $or };
      }
      if (data.filters.locationId && data.filters.locationId != "") {
        where["locationId"] = data.filters.locationId;
      }
      if (data.filters.locationIds && data.filters.locationIds.length) {
        where["locationId"] = { $in: data.filters.locationIds };
      }
      if (data.filters.cityId && data.filters.cityId != "") {
        where["$location.cityId$"] = data.filters.cityId;
      }
      if (data.filters.status && data.filters.status != "") {
        where["status"] = data.filters.status;
      }
      if (data.filters.statuses && data.filters.statuses.length) {
        where["status"] = { $in: data.filters.statuses };
      }
      if (data.filters.buildingIds && data.filters.buildingIds.length) {
        where["id"] = { $in: data.filters.buildingIds };
      }
    }
    var buildings = await Building.findAll({
      where: where,
      include: [
        {
          as: "location",
          model: Location,
          attributes: ["name", "cityId"],
          include: [{ as: "city", model: City, attributes: ["name"] }],
        },
      ],
      offset: data.offset,
      limit: data.limit,
    });
    log.write(
      "APIService ::: listBuildings :: buildings count : " + buildings.length
    );

    return buildings;
  } catch (e) {
    log.write("APIService ::: listBuildings :: exception : ", e);
    throw e;
  }
};
service.saveBuilding = async (data) => {
  try {
    log.write("APIService ::: saveBuilding :: data : ", data);
    var result = {};
    if (data.id) {
      await Building.update(data, { where: { id: data.id } });
      result = data;
    } else {
      result = await Building.create(data);
    }
    return result;
  } catch (e) {
    log.write("APIService ::: saveBuilding :: exception : ", e);
    throw e;
  }
};
service.saveBuildingContractTerm = async (data) => {
  try {
    log.write("APIService ::: saveBuildingContractTerm :: data : ", data);
    var result = {};
    if (data.id) {
      await BuildingContractTerm.update(data, { where: { id: data.id } });
      result = data;
    } else {
      result = await BuildingContractTerm.create(data);
    }
    return result;
  } catch (e) {
    log.write("APIService ::: saveBuildingContractTerm :: exception : ", e);
    throw e;
  }
};
service.getBuildingContractTerms = async (id) => {
  try {
    log.write("APIService ::: getBuildingContractTerms :: id : ", id);
    // var result = await BuildingContractTerm.findAll({ where: { buildingId: id, status: 'Published' } })
    var result = await Building.findOne({
      where: { id: id },
      include: [
        "agreement",
        {
          as: "terms",
          model: BuildingContractTerm,
          required: false,
          where: { status: "Published" },
        },
      ],
    });
    return result;
  } catch (e) {
    log.write("APIService ::: getBuildingContractTerms :: exception : ", e);
    throw e;
  }
};
service.deleteBuilding = async (id) => {
  try {
    log.write("APIService ::: deleteBuilding :: id : ", id);
    var result = await Building.destroy({ where: { id: id } });
    return result;
  } catch (e) {
    log.write("APIService ::: deleteFloor :: exception : ", e);
    throw e;
  }
};
service.listBuildingContacts = async (data) => {
  try {
    log.write("APIService ::: listBuildingContacts :: data : ", data);
    var where = {};
    if (data.filters) {
      where.buildingId = data.filters.buildingId;
    }
    var buildingContacts = await BuildingContact.findAll({
      where: where,
      offset: data.offset,
      limit: data.limit,
    });
    log.write(
      "APIService ::: listBuildingContacts :: building contacts count : " +
        buildingContacts.length
    );

    return buildingContacts;
  } catch (e) {
    log.write("APIService ::: listBuildingContacts :: exception : ", e);
    throw e;
  }
};
service.saveBuildingContact = async (data, username) => {
  try {
    log.write("APIService ::: saveBuildingContact :: data : ", data);
    var result = {};
    if (data.id) {
      data.updated = new Date();
      data.updatedBy = username;
      await BuildingContact.update(data, { where: { id: data.id } });
      result = data;
    } else {
      data.added = new Date();
      data.addedBy = username;
      result = await BuildingContact.create(data);
    }
    return result;
  } catch (e) {
    log.write("APIService ::: saveBuildingContact :: exception : ", e);
    throw e;
  }
};
service.listBuildingAmcs = async (data) => {
  try {
    log.write("APIService ::: listBuildingAmcs :: data : ", data);
    var where = { active: 1 };
    if (data.filters) {
      where.buildingId = data.filters.buildingId;
    }
    var buildingAmcs = await BuildingAmc.findAll({
      where: where,
      include: ["amcItem"],
      offset: data.offset,
      limit: data.limit,
    });
    log.write(
      "APIService ::: listBuildingAmcs :: building amcs count : " +
        buildingAmcs.length
    );

    return buildingAmcs;
  } catch (e) {
    log.write("APIService ::: listBuildingAmcs :: exception : ", e);
    throw e;
  }
};
service.saveBuildingAmc = async (data, username) => {
  try {
    log.write("APIService ::: saveBuildingAmc :: data : ", data);
    var result = {};
    data.updated = new Date();
    data.updatedBy = username;
    if (data.id) {
      await BuildingAmc.update(data, { where: { id: data.id } });
      result = data;
    } else {
      result = await BuildingAmc.create(data);
    }
    return result;
  } catch (e) {
    log.write("APIService ::: saveBuildingAmc :: exception : ", e);
    throw e;
  }
};
service.listBuildingAmcItems = async (data) => {
  try {
    log.write("APIService ::: listBuildingAmcItems :: data : ", data);
    var where = {};
    var buildingAmcs = await BuildingAmcItem.findAll({
      where: where,
      offset: data.offset,
      limit: data.limit,
    });
    log.write(
      "APIService ::: listBuildingAmcItemItems :: building amcs count : " +
        buildingAmcs.length
    );

    return buildingAmcs;
  } catch (e) {
    log.write("APIService ::: listBuildingAmcItemItems :: exception : ", e);
    throw e;
  }
};
service.saveBuildingAmcItem = async (data, username) => {
  try {
    log.write("APIService ::: saveBuildingAmcItem :: data : ", data);
    var result = {};
    data.updated = new Date();
    data.updatedBy = username;
    if (data.id) {
      await BuildingAmcItem.update(data, { where: { id: data.id } });
      result = data;
    } else {
      result = await BuildingAmcItem.create(data);
    }
    return result;
  } catch (e) {
    log.write("APIService ::: saveBuildingAmcItem :: exception : ", e);
    throw e;
  }
};

service.listBuildingProperties = async (data) => {
  try {
    log.write("APIService ::: listBuildingProperties :: data : ", data);
    var where = { companyId: data.companyId || 1 };
    if (data.filters.search && data.filters.search != "") {
      // where['name'] = { $like: '%' + data.filters.search + '%' }
      var query = data.filters;
      var $or = [];
      $or.push(
        Sequelize.where(
          Sequelize.fn("lower", Sequelize.literal("buildings.name")),
          {
            $like: "%" + query.search.toLowerCase() + "%",
          }
        )
      );
      $or.push(
        Sequelize.where(
          Sequelize.fn("lower", Sequelize.literal("location.name")),
          {
            $like: "%" + query.search.toLowerCase() + "%",
          }
        )
      );
      where["$and"] = { $or: $or };
    }
    if (data.filters.minSqft && data.filters.maxSqft) {
      where["buildupArea"] = {
        $and: [{ $gt: data.filters.minSqft }, { $lt: data.filters.maxSqft }],
      };
    }
    if (data.filters.minSqft && !data.filters.maxSqft) {
      where["buildupArea"] = { $gt: data.filters.minSqft };
    }
    if (!data.filters.minSqft && data.filters.maxSqft) {
      where["buildupArea"] = { $lt: data.filters.maxSqft };
    }
    if (data.filters.locationId && data.filters.locationId != "") {
      where["locationId"] = data.filters.locationId;
    }
    if (data.filters.locationIds && data.filters.locationIds.length) {
      where["locationId"] = { $in: data.filters.locationIds };
    }
    if (data.filters.cityId && data.filters.cityId != "") {
      where["$location.cityId$"] = data.filters.cityId;
    }
    if (data.filters.status && data.filters.status != "") {
      where["status"] = data.filters.status;
    }
    if (data.filters.shortlisted && data.filters.shortlisted != "") {
      where["shortlisted"] = data.filters.shortlisted;
    }
    if (data.filters.name && data.filters.name != "") {
      where["name"] = { $like: "%" + data.filters.name + "%" };
    }
    if (data.filters.statuses && data.filters.statuses.length) {
      where["status"] = { $in: data.filters.statuses };
    }
    if (data.filters.quarters && data.filters.quarters.length) {
      where["quarter"] = { $in: data.filters.quarters };
    }
    var buildings = await BuildingProperty.findAll({
      where: where,
      include: [
        {
          as: "location",
          model: Location,
          attributes: ["name", "cityId"],
          include: ["city"],
        },
      ],
      offset: data.offset,
      limit: data.limit,
      order: [["id", "desc"]],
    });
    log.write(
      "APIService ::: listBuildingProperties :: buildings count : " +
        buildings.length
    );

    return buildings;
  } catch (e) {
    log.write("APIService ::: listBuildingProperties :: exception : ", e);
    throw e;
  }
};
service.saveBuildingProperty = async (data) => {
  try {
    log.write("APIService ::: saveBuildingProperty :: data : ", data);
    var result = {};
    if (data.id) {
      await BuildingProperty.update(data, { where: { id: data.id } });
      result = data;
    } else {
      result = await BuildingProperty.create(data);
    }
    return result;
  } catch (e) {
    log.write("APIService ::: saveBuildingProperty :: exception : ", e);
    throw e;
  }
};
service.deleteBuildingProperty = async (id) => {
  try {
    log.write("APIService ::: deleteBuildingProperty :: id : ", id);
    var result = await BuildingProperty.destroy({ where: { id: id } });
    return result;
  } catch (e) {
    log.write("APIService ::: deleteFloor :: exception : ", e);
    throw e;
  }
};
service.listPropertyContacts = async (data) => {
  try {
    log.write("APIService ::: listPropertyContacts :: data : ", data);
    var where = {};
    if (data.filters) {
      where.propertyId = data.filters.propertyId;
    }
    var buildingContacts = await PropertyContact.findAll({
      where: where,
      offset: data.offset,
      limit: data.limit,
    });
    log.write(
      "APIService ::: listPropertyContacts :: building contacts count : " +
        buildingContacts.length
    );

    return buildingContacts;
  } catch (e) {
    log.write("APIService ::: listPropertyContacts :: exception : ", e);
    throw e;
  }
};
service.savePropertyContact = async (data, username) => {
  try {
    log.write("APIService ::: savePropertyContact :: data : ", data);
    var result = {};
    if (data.id) {
      data.updated = new Date();
      data.updatedBy = username;
      await PropertyContact.update(data, { where: { id: data.id } });
      result = data;
    } else {
      data.added = new Date();
      data.addedBy = username;
      result = await PropertyContact.create(data);
    }
    return result;
  } catch (e) {
    log.write("APIService ::: savePropertyContact :: exception : ", e);
    throw e;
  }
};
service.getPropertyContract = async (id) => {
  try {
    var building = await BuildingProperty.findOne({
      attributes: ["id"],
      where: { id: id },
      include: [
        {
          as: "contract",
          required: false,
          model: PropertyContract,
          include: [
            {
              required: false,
              as: "updates",
              model: PropertyContractNegotiation,
            },
          ],
        },
      ],
    });
    return {
      contract: building.contract,
      images: building.images,
    };
  } catch (e) {
    log.write("APIService ::: getPropertyContract :: exception : ", e);
    throw e;
  }
};
service.savePropertyContract = async (data, username) => {
  try {
    log.write("APIService ::: savePropertyContract :: data : ", data);
    var result = {};
    data.updatedBy = username;
    data.updated = new Date();
    if (data.id) {
      await PropertyContract.update(data, { where: { id: data.id } });
      result = data;
    } else {
      data.initiatedBy = username;
      result = await PropertyContract.create(data);
    }
    return result;
  } catch (e) {
    log.write("APIService ::: savePropertyContract :: exception : ", e);
    throw e;
  }
};
service.listPropertyImages = async (data) => {
  try {
    log.write("APIService ::: listPropertyImages :: data : ", data);
    var where = {};
    if (data.filters) {
      where.id = data.filters.propertyId;
    }
    var property = await BuildingProperty.findOne({
      where: where,
      include: ["images"],
      offset: data.offset,
      limit: data.limit,
    });
    log.write(
      "APIService ::: listPropertyImages :: property images count : " +
        property.images.length
    );

    return property.images;
  } catch (e) {
    log.write("APIService ::: listPropertyImages :: exception : ", e);
    throw e;
  }
};
service.listPropertyContractNegotiations = async (data) => {
  try {
    log.write(
      "APIService ::: listPropertyContractNegotiations :: data : ",
      data
    );
    var where = {};
    if (data.filters) {
      where.propertyId = data.filters.propertyId;
    }
    var negotiations = await PropertyContractNegotiation.findAll({
      where: where,
      offset: data.offset,
      limit: data.limit,
    });
    log.write(
      "APIService ::: listPropertyContractNegotiations :: building contacts count : " +
        negotiations.length
    );

    return negotiations;
  } catch (e) {
    log.write(
      "APIService ::: listPropertyContractNegotiations :: exception : ",
      e
    );
    throw e;
  }
};
service.savePropertyContractNegotiation = async (data, username) => {
  try {
    log.write(
      "APIService ::: savePropertyContractNegotiation :: data : ",
      data
    );
    var result = {};
    data.updatedBy = username;
    data.updated = new Date();
    if (data.id) {
      await PropertyContractNegotiation.update(data, {
        where: { id: data.id },
      });
      result = data;
    } else {
      result = await PropertyContractNegotiation.create(data);
    }

    await PropertyContract.update(
      {
        finalSqftPrice: data.negotiatedSqftPrice,
        finalRent: data.negotiatedRent,
        finalDeposit: data.negotiatedDeposit,
        finalMaintenancePrice: data.negotiatedMaintenancePrice,
        finalHandover: data.negotiatedHandover,
      },
      { where: { id: data.propertyContractId } }
    );

    return result;
  } catch (e) {
    log.write(
      "APIService ::: savePropertyContractNegotiation :: exception : ",
      e
    );
    throw e;
  }
};

service.getBuildingServices = async (id) => {
  try {
    var building = await Building.findOne({
      where: { id: id },
      include: [
        {
          as: "services",
          required: false,
          model: BuildingService,
          include: [
            {
              required: false,
              as: "assignees",
              where: { active: 1 },
              model: BuildingServiceAssignee,
              include: [
                {
                  as: "user",
                  model: User,
                  attributes: ["id", "name", "email", "phone"],
                },
              ],
            },
          ],
        },
      ],
    });
    return building.services;
  } catch (e) {
    log.write("APIService ::: saveBuildingService :: exception : ", e);
    throw e;
  }
};
service.saveBuildingService = async (data, username) => {
  try {
    log.write("APIService ::: saveBuildingService :: data : ", data);
    var result = {};
    data.updatedBy = username;
    data.updated = new Date();
    if (data.id) {
      await BuildingService.update(data, { where: { id: data.id } });
      result = data;
    } else {
      var buildingService = await BuildingService.findOne({
        where: { buildingId: data.buildingId, serviceCode: data.serviceCode },
      });
      if (buildingService) {
        await BuildingService.update(data, {
          where: { buildingId: data.buildingId, serviceCode: data.serviceCode },
        });
        result = data;
      } else {
        result = await BuildingService.create(data);
      }
    }
    return result;
  } catch (e) {
    log.write("APIService ::: saveBuildingService :: exception : ", e);
    throw e;
  }
};
service.saveBuildingServiceAssignee = async (
  data,
  username,
  dontUpdateUserRole
) => {
  try {
    log.write("APIService ::: saveBuildingServiceAssignee :: data : ", data);
    var result = {};
    data.updatedBy = username;
    data.updated = new Date();
    if (data.id) {
      await BuildingServiceAssignee.update(data, { where: { id: data.id } });
      result = data;
    } else {
      var buildingService = await BuildingServiceAssignee.findOne({
        where: {
          buildingServiceId: data.buildingServiceId,
          userId: data.userId,
        },
      });
      if (buildingService) {
        await BuildingServiceAssignee.update(data, {
          where: {
            buildingServiceId: data.buildingServiceId,
            userId: data.userId,
          },
        });
        result = data;
      } else {
        result = await BuildingServiceAssignee.create(data);
      }
    }

    if (!dontUpdateUserRole) {
      var buildingService = await BuildingService.findOne({
        where: { id: data.buildingServiceId },
      });
      if (buildingService) {
        var userRole = await UserRole.findOne({
          where: {
            userId: data.userId,
            assigneeType: buildingService.serviceCode,
          },
        });
        if (data.active) {
          if (userRole) {
            var buildingIds = userRole.buildingIds.split(",");
            if (buildingIds.indexOf(buildingService.buildingId + "") < 0) {
              buildingIds.push(buildingService.buildingId);
              userRole.set("buildingIds", buildingIds.join(","));
              userRole.save();
            }
          }
        } else {
          if (userRole) {
            var buildingIds = userRole.buildingIds.split(",");
            var index = buildingIds.indexOf(buildingService.buildingId + "");
            if (index > -1) {
              buildingIds.splice(index, 1);
              userRole.set("buildingIds", buildingIds.join(","));
              userRole.save();
            }
          }
        }
      }
    }
    return result;
  } catch (e) {
    log.write("APIService ::: saveBuildingServiceAssignee :: exception : ", e);
    throw e;
  }
};

service.listOffices = async (data) => {
  try {
    log.write("APIService ::: listOffices :: data : ", data);
    var where = {};
    if (data.filters.search && data.filters.search != "") {
      // where['name'] = { $like: '%' + data.filters.search + '%' }
      var query = data.filters;
      var $or = [];
      $or.push(
        Sequelize.where(Sequelize.fn("lower", Sequelize.literal("name")), {
          $like: "%" + query.search.toLowerCase() + "%",
        })
      );
      where["$and"] = { $or: $or };
    }
    if (data.filters.status && data.filters.status != "") {
      where["status"] = data.filters.status;
    }
    if (data.filters.buildingId && data.filters.buildingId != "") {
      where["buildingId"] = data.filters.buildingId;
    }
    if (data.filters.locationId && data.filters.locationId != "") {
      where["$building.locationId$"] = data.filters.locationId;
    }
    where.companyId = data.companyId;

    var attributes = null;
    var include = [
      {
        as: "building",
        model: Building,
        attributes: ["name", "locationId"],
        include: [
          { as: "location", model: Location, attributes: ["name", "cityId"] },
        ],
      },
      { as: "pricings", model: OfficePricing },
    ];

    var subQuery = false;
    if (data.filters.typeSearch) {
      attributes = ["id", "name"];
      include = null;
    }
    if (data.filters.cityId && data.filters.cityId != "") {
      include = [
        {
          as: "building",
          model: Building,
          attributes: ["name", "locationId"],
          include: [
            { as: "location", model: Location, attributes: ["name", "cityId"] },
          ],
        },
      ];
      where["$building.location.cityId$"] = data.filters.cityId;
      subQuery = false;
    }
    log.write("APIService ::: listOffices :: offices where : ", where);
    // log.write("APIService ::: listOffices :: offices include : ", include);
    // where['$pricings.active$'] = 1;
    var offices = await Office.findAll({
      attributes: attributes,
      where: where,
      include: include,
      subQuery: subQuery,
      offset: data.offset,
      limit: data.limit,
    });
    log.write(
      "APIService ::: listOffices :: offices count : " + offices.length
    );

    var results = [];
    for (var i = 0; i < offices.length; i++) {
      var office = offices[i].toJSON();
      office.location = await systemUtils.getLocation(office.locationId);
      // log.write("APIService ::: listOffices :: office : ", office);
      results.push(office);
    }
    return results;
  } catch (e) {
    log.write("APIService ::: listOffices :: exception : ", e);
    throw e;
  }
};
service.saveOffice = async (data) => {
  try {
    log.write("APIService ::: saveOffice :: data : ", data);
    var office = {};
    if (data.id) {
      await Office.update(data, { where: { id: data.id } });

      var statuses = {
        UnderConsideration: 0,
        AgreementInprogress: 1,
        AgreementSigned: 2,
        Live: 3,
      };
      var higherStatus = -1,
        status = "",
        allowedDeskSizes = "",
        carpetArea = 0,
        chargeableArea = 0,
        expectedLive = utils.moment().add(10, "years"),
        rentStarted = utils.moment().add(10, "years");

      var offices = await Office.findAll({
        where: { buildingId: data.buildingId, active: 1 },
      });
      _.each(offices, function (o) {
        log.write("APIService ::: saveOffice :: office : ", o.toJSON());
        if (statuses[o.status] > higherStatus) {
          higherStatus = statuses[o.status];
          status = o.status;
        }
        if (
          o.expectedLive &&
          utils.moment(o.expectedLive).isBefore(expectedLive)
        ) {
          expectedLive = o.expectedLive;
        }
        if (
          o.rentStarted &&
          utils.moment(o.rentStarted).isBefore(rentStarted)
        ) {
          rentStarted = o.rentStarted;
        }
        if (o.carpetArea) {
          carpetArea = carpetArea + o.carpetArea;
        }
        if (o.chargeableArea) {
          chargeableArea = chargeableArea + o.chargeableArea;
        }
        if (o.allowedDeskSizes) {
          allowedDeskSizes = allowedDeskSizes + o.allowedDeskSizes + ",";
        }
      });

      allowedDeskSizes = allowedDeskSizes.split(",");
      allowedDeskSizes.pop();
      allowedDeskSizes = _.uniq(allowedDeskSizes);
      var update = {
        allowedDeskSizes: allowedDeskSizes.join(","),
        rentStarted: rentStarted,
        expectedLive: expectedLive,
        carpetArea: carpetArea,
        chargeableArea: chargeableArea,
        status: status,
      };
      log.write(
        "AdminService ::: saveOffice :: building update : " + data.buildingId,
        update
      );
      await Building.update(update, { where: { id: data.buildingId } });

      office = data;
    } else {
      office = await Office.create(data);
    }
    return office;
  } catch (e) {
    log.write("APIService ::: saveOffice :: exception : ", e);
    throw e;
  }
};
service.deleteOffice = async (id) => {
  try {
    log.write("APIService ::: deleteOffice :: id : ", id);
    var result = await Office.destroy({ where: { id: id } });
    return result;
  } catch (e) {
    log.write("APIService ::: deleteOffice :: exception : ", e);
    throw e;
  }
};

service.listOfficePricings = async (data) => {
  try {
    log.write("APIService ::: listOfficePricings :: data : ", data);
    var where = {};
    if (data.filters.name && data.filters.name != "") {
      where["name"] = { $like: "%" + data.filters.name + "%" };
    }
    if (data.filters.active && data.filters.active != "") {
      where["active"] = data.filters.active;
    } else {
      where["active"] = 1;
    }
    var offices = await OfficePricing.findAll({
      where: where,
      offset: data.offset,
      limit: data.limit,
      include: ["location"],
    });
    log.write(
      "APIService ::: listOfficePricings :: offices count : " + offices.length
    );

    var results = [];
    offices.forEach(async (_office) => {
      var office = _office.toJSON();
      office.location = await systemUtils.getLocation(office.location);
      // log.write("APIService ::: listOfficePricings :: office : ", office);
      results.push(office);
    });
    return results;
  } catch (e) {
    log.write("APIService ::: listOfficePricings :: exception : ", e);
    throw e;
  }
};
service.saveOfficePricing = async (data) => {
  try {
    log.write("APIService ::: saveOfficePricing :: data : ", data);
    var office = {};
    if (data.id) {
      await OfficePricing.update(data, { where: { id: data.id } });
      office = data;
    } else {
      office = await OfficePricing.create(data);
    }

    var sql =
      "update offices set bestPrice=(select min(price) price from office_pricings where officeId=" +
      data.officeId +
      ") where id=" +
      data.officeId;
    session.db.query(sql);

    return office;
  } catch (e) {
    log.write("APIService ::: saveOfficePricing :: exception : ", e);
    throw e;
  }
};
service.deleteOfficePricing = async (id) => {
  try {
    log.write("APIService ::: deleteOfficePricing :: id : ", id);
    var result = await OfficePricing.destroy({ where: { id: id } });
    return result;
  } catch (e) {
    log.write("APIService ::: deleteOfficePricing :: exception : ", e);
    throw e;
  }
};

service.listFloors = async (data) => {
  try {
    log.write("APIService ::: listFloors :: data : ", data);
    var where = {};
    if (data.filters.officeId && data.filters.officeId != "") {
      where["officeId"] = data.filters.officeId;
    }
    if (data.filters.status && data.filters.status != "") {
      where["status"] = data.filters.status;
    }
    var floors = await Floor.findAll({
      where: where,
      offset: data.offset,
      limit: data.limit,
    });
    log.write("APIService ::: listFloors :: floors count : " + floors.length);

    return floors;
  } catch (e) {
    log.write("APIService ::: listFloors :: exception : ", e);
    throw e;
  }
};
service.saveFloor = async (data) => {
  try {
    log.write("APIService ::: saveFloor :: data : ", data);
    var result = {};
    if (data.id) {
      await Floor.update(data, { where: { id: data.id } });
      result = data;
    } else {
      result = await Floor.create(data);
    }
    return result;
  } catch (e) {
    log.write("APIService ::: saveFloor :: exception : ", e);
    throw e;
  }
};
service.deleteFloor = async (id) => {
  try {
    log.write("APIService ::: deleteFloor :: id : ", id);
    var result = await Floor.destroy({ where: { id: id } });
    return result;
  } catch (e) {
    log.write("APIService ::: deleteFloor :: exception : ", e);
    throw e;
  }
};

service.listCabins = async (data) => {
  try {
    log.write("APIService ::: listCabins :: data : ", data);
    var where = {};
    var include = null;
    if (data.filters.officeId && data.filters.officeId != "") {
      where["officeId"] = data.filters.officeId;
    }
    if (data.filters.status && data.filters.status != "") {
      where["status"] = data.filters.status;
    }
    // log.write("APIService ::: listCabins :: cabins where : ", where);
    var cabins = await Cabin.findAll({
      where: where,
      offset: data.offset,
      limit: data.limit,
    });
    log.write("APIService ::: listCabins :: cabins count : " + cabins.length);

    return cabins;
  } catch (e) {
    log.write("APIService ::: listCabins :: exception : ", e);
    throw e;
  }
};
service.saveCabin = async (data) => {
  try {
    log.write("APIService ::: saveCabin :: data : ", data);
    var result = {};
    if (data.id) {
      await Cabin.update(data, { where: { id: data.id } });
      result = data;
    } else {
      result = await Cabin.create(data);
    }
    return result;
  } catch (e) {
    log.write("APIService ::: saveCabin :: exception : ", e);
    throw e;
  }
};
service.deleteCabin = async (id) => {
  try {
    log.write("APIService ::: deleteCabin :: id : ", id);
    var result = await Cabin.destroy({ where: { id: id } });
    return result;
  } catch (e) {
    log.write("APIService ::: deleteCabin :: exception : ", e);
    throw e;
  }
};

service.listParkingLots = async (data) => {
  try {
    log.write("APIService ::: listParkingLots :: data : ", data);
    var where = {};
    var include = null;
    if (data.filters.buildingId && data.filters.buildingId != "") {
      where["buildingId"] = data.filters.buildingId;
    }
    if (data.filters.status && data.filters.status != "") {
      where["status"] = data.filters.status;
    }
    // log.write("APIService ::: listCabins :: cabins where : ", where);
    var ParkingLots = await ParkingLot.findAll({
      where: where,
      offset: data.offset,
      limit: data.limit,
    });
    log.write("APIService ::: listParkingLots :: ParkingLots count : " + ParkingLots.length);

    return ParkingLots;
  } catch (e) {
    log.write("APIService ::: listParkingLots :: exception : ", e);
    throw e;
  }
};
service.saveParkingLots = async (data) => {
  try {
    log.write("APIService ::: saveParkingLots :: data : ", data);
    var result = {};
    if (data.id) {
      await ParkingLot.update(data, { where: { id: data.id } });
      result = data;
    } else {
      result = await ParkingLot.create(data);
    }
    return result;
  } catch (e) {
    log.write("APIService ::: saveParkingLots :: exception : ", e);
    throw e;
  }
};
service.deleteParkingLots = async (id) => {
  try {
    log.write("APIService ::: deleteParkingLots :: id : ", id);
    var result = await Cabin.destroy({ where: { id: id } });
    return result;
  } catch (e) {
    log.write("APIService ::: deleteParkingLots :: exception : ", e);
    throw e;
  }
};
service.listParkingSpots = async (data) => {
  try {
    log.write("APIService ::: listParkingSpots :: data : ", data);
    var where = {};
    var include = null;
    if (data.filters.parkingLotId && data.filters.parkingLotId != "") {
      where["parkingLotId"] = data.filters.parkingLotId;
    }
    if (data.filters.status && data.filters.status != "") {
      where["status"] = data.filters.status;
    }
    var slots = await ParkingSpot.findAll({
      where: where,
      offset: data.offset,
      limit: data.limit,
    });
    log.write("APIService ::: listParkingSpots :: desks count : " + slots.length);

    return slots;
  } catch (e) {
    log.write("APIService ::: listParkingSpots :: exception : ", e);
    throw e;
  }
};
service.saveParkingSpots = async (data) => {
  try {
    log.write("APIService ::: saveParkingSpots :: data : ", data);
    var result = {};
    if (data.id) {
      await ParkingSpot.update(data, { where: { id: data.id } });
      result = data;
    } else {
      var count = data.count;
      delete data.count;
      var name = data.name;
      if (count > 1) {
        for (var i = 0; i < count; i++) {
          data.name = name + "_" + (i + 1);
          result = await ParkingSpot.create(data);
        }
      } else {
        result = await ParkingSpot.create(data);
      }
    }
    return result;
  } catch (e) {
    log.write("APIService ::: saveParkingSpots :: exception : ", e);
    throw e;
  }
};


service.listDesks = async (data) => {
  try {
    log.write("APIService ::: listDesks :: data : ", data);
    var where = {};
    var include = null;
    if (data.filters.cabinId && data.filters.cabinId != "") {
      where["cabinId"] = data.filters.cabinId;
    }
    if (data.filters.status && data.filters.status != "") {
      where["status"] = data.filters.status;
    }
    var desks = await Desk.findAll({
      where: where,
      offset: data.offset,
      limit: data.limit,
    });
    log.write("APIService ::: listDesks :: desks count : " + desks.length);

    return desks;
  } catch (e) {
    log.write("APIService ::: listDesks :: exception : ", e);
    throw e;
  }
};
service.saveDesk = async (data) => {
  try {
    log.write("APIService ::: saveDesk :: data : ", data);
    var result = {};
    if (data.id) {
      await Desk.update(data, { where: { id: data.id } });
      result = data;
    } else {
      var count = data.count;
      delete data.count;
      var name = data.name;
      if (count > 1) {
        for (var i = 0; i < count; i++) {
          data.name = name + "_" + (i + 1);
          result = await Desk.create(data);
        }
      } else {
        result = await Desk.create(data);
      }
    }
    return result;
  } catch (e) {
    log.write("APIService ::: saveDesk :: exception : ", e);
    throw e;
  }
};
service.deleteDesk = async (id) => {
  try {
    log.write("APIService ::: deleteDesk :: id : ", id);
    var result = await Desk.destroy({ where: { id: id } });
    return result;
  } catch (e) {
    log.write("APIService ::: deleteDesk :: exception : ", e);
    throw e;
  }
};

service.listResources = async (data) => {
  try {
    log.write("APIService ::: listResources :: data : ", data);
    var where = {};
    var include = null;
    if (data.filters.officeId && data.filters.officeId != "") {
      where["officeId"] = data.filters.officeId;
    }
    if (data.filters.status && data.filters.status != "") {
      where["status"] = data.filters.status;
    }
    var items = await Resource.findAll({
      where: where,
      offset: data.offset,
      limit: data.limit,
    });
    log.write("APIService ::: listResources :: items count : " + items.length);

    return items;
  } catch (e) {
    log.write("APIService ::: listResources :: exception : ", e);
    throw e;
  }
};
service.saveResource = async (data, username) => {
  try {
    log.write("APIService ::: saveResource :: data : ", data);
    var result = {};
    data.updatedBy = username || "system";
    data.updated = new Date();
    if (data.id) {
      await Resource.update(data, { where: { id: data.id } });
      result = data;
    } else {
      result = await Resource.create(data);
    }
    return result;
  } catch (e) {
    log.write("APIService ::: saveResource :: exception : ", e);
    throw e;
  }
};
service.deleteResource = async (id) => {
  try {
    log.write("APIService ::: deleteResource :: id : ", id);
    var result = await Resource.destroy({ where: { id: id } });
    return result;
  } catch (e) {
    log.write("APIService ::: deleteResource :: exception : ", e);
    throw e;
  }
};
service.listResourceImages = async (data) => {
  try {
    log.write("AdminService ::: listResourceImages :: data : ", data);
    var where = {};
    if (data.filters && data.filters.resourceId) {
      where.resourceId = data.filters.resourceId;
    }
    var results = await ResourceImage.findAll({
      where: where,
      include: ["image"],
    });
    log.write(
      "AdminService ::: listResourceImages :: images count : " + results.length
    );
    return results;
  } catch (e) {
    log.write("AdminService ::: listResourceImages :: exception : ", e);
    throw e;
  }
};

service.listFacilities = async (data) => {
  try {
    log.write("APIService ::: listFacilities :: data : ", data);
    var where = {};
    var include = null;
    if (data.active && data.active != "") {
      where["active"] = 1;
    }
    var desks = await Facility.findAll({
      where: where,
      offset: data.offset,
      limit: data.limit,
    });
    log.write("APIService ::: listFacilities :: desks count : " + desks.length);

    return desks;
  } catch (e) {
    log.write("APIService ::: listFacilities :: exception : ", e);
    throw e;
  }
};
service.saveFacility = async (data) => {
  try {
    log.write("APIService ::: saveFacility :: data : ", data);
    var result = {};
    if (data.id) {
      await Facility.update(data, { where: { id: data.id } });
      result = data;
    } else {
      result = await Facility.create(data);
    }
    return result;
  } catch (e) {
    log.write("APIService ::: saveFacility :: exception : ", e);
    throw e;
  }
};
service.deleteFacility = async (id) => {
  try {
    log.write("APIService ::: deleteFacility :: id : ", id);
    var result = await Facility.destroy({ where: { id: id } });
    return result;
  } catch (e) {
    log.write("APIService ::: deleteFacility :: exception : ", e);
    throw e;
  }
};

service.listFacilitySets = async (data) => {
  try {
    log.write("APIService ::: listFacilitySets :: data : ", data);
    var where = {};
    var include = null;
    if (data.active && data.active != "") {
      where["active"] = data.active;
    }
    var desks = await FacilitySet.findAll({
      where: where,
      include: ["facilities"],
      offset: data.offset,
      limit: data.limit,
    });
    log.write(
      "APIService ::: listFacilitySets :: desks count : " + desks.length
    );

    return desks;
  } catch (e) {
    log.write("APIService ::: listFacilities :: exception : ", e);
    throw e;
  }
};
service.saveFacilitySet = async (data) => {
  try {
    log.write("APIService ::: saveFacilitySet :: data : ", data);
    var result = {};
    if (data.id) {
      await FacilitySet.update(data, { where: { id: data.id } });
      result = data;
    } else {
      result = await FacilitySet.create(data);
    }
    return result;
  } catch (e) {
    log.write("APIService ::: saveFacilitySet :: exception : ", e);
    throw e;
  }
};
service.deleteFacilitySet = async (id) => {
  try {
    log.write("APIService ::: deleteFacilitySet :: id : ", id);
    var result = await FacilitySet.destroy({ where: { id: id } });
    return result;
  } catch (e) {
    log.write("APIService ::: deleteFacilitySet :: exception : ", e);
    throw e;
  }
};

service.updateFacilitySetFacilities = async (data) => {
  try {
    log.write("APIService ::: saveFacilitySet :: data : ", data);
    var result = {};
    if (data.remove) {
      SetFacility.destroy({
        where: { setId: data.setId, facilityId: data.facilityId },
      });
      result = data;
    } else if (data.add) {
      result = await SetFacility.create(data);
    }
    return result;
  } catch (e) {
    log.write("APIService ::: saveFacilitySet :: exception : ", e);
    throw e;
  }
};

// ####################### Start of Mails ################################
service.listMails = async (data) => {
  try {
    log.write("APIService ::: listMails :: data : ", data);
    var where = {};
    if (data.filters.type) {
      where["type"] = data.filters.type;
    }
    if (data.filters.status) {
      where["status"] = data.filters.status;
    }
    var mails = await Mail.findAll({
      where: where,
      offset: data.offset,
      limit: data.limit,
      order: [["id", "desc"]],
    });
    log.write("APIService ::: listMails :: mails count : " + mails.length);
    // log.write("APIService ::: listMails :: mails count : ", mails);

    return mails;
  } catch (e) {
    log.write("APIService ::: listMails :: exception : ", e);
    throw e;
  }
};
service.saveMail = async (data) => {
  try {
    log.write("APIService ::: saveMail :: data : ", data);
    var result = {};
    if (data.id) {
      await Mail.update(data, { where: { id: data.id } });
      result = data;
    } else if (data.send) {
      result = await services.sendMail(data.subject, data.body, data.receivers);
    } else {
      result = await Mail.create(data);
    }
    return result;
  } catch (e) {
    log.write("APIService ::: saveMail :: exception : ", e);
    throw e;
  }
};
service.deleteMail = async (id) => {
  try {
    log.write("APIService ::: deleteMail :: id : ", id);
    var result = await Mail.destroy({ where: { id: id } });
    return result;
  } catch (e) {
    log.write("APIService ::: deleteMail :: exception : ", e);
    throw e;
  }
};

// ####################### Start of Sms ################################
service.listSms = async (data) => {
  try {
    log.write("APIService ::: listSmss :: data : ", data);
    var where = {};
    if (data.filters.search) {
      var query = data.filter;
      var $or = [];
      $or.push(
        Sequelize.where(Sequelize.fn("lower", Sequelize.literal("name")), {
          $like: "%" + query.search.toLowerCase() + "%",
        })
      );
      $or.push(
        Sequelize.where(Sequelize.fn("lower", Sequelize.literal("email")), {
          $like: "%" + query.search.toLowerCase() + "%",
        })
      );
      $or.push(
        Sequelize.where(Sequelize.fn("lower", Sequelize.literal("phone")), {
          $like: "%" + query.search.toLowerCase() + "%",
        })
      );
      $or.push(
        Sequelize.where(Sequelize.fn("lower", Sequelize.literal("course")), {
          $like: "%" + query.search.toLowerCase() + "%",
        })
      );
      where["$and"] = { $or: $or };
    }
    if (data.isActive != null) {
      where.isActive = data.isActive;
    }
    if (data.isRegistered != null) {
      where.isRegistered = data.isRegistered;
    }
    log.write("APIService ::: listSmss :: data where : ", where);
    var data = await Sms.findAll({
      where: where,
      attributes: [
        "id",
        "name",
        "email",
        "phone",
        "isRegistered",
        "isActive",
        "course",
        "createdOn",
        "registeredOn",
        "unregistered",
        "unRegisteredOn",
        "validTill",
      ],
      offset: data.offset || 0,
      limit: data.limit || 100,
    });
    log.write("APIService ::: listSmss :: data count : " + data.length);
    return data;
  } catch (e) {
    log.write("APIService ::: listSmss :: exception : ", e);
    throw e;
  }
};
service.saveSms = async (data) => {
  try {
    log.write("APIService ::: saveSms :: data : ", data);
    var result = {};
    if (data.id) {
      await Sms.update(data, { where: { id: data.id } });
      result = data;
    } else {
      data.createdOn = new Date();
      data.isActive = true;
      result = await Sms.create(data);
    }
    return result;
  } catch (e) {
    log.write("APIService ::: saveSms :: exception : ", e);
    throw e;
  }
};
service.deleteSms = async (id) => {
  try {
    log.write("APIService ::: deleteSms :: id : ", id);
    var result = await Sms.destroy({ where: { id: id } });
    return result;
  } catch (e) {
    log.write("APIService ::: deleteSms :: exception : ", e);
    throw e;
  }
};

// ####################### Start of Sms ################################
service.listSkuCategories = async (data) => {
  try {
    log.write("APIService ::: listSkuCategorys :: data : ", data);
    var where = {};
    if (data.filters.status != null && data.filters.status != "") {
      where.status = data.filters.status;
    }
    if (data.filters.name != null && data.filters.name != "") {
      where.name = { $like: "%" + data.filters.name + "%" };
    }

    log.write("APIService ::: listSkuCategorys :: data where : ", where);
    var categories = await SkuCategory.findAll({
      where: where,
      offset: data.offset || 0,
      limit: data.limit || 100,
    });
    log.write(
      "APIService ::: listSkuCategorys :: categories count : " +
        categories.length
    );
    return categories;
  } catch (e) {
    log.write("APIService ::: listSkuCategorys :: exception : ", e);
    throw e;
  }
};
service.saveSkuCategory = async (data, username) => {
  try {
    log.write("APIService ::: saveSkuCategory :: data : ", data);
    var result = {};
    data.updated = new Date();
    data.updatedBy = username || "system";
    if (data.id) {
      await SkuCategory.update(data, { where: { id: data.id } });
      result = data;
    } else {
      data.filters.status = "Published";
      result = await SkuCategory.create(data);
    }
    return result;
  } catch (e) {
    log.write("APIService ::: saveSkuCategory :: exception : ", e);
    throw e;
  }
};
service.deleteSkuCategory = async (id) => {
  try {
    log.write("APIService ::: deleteSkuCategory :: id : ", id);
    var result = await SkuCategory.destroy({ where: { id: id } });
    return result;
  } catch (e) {
    log.write("APIService ::: deleteSkuCategory :: exception : ", e);
    throw e;
  }
};

service.listSkus = async (data) => {
  try {
    log.write("APIService ::: listSkus :: data : ", data);
    var where = {};
    if (data.filters.status != null && data.filters.status != "") {
      where.status = data.filters.status;
    }
    if (data.filters.name != null && data.filters.name != "") {
      where.name = { $like: "%" + data.filters.name + "%" };
    }

    log.write("APIService ::: listSkus :: data where : ", where);
    var categories = await Sku.findAll({
      where: where,
      offset: data.offset || 0,
      limit: data.limit || 100,
    });
    log.write(
      "APIService ::: listSkus :: categories count : " + categories.length
    );
    return categories;
  } catch (e) {
    log.write("APIService ::: listSkus :: exception : ", e);
    throw e;
  }
};
service.saveSku = async (data, username) => {
  try {
    log.write("APIService ::: saveSku :: data : ", data);
    var result = {};
    data.updated = new Date();
    data.updatedBy = username || "system";
    if (data.id) {
      await Sku.update(data, { where: { id: data.id } });
      result = data;
    } else {
      data.filters.status = "Published";
      result = await Sku.create(data);
    }
    return result;
  } catch (e) {
    log.write("APIService ::: saveSku :: exception : ", e);
    throw e;
  }
};
service.deleteSku = async (id) => {
  try {
    log.write("APIService ::: deleteSku :: id : ", id);
    var result = await Sku.destroy({ where: { id: id } });
    return result;
  } catch (e) {
    log.write("APIService ::: deleteSku :: exception : ", e);
    throw e;
  }
};

service.listAssets = async (data) => {
  try {
    log.write("APIService ::: listAssets :: data : ", data);
    var where = {};
    if (data.filters.status != null && data.filters.status != "") {
      where.status = data.filters.status;
    }
    if (data.filters.search) {
      var query = data.filters;
      var $or = [];
      $or.push(
        Sequelize.where(Sequelize.fn("lower", Sequelize.literal("name")), {
          $like: "%" + query.search.toLowerCase() + "%",
        })
      );
      $or.push(
        Sequelize.where(Sequelize.fn("lower", Sequelize.literal("code")), {
          $like: "%" + query.search.toLowerCase() + "%",
        })
      );
      $or.push(
        Sequelize.where(
          Sequelize.fn("lower", Sequelize.literal("manufacturer")),
          {
            $like: "%" + query.search.toLowerCase() + "%",
          }
        )
      );
      $or.push(
        Sequelize.where(Sequelize.fn("lower", Sequelize.literal("modelName")), {
          $like: "%" + query.search.toLowerCase() + "%",
        })
      );
      where["$and"] = { $or: $or };
    }

    log.write("APIService ::: listAssets :: data where : ", where);
    var categories = await Asset.findAll({
      where: where,
      offset: data.offset || 0,
      limit: data.limit || 100,
    });
    log.write(
      "APIService ::: listAssets :: categories count : " + categories.length
    );
    return categories;
  } catch (e) {
    log.write("APIService ::: listAssets :: exception : ", e);
    throw e;
  }
};
service.saveAsset = async (data, username) => {
  try {
    log.write("APIService ::: saveAsset :: data : ", data);
    var result = {};
    data.updated = new Date();
    data.updatedBy = username || "system";
    if (data.id) {
      await Asset.update(data, { where: { id: data.id } });
      result = data;
    } else {
      data.filters.status = "Published";
      result = await Asset.create(data);
    }
    return result;
  } catch (e) {
    log.write("APIService ::: saveAsset :: exception : ", e);
    throw e;
  }
};
service.deleteAsset = async (id) => {
  try {
    log.write("APIService ::: deleteAsset :: id : ", id);
    var result = await Asset.destroy({ where: { id: id } });
    return result;
  } catch (e) {
    log.write("APIService ::: deleteAsset :: exception : ", e);
    throw e;
  }
};

service.listExternalSystems = async (data) => {
  try {
    log.write("APIService ::: listExternalSystems :: data : ", data);
    var where = {};
    if (data.filters.active != null && data.filters.active != "") {
      where.active = 1;
    }
    if (data.filters.type != null && data.filters.type != "") {
      where.type = data.filters.type;
    }

    log.write("APIService ::: listExternalSystems :: where : ", where);
    var systems = await ExternalSystem.findAll({
      where: where,
      offset: data.offset || 0,
      limit: data.limit || 100,
    });
    log.write(
      "APIService ::: listExternalSystems ::  count : " + systems.length
    );
    return systems;
  } catch (e) {
    log.write("APIService ::: listExternalSystems :: exception : ", e);
    throw e;
  }
};
service.saveExternalSystem = async (data, username) => {
  try {
    log.write("APIService ::: saveExternalSystem :: data : ", data);
    var result = {};
    data.updated = new Date();
    data.updatedBy = username || "system";
    if (data.id) {
      await ExternalSystem.update(data, { where: { id: data.id } });
      result = data;
    } else {
      result = await ExternalSystem.create(data);
    }
    return result;
  } catch (e) {
    log.write("APIService ::: saveExternalSystem :: exception : ", e);
    throw e;
  }
};
service.deleteExternalSystem = async (id) => {
  try {
    log.write("APIService ::: deleteExternalSystem :: id : ", id);
    var result = await ExternalSystem.destroy({ where: { id: id } });
    return result;
  } catch (e) {
    log.write("APIService ::: deleteExternalSystem :: exception : ", e);
    throw e;
  }
};

// ####################### Start of service providers methods  ################################
service.listServiceProviderServices = async (data) => {
  try {
    log.write("APIService ::: listServiceProviderServices :: data : ", data);
    var where = {};
    if (data.filters.active != null && data.filters.active != "") {
      where.active = data.filters.active;
    }
    if (data.filters.search) {
      var query = data.filters;
      var $or = [];
      $or.push(
        Sequelize.where(Sequelize.fn("lower", Sequelize.literal("name")), {
          $like: "%" + query.search.toLowerCase() + "%",
        })
      );
      where["$and"] = { $or: $or };
    }
    log.write(
      "APIService ::: listServiceProviderServices :: data where : ",
      where
    );
    var categories = await ProviderService.findAll({
      where: where,
      offset: data.offset || 0,
      limit: data.limit || 100,
    });
    log.write(
      "APIService ::: listServiceProviderServices :: categories count : " +
        categories.length
    );
    return categories;
  } catch (e) {
    log.write("APIService ::: listServiceProviderServices :: exception : ", e);
    throw e;
  }
};
service.saveServiceProviderService = async (data, username) => {
  try {
    log.write("APIService ::: saveServiceProviderService :: data : ", data);
    var result = {};
    data.updated = new Date();
    data.updatedBy = username || "system";
    if (data.id) {
      await ProviderService.update(data, { where: { id: data.id } });
      result = data;
    } else {
      result = await ProviderService.create(data);
    }
    return result;
  } catch (e) {
    log.write("APIService ::: saveServiceProviderService :: exception : ", e);
    throw e;
  }
};
service.listServiceProviders = async (data) => {
  try {
    log.write("APIService ::: listServiceProviders :: data : ", data);
    var where = {};
    if (data.filters.active != null && data.filters.active != "") {
      where.active = data.filters.active;
    }
    if (data.filters.hasGst != null && data.filters.hasGst != "") {
      where.hasGst = data.filters.hasGst;
    }
    if (data.filters.hasTds != null && data.filters.hasTds != "") {
      where.hasTds = data.filters.hasTds;
    }
    if (data.filters.hasContact != null && data.filters.hasContact != "") {
      where.hasContact = data.filters.hasContact;
    }
    if (
      data.filters.isPaymentHolded != null &&
      data.filters.isPaymentHolded != ""
    ) {
      where.isPaymentHolded = data.filters.isPaymentHolded;
    }
    if (data.filters.search) {
      var query = data.filters;
      var $or = [];
      $or.push(
        Sequelize.where(
          Sequelize.fn("lower", Sequelize.literal("service_providers.name")),
          {
            $like: "%" + query.search.toLowerCase() + "%",
          }
        )
      );
      where["$and"] = { $or: $or };
    }
    if (data.filters.serviceId != null && data.filters.serviceId != "") {
      where.serviceId = data.filters.serviceId;
    }
    if (data.filters.opexTypeId != null && data.filters.opexTypeId != "") {
      where.opexTypeId = data.filters.opexTypeId;
    }
    var attributes = null;
    if (data.filters.typeSearch) {
      attributes = ["id", "name", "paymentMode", "hasContact"];
    }
    log.write("APIService ::: listServiceProviders :: where : ", where);
    var orderBy = [["id", "desc"]];
    if (data.sortBy == "opexItem") {
      orderBy = [
        [Sequelize.literal("`opexType->type->category`.name"), data.sortOrder],
        [Sequelize.literal("`opexType->category`.name"), data.sortOrder],
      ];
    } else if (data.sortBy) {
      if (data.sortBy.split(".").length) {
        orderBy = [[Sequelize.literal(data.sortBy), data.sortOrder]];
      } else {
        orderBy = [[data.sortBy, data.sortOrder]];
      }
    }

    var results = await Provider.findAll({
      where: where,
      attributes: attributes,
      include: [
        {
          as: "opexType",
          model: OpexType,
          required: false,
          include: [
            {
              as: "type",
              model: OpexType,
              required: false,
              include: ["category"],
            },
            { as: "category", model: OpexCategory, required: false },
          ],
        },
        {
          as: "providerContact",
          model: ProviderContact,
          required: false,
          where: { active: 1 },
        },
        {
          as: "bankAccount",
          model: ProviderBankAccount,
          required: false,
          where: { active: 1 },
        },
        {
          as: "portal",
          model: ProviderPortal,
          required: false,
          where: { active: 1 },
        },
      ],
      offset: data.offset || 0,
      limit: data.limit || 100,
      order: orderBy,
    });
    log.write(
      "APIService ::: listServiceProviders :: results count : " + results.length
    );

    var providers = [];
    _.each(results, function (r) {
      var provider = r.toJSON();
      if (r.opexType && r.opexType.type) {
        provider.opexCategoryId = r.opexType.type.category.id;
        provider.opexTypeId = r.opexType.type.id;
        provider.opexItemId = r.opexType.id;
        provider.opexItem =
          r.opexType.type.category.name +
          ", " +
          r.opexType.type.name +
          ", " +
          r.opexType.name;
      } else if (r.opexType) {
        provider.opexCategoryId = r.opexType.category
          ? r.opexType.category.id
          : null;
        provider.opexTypeId = r.opexType.id;
        provider.opexItemId = null;
        provider.opexItem = r.opexType.category.name + ", " + r.opexType.name;
      }
      providers.push(provider);
    });
    if (data.sortBy == "opexItem") {
      providers = _.orderBy(providers, ["opexItem"], [data.sortOrder]);
    }
    return providers;
  } catch (e) {
    log.write("APIService ::: listServiceProviders :: exception : ", e);
    throw e;
  }
};
service.saveServiceProvider = async (data, username) => {
  try {
    log.write("APIService ::: saveServiceProvider :: data : ", data);
    var serviceProvider = {};
    data.updated = new Date();
    data.updatedBy = username || "system";
    if (data.id) {
      await Provider.update(data, { where: { id: data.id } });
      serviceProvider = data;
    } else {
      data.date = new Date();
      serviceProvider = await Provider.create(data);
      serviceProvider = serviceProvider.toJSON();

      // if (data.contactName && data.contactEmail && data.contactPhone) {
      //   var contact = await ProviderContact.create({
      //     serviceProviderId: serviceProvider.id,
      //     name: data.contactName,
      //     email: data.contactEmail,
      //     phone: data.contactPhone,
      //     active: 1
      //   })
      // }
    }

    if (
      data.newContact ||
      (!data.id && data.contactName && data.contactEmail && data.contactPhone)
    ) {
      var providerContact = await ProviderContact.create({
        serviceProviderId: serviceProvider.id,
        name: data.contactName,
        email: data.contactEmail,
        phone: data.contactPhone,
        active: 1,
      });
      serviceProvider.providerContact = providerContact.toJSON();
      data.providerContact = providerContact.toJSON();
    } else if (
      data.deleteContact &&
      data.providerContact &&
      data.providerContact.id
    ) {
      await ProviderContact.update(
        { active: 0 },
        { where: { id: data.providerContact.id } }
      );
    }

    if (
      data.paymentMode == "Online" &&
      (data.newPortal || (!data.id && data.webUrl))
    ) {
      var portal = await ProviderPortal.create({
        serviceProviderId: serviceProvider.id,
        webUrl: data.webUrl,
        accountId: data.accountId,
        username: data.username,
        password: data.password,
        info: data.additionalPaymentInfo,
        active: 1,
      });
      serviceProvider.portal = portal.toJSON();
    } else if (data.deletePortal && data.portal && data.portal.id) {
      await ProviderPortal.update(
        { active: 0 },
        { where: { id: data.portal.id } }
      );
    }

    if (
      data.paymentMode == "BankTransfer" &&
      (data.newBankAccount ||
        (!data.id &&
          data.bankAccountNumber &&
          data.bankIfscCode &&
          data.accountHolderName))
    ) {
      var bankAccount = await ProviderBankAccount.create({
        serviceProviderId: serviceProvider.id,
        accountNumber: data.bankAccountNumber,
        ifscCode: data.bankIfscCode,
        accountHolderName: data.accountHolderName,
        active: 1,
      });
      serviceProvider.bankAccount = bankAccount.toJSON();
      var client = {
        id: bankAccount.id,
        accountNumber: data.bankAccountNumber,
        ifscCode: data.bankIfscCode,
        name: data.accountHolderName,
        email: data.providerContact ? data.providerContact.email : "",
        phone: data.providerContact ? data.providerContact.phone : "",
      };
      var benificiary = await services.addCashFreeBenificiaryForRefund(
        client,
        data.companyId
      );
      bankAccount.set("payoutBenificiaryId", benificiary.id);
      bankAccount.save();
    } else if (
      data.deleteBankAccount &&
      data.bankAccount &&
      data.bankAccount.id
    ) {
      await ProviderBankAccount.update(
        { active: 0 },
        { where: { id: data.bankAccount.id } }
      );
    }

    return serviceProvider;
  } catch (e) {
    log.write("APIService ::: saveServiceProvider :: exception : ", e);
    throw e;
  }
};

service.listNotifications = async (data) => {
  try {
    log.write("APIService ::: listNotifications :: data : ", data);
    var where = {},
      receiverWhere = {};
    if (data.filters.status != null && data.filters.status != "") {
      where.status = data.filters.status;
    }
    if (data.filters.search) {
      var query = data.filters;
      var $or = [];
      $or.push(
        Sequelize.where(Sequelize.fn("lower", Sequelize.literal("name")), {
          $like: "%" + query.search.toLowerCase() + "%",
        })
      );
      $or.push(
        Sequelize.where(Sequelize.fn("lower", Sequelize.literal("email")), {
          $like: "%" + query.search.toLowerCase() + "%",
        })
      );
      receiverWhere["$and"] = { $or: $or };

      $or = [];
      $or.push(
        Sequelize.where(Sequelize.fn("lower", Sequelize.literal("subject")), {
          $like: "%" + query.search.toLowerCase() + "%",
        })
      );
      $or.push(
        Sequelize.where(Sequelize.fn("lower", Sequelize.literal("body")), {
          $like: "%" + query.search.toLowerCase() + "%",
        })
      );
      where["$and"] = { $or: $or };
    }
    log.write("APIService ::: listNotifications :: data where : ", where);
    var notifications = await Notification.findAll({
      where: where,
      include: [
        {
          as: "notificationReceivers",
          where: receiverWhere,
          required: false,
          model: NotificationReceiver,
          attributes: ["email", "name", "sentOn"],
        },
      ],
      offset: data.offset,
      limit: data.limit,
      order: [["id", "desc"]],
    });
    log.write(
      "APIService ::: listNotifications :: notifications count : " +
        notifications.length
    );
    return notifications;
  } catch (e) {
    log.write("APIService ::: listNotifications :: exception : ", e);
    throw e;
  }
};
service.saveNotification = async (data, username) => {
  try {
    log.write("APIService ::: saveNotification :: data : ", data);
    var result = {};
    data.by = username || "system";
    if (data.id) {
      await Notification.update(data, { where: { id: data.id } });
      result = data;
    } else {
      data.date = new Date();
      result = await Notification.create(data);
    }
    return result;
  } catch (e) {
    log.write("APIService ::: saveNotification :: exception : ", e);
    throw e;
  }
};
service.publishNotification = async (data, username) => {
  try {
    log.write("APIService ::: publishNotification :: data : ", data);
    var result = {};
    var notification = await service.saveNotification(data, username);

    var statuses = "Active",
      buildingSql = "",
      officeSql = "",
      locationSql = "",
      citySql = "";
    if (data.statuses && data.statuses.length) {
      statuses = data.statuses.join(",");
    }
    var entity = "";
    if (data.office) {
      officeSql = " and o.id=" + data.office.id;
      entity = " office " + data.office.name;
    } else if (data.building) {
      buildingSql = " and g.id=" + data.building.id;
      entity = " building " + data.building.name;
    } else if (data.buildingIds) {
      buildingSql =
        " and g.id in (" + _.map(data.buildingIds, "id").join(",") + ")";
      entity = " buildings " + _.map(data.buildingIds, "name").join(",");
    } else if (data.location) {
      locationSql = " and l.id=" + data.location.id;
      entity = " location " + data.location.name;
    } else if (data.city) {
      citySql = " and ct.id=" + data.city.id;
      entity = " city " + data.city.name;
    }

    var sql =
      `select b.id bookingId, c.name, c.email from clients c, bookings b, offices o, buildings g, locations l, cities ct ` +
      ` where c.id=b.clientId and b.officeId=o.id and g.id=o.buildingId and g.locationId=l.id and ct.id=l.cityId
               and b.status in (` +
      statuses +
      `) ` +
      buildingSql +
      " " +
      officeSql +
      " " +
      locationSql +
      " " +
      citySql +
      " group by c.name";
    if (data.clientIds && data.clientIds.length) {
      sql =
        "select  b.id bookingId, name, email from clients c, bookings b where b.clientId=c.id and c.id in (" +
        data.clientIds.join(",") +
        ") group by c.name";
    }
    log.write("APIService ::: publishNotification :: clients sql : ", sql);

    var clients = await session.db.query(sql, {
      type: Sequelize.QueryTypes.SELECT,
    });
    // clients = _.uniqBy(clients, 'name');
    log.write(
      "APIService ::: publishNotification :: clients length : ",
      clients.length
    );

    var receivers =
      clients.length +
      " clients are notified in " +
      entity +
      " for " +
      statuses +
      " bookings.";
    if (data.clientIds && data.clientIds.length) {
      receivers = clients.length + " clients are notified ";
    }
    if (data.clients && data.clients.length) {
      receivers = data.clients.length + " clients are notified ";
      clients = data.clients;
    }
    if (data.users && data.users.length) {
      receivers = data.users.length + " internal team are notified ";
    }
    var data = { id: notification.id, receivers: receivers, by: username };
    service.saveNotification(data, username);
    for (var i = 0; i < clients.length; i++) {
      var client = clients[i];
      await services.sendMail(notification.subject, notification.body, [
        {
          name: client.name,
          email: client.email,
          bookingId: client.bookingId,
        },
      ]);
      await NotificationReceiver.create({
        notificationId: notification.id,
        name: client.name,
        email: client.email,
        sentOn: new Date(),
        type: "To",
      });
      await utils.sleep(1000);
    }
    return clients.length;
  } catch (e) {
    log.write("APIService ::: publishNotification :: exception : ", e);
    throw e;
  }
};
service.getNotification = async (id) => {
  try {
    log.write("APIService ::: getNotification :: id : ", id);
    var result = await Notification.findOne({
      where: { id: id },
      include: [
        {
          as: "notificationReceivers",
          model: NotificationReceiver,
          attributes: ["name", "email"],
        },
      ],
    });
    return result;
  } catch (e) {
    log.write("APIService ::: getNotification :: exception : ", e);
    throw e;
  }
};

service.listClients = async (data) => {
  try {
    log.write("APIService ::: listClients :: data : ", data);
    var where = {};
    var attributes = ["id", "name", "email"];
    if (data.filters.search) {
      var query = data.filters;
      var $or = [];
      $or.push(
        Sequelize.where(Sequelize.fn("lower", Sequelize.literal("name")), {
          $like: "%" + query.search.toLowerCase() + "%",
        })
      );
      $or.push(
        Sequelize.where(Sequelize.fn("lower", Sequelize.literal("email")), {
          $like: "%" + query.search.toLowerCase() + "%",
        })
      );
      // $or.push(Sequelize.where(Sequelize.fn('lower', Sequelize.literal('phone')), {
      //   $like: "%" + query.search.toLowerCase() + "%"
      // }))
      where["$and"] = { $or: $or };
    }
    log.write("APIService ::: listClients :: where : ", where);

    var clients = [];
    var results = await Client.findAll({
      where: where,
      attributes: attributes,
      offset: 0,
      limit: 8,
    });
    results = clients;

    if (data.filters.search) {
      var query = data.filters;
      var $or = [];
      $or.push(
        Sequelize.where(Sequelize.fn("lower", Sequelize.literal("name")), {
          $like: "%" + query.search.toLowerCase() + "%",
        })
      );
      $or.push(
        Sequelize.where(Sequelize.fn("lower", Sequelize.literal("email")), {
          $like: "%" + query.search.toLowerCase() + "%",
        })
      );
      where["$and"] = { $or: $or };
    }
    log.write("APIService ::: listClients :: where : ", where);
    results = await ClientEmployee.findAll({
      where: where,
      attributes: attributes,
      offset: 0,
      limit: 8,
    });
    clients = clients.concat(results);
    // _.each(results, function(r) {
    //   clients.push({ id: r.id, bookingId: r.bookingId, name: r.name, email: r.email });

    //   _.each(r.employees, function(e) {
    //     clients.push({ id: r.id, bookingId: r.bookingId, name: e.name, email: e.email });
    //   })
    // })
    log.write(
      "APIService ::: listClients :: clients count : " + clients.length
    );
    return clients;
  } catch (e) {
    log.write("APIService ::: listClients :: exception : ", e);
    throw e;
  }
};

service.getUserMessages = async (data) => {
  try {
    var messages = await UserMessage.findAll({
      where: { toUser: data.filters.userId, read: data.filters.read },
      offset: data.offset,
      limit: data.limit,
      order: [["id", "desc"]],
    });
    return messages;
  } catch (e) {
    log.write("AdminService ::: getUserMessages :: exception : ", e);
    throw e;
  }
};

// ####################### Start of common methods  ################################

service.updateOfficeLocationsCount = async () => {
  var locations = await Location.findAll();
  _.each(locations, function (l) {
    service.updateOfficeLocationCount(l.id);
  });
};
service.updateCountryCitiesCount = async (id) => {
  session.db.query(
    "update countries set citiec=(select count(*) from cities where countryId=" +
      id +
      ") where active=1 and id=" +
      id
  );
};
service.updateCityLocationsCount = async (id) => {
  session.db.query(
    "update cities set locationc=(select count(*) from locations where cityId=" +
      id +
      ") where active=1 and id=" +
      id
  );
};
service.updateLocationOfficesCount = async (id) => {
  session.db.query(
    "update locations set offices=(select count(*) from offices where locationId=" +
      id +
      ") where active=1 and id=" +
      id
  );
};
service.updateLocationOfficeCount = async (id) => {
  session.db.query(
    "update locations set offices=(select count(*) from offices where locationId=" +
      id +
      ") where active=1 and id=" +
      id
  );
};
service.updateOfficeCounts = async (id) => {
  session.db.query(
    "update offices set floorc=(select count(*) from floors where officeId=" +
      id +
      ") where active=1 and id=" +
      id
  );
  session.db.query(
    "update offices set cabinc=(select count(*) from cabins where officeId=" +
      id +
      ") where active=1 and id=" +
      id
  );
  session.db.query(
    "update offices set desks=(select count(d.*) from desks d, cabins c where c.id=d.cabinId and c.officeId=" +
      id +
      ") where active=1 and id=" +
      id
  );
};
service.updateCabinDesksCount = async (id) => {
  session.db.query(
    "update cabins set deskc=(select count(*) from desks where cabinId=" +
      id +
      ") where active=1 and id=" +
      id
  );
};

exports.service = service;
