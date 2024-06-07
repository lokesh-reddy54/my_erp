'use strict';

var Q = require('q');
var _ = require('lodash');
const uuid = require('uuid/v4');
var moment = require('moment');
var Op = require("sequelize").Op;
var Sequelize = require("sequelize");
var _utils = require('../../utils/utils').utils;
var log = require('../../utils/log').log;
var config = require('../../utils/config').config;

var Office = require("../models/base").Office;
var Building = require("../models/base").Building;
var Location = require("../models/base").Location;
var City = require("../models/base").City;
var Country = require("../models/base").Country;
var Doc = require("../models/base").Doc;
var Company = require("../models/base").Company;
var User = require("../models/base").User;
var SelfcareLink = require("../models/base").SelfcareLink;
var RefSequence = require("../models/base").RefSequence;
var Activity = require("../models/base").Activity;

var session = require("../session");

var utils = {
  constants: {
    leadExpiry: 3
  }
};

utils.getLocation = async (id) => {
  var location = await Location.findOne({
    where: { id: id },
    include: [{ as: 'city', model: City, include: ['country'] }]
  })
  if (location) {
    return location.name + ", " + location.city.name + ", " + location.city.country.name;
  } else {
    return '';
  }
}
utils.getOfficeLocation = async (id) => {
  var office = await Office.findOne({
    where: { id: id },
    attributes: ['name'],
    include: [{ as: 'building', model: Building, attributes: ['name', 'address'] }]
  })
  if (office) {
    log.write("System Utils:: getOfficeLocation :: Location :: ", office.toJSON());
    return office.name + ", " + office.building.name + ", " + office.building.address;
  } else {
    return '';
  }
}
utils.getFile = async (id) => {
  var file = await Doc.findOne({
    where: { id: id }
  })
  if (file) {
    return file;
  } else {
    return {};
  }
}
utils.getCompany = async (id) => {
  var company = await Company.findOne({
    where: { id: id }
  })
  if (company) {
    return company;
  } else {
    return {};
  }
}
utils.getUser = async (username) => {
  var user = await User.findOne({
    where: { username: username }
  })
  if (user) {
    return user;
  } else {
    return {};
  }
}
utils.getUserById = async (userId) => {
  var user = await User.findOne({
    where: { id: userId }
  })
  if (user) {
    return user;
  } else {
    return {};
  }
}
utils.createSelfCareLink = async (context, link, data, companyId) => {
  var linkId = uuid();
  var urlLink = config.selfcareUrl + "#/selfcare/" + link + "/" + linkId;

  return await SelfcareLink.create({
    linkId: linkId,
    url: urlLink,
    context: context,
    data: JSON.stringify(data),
    created: new Date(),
    companyId: companyId
  })
}
utils.getRefNo = async (context, id, date, company, contract) => {
  var lastRefNo;
  var seqNo;
  var refNo = "";
  var prefix = "";
  var companyId = 1;

  if(typeof contract === 'object'){

    if(contract.deskType == 'EnterpriseOffice'){
      prefix = 'HH';
      companyId = company.id;
    }
    else if(contract.deskType == 'PrivateOffice'){
      prefix = 'SB';
      companyId = company.id;
    }
  }
  else if (typeof company === 'object') {
    prefix = company.shortName;
    companyId = company.id;
  } else if (isNaN(company)) {
    company = await Company.findOne({ id: company });
    companyId = company.id;
    prefix = company.shortName;
  } else {
    companyId = company;
  }

  if (context == "BillIndexNo") {
    lastRefNo = await RefSequence.findOne({
      where: { context: context, year: _utils.moment(date).year(), month: _utils.moment(date).month() + 1, companyId: companyId }
    })
    if (!lastRefNo) {
      seqNo = 1;
      lastRefNo = await RefSequence.create({
        context: context,
        sequence: seqNo,
        year: _utils.moment(date).year(),
        month: _utils.moment(date).month() + 1,
        companyId: companyId
      })
    } else {
      seqNo = lastRefNo.sequence + 1;
      lastRefNo.increment(['sequence'], { by: 1 });
    }

    refNo = _utils.moment(date).year() + "/" + _utils.moment(date).format("MM") + "/" + seqNo;

  } 
  else if (context == "MonthlyInvoice") {
    lastRefNo = await RefSequence.findOne({
      where: { context: context, year: _utils.moment(date).year(), month: _utils.moment(date).month() + 1, companyId: companyId }
    })
    if (!lastRefNo) {
      lastRefNo = await RefSequence.findOne({
        where: { context: context, year: _utils.moment(date).year(), month: _utils.moment(date).month(), companyId: companyId }
      })

      // seqNo = lastRefNo.sequence + 5 + 1;
      seqNo = 1;
      lastRefNo = await RefSequence.create({
        context: context,
        sequence: seqNo,
        year: _utils.moment(date).year(),
        month: _utils.moment(date).month() + 1,
        companyId: companyId
      })
    } else {
      seqNo = lastRefNo.sequence + 1;
      lastRefNo.increment(['sequence'], { by: 1 });
    }
    // refNo = prefix + "IN" + id + "-" + (seqNo + "").padStart(4, '0');
    refNo = prefix + "IN-" + _utils.moment(date).format("YY") + "/" + _utils.moment(date).format("MMM") + "/" + (seqNo + "").padStart(3, '0');

  } 
  else if (context == "Liability") {
    lastRefNo = await RefSequence.findOne({
      where: { context: context, year: _utils.moment(date).year(), companyId: companyId }
    })
    if (!lastRefNo) {
      seqNo = 1;
      lastRefNo = await RefSequence.create({
        year: _utils.moment(date).year(),
        month: _utils.moment(date).month(),
        context: context,
        sequence: seqNo,
        companyId: companyId
      })
    } else {
      seqNo = lastRefNo.sequence + 1;
      lastRefNo.increment(['sequence'], { by: 1 });
    }
    refNo = prefix + "SD" + id + "-" + (seqNo + "").padStart(4, '0');

  }   
  else if (context == "Parking") {
    lastRefNo = await RefSequence.findOne({
      where: { context: context, year: _utils.moment(date).year(), month: _utils.moment(date).month() + 1, companyId: companyId }
    })
    if (!lastRefNo) {
      lastRefNo = await RefSequence.findOne({
        where: { context: context, year: _utils.moment(date).year(), month: _utils.moment(date).month(), companyId: companyId }
      })

      // seqNo = lastRefNo.sequence + 5 + 1;
      seqNo = 1;
      lastRefNo = await RefSequence.create({
        context: context,
        sequence: seqNo,
        year: _utils.moment(date).year(),
        month: _utils.moment(date).month() + 1,
        companyId: companyId
      })
    } else {
      seqNo = lastRefNo.sequence + 1;
      lastRefNo.increment(['sequence'], { by: 1 });
    }
    // refNo = prefix + "IN" + id + "-" + (seqNo + "").padStart(4, '0');
    refNo = "PRKIN-" + _utils.moment(date).format("YY") + "/" + _utils.moment(date).format("MMM") + "/" + (seqNo + "").padStart(3, '0');

  } 
  else if (context == "AncillaryRevenue") {
    lastRefNo = await RefSequence.findOne({
      where: { context: context, year: _utils.moment(date).year(), month: _utils.moment(date).month() + 1, companyId: companyId }
    })
    if (!lastRefNo) {
      lastRefNo = await RefSequence.findOne({
        where: { context: context, year: _utils.moment(date).year(), month: _utils.moment(date).month(), companyId: companyId }
      })

      // seqNo = lastRefNo.sequence + 5 + 1;
      seqNo = 1;
      lastRefNo = await RefSequence.create({
        context: context,
        sequence: seqNo,
        year: _utils.moment(date).year(),
        month: _utils.moment(date).month() + 1,
        companyId: companyId
      })
    } else {
      seqNo = lastRefNo.sequence + 1;
      lastRefNo.increment(['sequence'], { by: 1 });
    }
    // refNo = prefix + "IN" + id + "-" + (seqNo + "").padStart(4, '0');
    refNo = 'HH' + "AR-" + _utils.moment(date).format("YY") + "/" + _utils.moment(date).format("MMM") + "/" + (seqNo + "").padStart(3, '0');

  }
  else if (context == "FoodAndBeverages") {
    lastRefNo = await RefSequence.findOne({
      where: { context: context, year: _utils.moment(date).year(), month: _utils.moment(date).month() + 1, companyId: companyId }
    })
    if (!lastRefNo) {
      lastRefNo = await RefSequence.findOne({
        where: { context: context, year: _utils.moment(date).year(), month: _utils.moment(date).month(), companyId: companyId }
      })

      // seqNo = lastRefNo.sequence + 5 + 1;
      seqNo = 1;
      lastRefNo = await RefSequence.create({
        context: context,
        sequence: seqNo,
        year: _utils.moment(date).year(),
        month: _utils.moment(date).month() + 1,
        companyId: companyId
      })
    } else {
      seqNo = lastRefNo.sequence + 1;
      lastRefNo.increment(['sequence'], { by: 1 });
    }
    // refNo = prefix + "IN" + id + "-" + (seqNo + "").padStart(4, '0');
    refNo = 'HH' + "FB-" + _utils.moment(date).format("YY") + "/" + _utils.moment(date).format("MMM") + "/" + (seqNo + "").padStart(3, '0');

  }
  else {
    lastRefNo = await RefSequence.findOne({
      where: { context: context, companyId: companyId }
    })
    if (!lastRefNo) {
      lastRefNo = await RefSequence.create({
        context: context,
        sequence: 1,
        companyId: companyId
      })
    }
    seqNo = lastRefNo.sequence + 1;
    lastRefNo.increment(['sequence'], { by: 1 });

    if (context == 'VisitSchedule') {
      refNo = prefix + "-VT-" + seqNo;
    } else if (context == 'SupportTicket') {
      refNo = prefix + "-ST-" + seqNo;
    } else if (context == 'WorkOrder') {
      refNo = prefix + "-WO-" + seqNo;
    } else if (context == 'PurchaseOrder') {
      refNo = prefix + "-PO-" + seqNo;
    } else if (context == 'Bill') {
      refNo = prefix + "-BI-" + seqNo;
    } else {
      refNo = seqNo;
    }
  }

  return refNo;
}
utils.addActivity = async (data, username) => {
  try {
    data.updatedBy = username;
    data.updated = new Date();
    await Activity.create(data)
  } catch (e) {
    log.write("SystemUtils ::: addActivity :: exception : ", e)
  }
}

exports.utils = utils;