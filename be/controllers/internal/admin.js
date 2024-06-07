"use strict";

var Q = require("q");
var util = require("util");
var request = require("request-promise");
var jwt = require("jsonwebtoken");
var requestIp = require("request-ip");

var config = require("../../utils/config").config;
var log = require("../../utils/log").log;
var utils = require("../../utils/utils").utils;
var adminService = require("../../services/admin").service;
var services = require("../../services/services").service;
var bookingsService = require("../../services/bookings").service;

var controller = {};

controller.migrateProviders = async (req, res) => {
  try {
    // log.write("ControllerService ::: migrateProviders :: data ", req.body);
    var items = await services.migrateProviders();
    res.json({ data: items });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
};
controller.listCompanies = async (req, res) => {
  try {
    // log.write("ControllerService ::: listCompanies :: data ", req.body);
    var items = await adminService.listCompanies(utils.body(req));
    res.json({ data: items });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
};
controller.saveCompany = async (req, res) => {
  try {
    // log.write("ControllerService ::: saveCompany :: data ", req.body);
    var user = await adminService.saveCompany(req.body);
    res.json({ data: user });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
};
controller.saveCompanyContact = async (req, res) => {
  try {
    // log.write("ControllerService ::: saveCompanyContact :: data ", req.body);
    var user = await adminService.saveCompanyContact(req.body);
    res.json({ data: user });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
};
controller.listPettyCashAccounts = async (req, res) => {
  try {
    // log.write("ControllerService ::: listPettyCashAccounts :: data ", req.body);
    var items = await adminService.listPettyCashAccounts(utils.body(req));
    res.json({ data: items });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
};
controller.savePettyCashAccount = async (req, res) => {
  try {
    // log.write("ControllerService ::: savePettyCashAccount :: data ", req.body);
    var user = await adminService.savePettyCashAccount(
      utils.body(req),
      utils.getUserName(req)
    );
    res.json({ data: user });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
};
controller.savePettyCashAccountUser = async (req, res) => {
  try {
    // log.write("ControllerService ::: savePettyCashAccountUser :: data ", req.body);
    var user = await adminService.savePettyCashAccountUser(
      utils.body(req),
      utils.getUserName(req)
    );
    res.json({ data: user });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
};
controller.listDebitCardAccounts = async (req, res) => {
  try {
    // log.write("ControllerService ::: listDebitCardAccounts :: data ", req.body);
    var items = await adminService.listDebitCardAccounts(utils.body(req));
    res.json({ data: items });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
};
controller.saveDebitCardAccount = async (req, res) => {
  try {
    // log.write("ControllerService ::: saveDebitCardAccount :: data ", req.body);
    var user = await adminService.saveDebitCardAccount(
      utils.body(req),
      utils.getUserName(req)
    );
    res.json({ data: user });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
};
controller.saveDebitCardAccountUser = async (req, res) => {
  try {
    // log.write("ControllerService ::: saveDebitCardAccountUser :: data ", req.body);
    var user = await adminService.saveDebitCardAccountUser(
      utils.body(req),
      utils.getUserName(req)
    );
    res.json({ data: user });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
};
controller.listRoles = async (req, res) => {
  try {
    // log.write("ControllerService ::: listRoles :: data ", req.body);
    var items = await adminService.listRoles(utils.body(req));
    res.json({ data: items });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
};
controller.saveRole = async (req, res) => {
  try {
    // log.write("ControllerService ::: saveRole :: data ", req.body);
    var user = await adminService.saveRole(
      utils.body(req),
      utils.getUserName(req)
    );
    res.json({ data: user });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
};
controller.listHelpNotes = async (req, res) => {
  try {
    // log.write("ControllerService ::: listHelpNotes :: data ", req.body);
    var items = await adminService.listHelpNotes(utils.body(req));
    res.json({ data: items });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
};
controller.saveHelpNote = async (req, res) => {
  try {
    // log.write("ControllerService ::: saveHelpNote :: data ", req.body);
    var item = await adminService.saveHelpNote(
      utils.body(req),
      utils.getUserName(req)
    );
    res.json({ data: item });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
};
controller.deleteHelpNote = async (req, res) => {
  try {
    // log.write("ControllerService ::: deleteHelpNote :: data ", req.body);
    var user = await adminService.deleteHelpNote(req.params.id);
    res.json({ data: user });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
};
controller.listBusinessTerms = async (req, res) => {
  try {
    // log.write("ControllerService ::: listBusinessTerms :: data ", req.body);
    var items = await adminService.listBusinessTerms(utils.body(req));
    res.json({ data: items });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
};
controller.saveBusinessTerm = async (req, res) => {
  try {
    // log.write("ControllerService ::: saveBusinessTerm :: data ", req.body);
    var item = await adminService.saveBusinessTerm(
      utils.body(req),
      utils.getUserName(req)
    );
    res.json({ data: item });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
};
controller.deleteBusinessTerm = async (req, res) => {
  try {
    // log.write("ControllerService ::: deleteBusinessTerm :: data ", req.body);
    var user = await adminService.deleteBusinessTerm(req.params.id);
    res.json({ data: user });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
};
controller.listUsers = async (req, res) => {
  try {
    // log.write("ControllerService ::: listUsers :: data ", req.body);
    var items = await adminService.listUsers(utils.body(req));
    res.json({ data: items });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
};
controller.saveUser = async (req, res) => {
  try {
    // log.write("ControllerService ::: saveUser :: data ", req.body);
    var user = await adminService.saveUser(
      utils.body(req),
      utils.getUserName(req)
    );

    res.json({ data: user });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
};
controller.deleteUser = async (req, res) => {
  try {
    // log.write("ControllerService ::: deleteUser :: data ", req.body);
    var user = await adminService.deleteUser(req.params.id);
    res.json({ data: user });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
};

controller.listCountries = async (req, res) => {
  try {
    // log.write("ControllerService ::: listCountries :: data ", req.body);
    var items = await adminService.listCountries(utils.body(req));
    res.json({ data: items });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
};
controller.saveCountry = async (req, res) => {
  try {
    // log.write("ControllerService ::: saveCountry :: data ", req.body);
    var user = await adminService.saveCountry(utils.body(req));
    res.json({ data: user });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
};
controller.deleteCountry = async (req, res) => {
  try {
    // log.write("ControllerService ::: deleteCountry :: data ", req.body);
    var user = await adminService.deleteCountry(req.params.id);
    res.json({ data: user });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
};

controller.getCitiesWithBuildings = async (req, res) => {
  try {
    // log.write("ControllerService ::: getCitiesWithBuildings :: data ", req.body);
    var items = await adminService.getCitiesWithBuildings(utils.body(req));
    res.json({ data: items });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
};
controller.listCities = async (req, res) => {
  try {
    // log.write("ControllerService ::: listCities :: data ", req.body);
    var items = await adminService.listCities(utils.body(req));
    res.json({ data: items });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
};
controller.saveCity = async (req, res) => {
  try {
    // log.write("ControllerService ::: saveCity :: data ", req.body);
    var user = await adminService.saveCity(utils.body(req));
    res.json({ data: user });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
};
controller.deleteCity = async (req, res) => {
  try {
    // log.write("ControllerService ::: deleteCity :: data ", req.body);
    var user = await adminService.deleteCity(req.params.id);
    res.json({ data: user });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
};

controller.listLocations = async (req, res) => {
  try {
    // log.write("ControllerService ::: listLocations :: data ", req.body);
    var items = await adminService.listLocations(utils.body(req));
    res.json({ data: items });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
};
controller.saveLocation = async (req, res) => {
  try {
    // log.write("ControllerService ::: saveLocation :: data ", req.body);
    var user = await adminService.saveLocation(utils.body(req));
    res.json({ data: user });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
};
controller.deleteLocation = async (req, res) => {
  try {
    // log.write("ControllerService ::: deleteLocation :: data ", req.body);
    var user = await adminService.deleteLocation(req.params.id);
    res.json({ data: user });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
};

controller.listFacilities = async (req, res) => {
  try {
    // log.write("ControllerService ::: listFacilities :: data ", req.body);
    var items = await adminService.listFacilities(utils.body(req));
    res.json({ data: items });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
};
controller.saveFacility = async (req, res) => {
  try {
    // log.write("ControllerService ::: saveFacility :: data ", req.body);
    var user = await adminService.saveFacility(utils.body(req));
    res.json({ data: user });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
};
controller.deleteFacility = async (req, res) => {
  try {
    // log.write("ControllerService ::: deleteFacility :: data ", req.body);
    var user = await adminService.deleteFacility(req.params.id);
    res.json({ data: user });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
};

controller.listFacilitySets = async (req, res) => {
  try {
    // log.write("ControllerService ::: listFacilitySets :: data ", req.body);
    var items = await adminService.listFacilitySets(utils.body(req));
    res.json({ data: items });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
};
controller.saveFacilitySet = async (req, res) => {
  try {
    // log.write("ControllerService ::: saveFacilitySet :: data ", req.body);
    var user = await adminService.saveFacilitySet(utils.body(req));
    res.json({ data: user });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
};
controller.deleteFacilitySet = async (req, res) => {
  try {
    // log.write("ControllerService ::: deleteFacilitySet :: data ", req.body);
    var user = await adminService.deleteFacilitySet(req.params.id);
    res.json({ data: user });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
};

controller.updateFacilitySetFacilities = async (req, res) => {
  try {
    // log.write("ControllerService ::: updateFacilitySetFacilities :: data ", req.body);
    var user = await adminService.updateFacilitySetFacilities(utils.body(req));
    res.json({ data: user });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
};

controller.listOffices = async (req, res) => {
  try {
    // log.write("ControllerService ::: listOffices :: data ", req.body);
    var items = await adminService.listOffices(utils.body(req));
    res.json({ data: items });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
};
controller.saveOffice = async (req, res) => {
  try {
    // log.write("ControllerService ::: saveOffice :: data ", req.body);
    var user = await adminService.saveOffice(utils.body(req));
    res.json({ data: user });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
};
controller.deleteOffice = async (req, res) => {
  try {
    // log.write("ControllerService ::: deleteOffice :: data ", req.body);
    var user = await adminService.deleteOffice(req.params.id);
    res.json({ data: user });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
};
controller.listOfficePricings = async (req, res) => {
  try {
    // log.write("ControllerService ::: listOfficePricings :: data ", req.body);
    var items = await adminService.listOfficePricings(utils.body(req));
    res.json({ data: items });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
};
controller.saveOfficePricing = async (req, res) => {
  try {
    // log.write("ControllerService ::: saveOfficePricing :: data ", req.body);
    var user = await adminService.saveOfficePricing(utils.body(req));
    res.json({ data: user });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
};
controller.deleteOfficePricing = async (req, res) => {
  try {
    // log.write("ControllerService ::: deleteOfficePricing :: data ", req.body);
    var user = await adminService.deleteOfficePricing(req.params.id);
    res.json({ data: user });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
};

controller.listFloors = async (req, res) => {
  try {
    // log.write("ControllerService ::: listFloors :: data ", req.body);
    var items = await adminService.listFloors(utils.body(req));
    res.json({ data: items });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
};
controller.saveFloor = async (req, res) => {
  try {
    // log.write("ControllerService ::: saveFloor :: data ", req.body);
    var user = await adminService.saveFloor(utils.body(req));
    res.json({ data: user });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
};
controller.deleteFloor = async (req, res) => {
  try {
    // log.write("ControllerService ::: deleteFloor :: data ", req.body);
    var user = await adminService.deleteFloor(req.params.id);
    res.json({ data: user });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
};

controller.listBuildings = async (req, res) => {
  try {
    // log.write("ControllerService ::: listBuildings :: data ", req.body);
    var items = await adminService.listBuildings(utils.body(req));
    res.json({ data: items });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
};
controller.saveBuilding = async (req, res) => {
  try {
    // log.write("ControllerService ::: saveBuilding :: data ", req.body);
    var user = await adminService.saveBuilding(utils.body(req));
    res.json({ data: user });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
};
controller.listBuildingContacts = async (req, res) => {
  try {
    // log.write("ControllerService ::: listBuildingContacts :: data ", req.body);
    var user = await adminService.listBuildingContacts(utils.body(req));
    res.json({ data: user });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
};
controller.saveBuildingContact = async (req, res) => {
  try {
    // log.write("ControllerService ::: saveBuildingContact :: data ", req.body);
    var user = await adminService.saveBuildingContact(
      utils.body(req),
      utils.getUserName(req)
    );
    res.json({ data: user });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
};
controller.listBuildingAmcs = async (req, res) => {
  try {
    // log.write("ControllerService ::: listBuildingAmcs :: data ", req.body);
    var user = await adminService.listBuildingAmcs(utils.body(req));
    res.json({ data: user });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
};
controller.saveBuildingAmc = async (req, res) => {
  try {
    // log.write("ControllerService ::: saveBuildingAmc :: data ", req.body);
    var user = await adminService.saveBuildingAmc(
      utils.body(req),
      utils.getUserName(req)
    );
    res.json({ data: user });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
};
controller.listBuildingAmcItems = async (req, res) => {
  try {
    // log.write("ControllerService ::: listBuildingAmcItems :: data ", req.body);
    var user = await adminService.listBuildingAmcItems(utils.body(req));
    res.json({ data: user });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
};
controller.saveBuildingAmcItem = async (req, res) => {
  try {
    // log.write("ControllerService ::: saveBuildingAmcItem :: data ", req.body);
    var user = await adminService.saveBuildingAmcItem(
      utils.body(req),
      utils.getUserName(req)
    );
    res.json({ data: user });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
};
controller.saveBuildingContractTerm = async (req, res) => {
  try {
    // log.write("ControllerService ::: saveBuildingContractTerm :: data ", req.body);
    var user = await adminService.saveBuildingContractTerm(
      utils.body(req),
      utils.getUserName(req)
    );
    res.json({ data: user });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
};
controller.getBuildingServices = async (req, res) => {
  try {
    // log.write("ControllerService ::: getBuildingServices :: data ", req.body);
    var user = await adminService.getBuildingServices(req.params.id);
    res.json({ data: user });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
};
controller.getBuildingContractTerms = async (req, res) => {
  try {
    // log.write("ControllerService ::: getBuildingContractTerms :: data ", req.body);
    var user = await adminService.getBuildingContractTerms(req.params.id);
    res.json({ data: user });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
};
controller.deleteBuilding = async (req, res) => {
  try {
    // log.write("ControllerService ::: deleteBuilding :: data ", req.body);
    var user = await adminService.deleteBuilding(req.params.id);
    res.json({ data: user });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
};
controller.saveBuildingService = async (req, res) => {
  try {
    // log.write("ControllerService ::: saveBuildingService :: data ", req.body);
    var user = await adminService.saveBuildingService(
      utils.body(req),
      utils.getUserName(req)
    );
    res.json({ data: user });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
};
controller.saveBuildingServiceAssignee = async (req, res) => {
  try {
    // log.write("ControllerService ::: saveBuildingServiceAssignee :: data ", req.body);
    var user = await adminService.saveBuildingServiceAssignee(
      utils.body(req),
      utils.getUserName(req)
    );
    res.json({ data: user });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
};

controller.listBuildingProperties = async (req, res) => {
  try {
    // log.write("ControllerService ::: listBuildingProperties :: data ", req.body);
    var items = await adminService.listBuildingProperties(utils.body(req));
    res.json({ data: items });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
};
controller.saveBuildingProperty = async (req, res) => {
  try {
    // log.write("ControllerService ::: saveBuildingProperty :: data ", req.body);
    var user = await adminService.saveBuildingProperty(utils.body(req));
    res.json({ data: user });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
};
controller.listPropertyContacts = async (req, res) => {
  try {
    // log.write("ControllerService ::: listPropertyContacts :: data ", req.body);
    var user = await adminService.listPropertyContacts(utils.body(req));
    res.json({ data: user });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
};
controller.savePropertyContact = async (req, res) => {
  try {
    // log.write("ControllerService ::: savePropertyContact :: data ", req.body);
    var user = await adminService.savePropertyContact(
      utils.body(req),
      utils.getUserName(req)
    );
    res.json({ data: user });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
};
controller.listPropertyImages = async (req, res) => {
  try {
    // log.write("ControllerService ::: listPropertyImages :: data ", req.body);
    var user = await adminService.listPropertyImages(utils.body(req));
    res.json({ data: user });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
};
controller.listPropertyContractNegotiations = async (req, res) => {
  try {
    // log.write("ControllerService ::: listPropertyContractNegotiations :: data ", req.body);
    var user = await adminService.listPropertyContractNegotiations(
      utils.body(req)
    );
    res.json({ data: user });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
};
controller.savePropertyContract = async (req, res) => {
  try {
    // log.write("ControllerService ::: savePropertyContract :: data ", req.body);
    var user = await adminService.savePropertyContract(
      utils.body(req),
      utils.getUserName(req)
    );
    res.json({ data: user });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
};
controller.savePropertyContractNegotiation = async (req, res) => {
  try {
    // log.write("ControllerService ::: savePropertyContractNegotiation :: data ", req.body);
    var user = await adminService.savePropertyContractNegotiation(
      utils.body(req),
      utils.getUserName(req)
    );
    res.json({ data: user });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
};
controller.getPropertyContract = async (req, res) => {
  try {
    // log.write("ControllerService ::: getPropertyContract :: data ", req.body);
    var user = await adminService.getPropertyContract(req.params.id);
    res.json({ data: user });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
};

controller.listCabins = async (req, res) => {
  try {
    // log.write("ControllerService ::: listCabins :: data ", req.body);
    var items = await adminService.listCabins(utils.body(req));
    res.json({ data: items });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
};
controller.saveCabin = async (req, res) => {
  try {
    // log.write("ControllerService ::: saveCabin :: data ", req.body);
    var user = await adminService.saveCabin(utils.body(req));
    res.json({ data: user });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
};
controller.deleteCabin = async (req, res) => {
  try {
    // log.write("ControllerService ::: deleteCabin :: data ", req.body);
    var user = await adminService.deleteCabin(req.params.id);
    res.json({ data: user });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
};
controller.listParkingLots = async (req, res) => {
  try {
    // log.write("ControllerService ::: listOffices :: data ", req.body);
    var items = await adminService.listParkingLots(utils.body(req));
    res.json({ data: items });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
};
controller.saveParkingLot = async (req, res) => {
  try {
    // log.write("ControllerService ::: saveCabin :: data ", req.body);
    var user = await adminService.saveParkingLots(utils.body(req));
    res.json({ data: user });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
};
controller.deleteParkingLots = async (req, res) => {
  try {
    // log.write("ControllerService ::: deleteCabin :: data ", req.body);
    var user = await adminService.deleteCabin(req.params.id);
    res.json({ data: user });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
};
controller.listParkingSpots = async (req, res) => {
  try {
    // log.write("ControllerService ::: listOffices :: data ", req.body);
    var items = await adminService.listParkingSpots(utils.body(req));
    res.json({ data: items });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
};
controller.saveParkingSpots = async (req, res) => {
  try {
    // log.write("ControllerService ::: saveCabin :: data ", req.body);
    var user = await adminService.saveParkingSpots(utils.body(req));
    res.json({ data: user });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
};
controller.listResources = async (req, res) => {
  try {
    // log.write("ControllerService ::: listResources :: data ", req.body);
    var items = await adminService.listResources(utils.body(req));
    res.json({ data: items });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
};
controller.listResourceImages = async (req, res) => {
  try {
    // log.write("ControllerService ::: listResourceImages :: data ", req.body);
    var items = await adminService.listResourceImages(utils.body(req));
    res.json({ data: items });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
};
controller.saveResource = async (req, res) => {
  try {
    // log.write("ControllerService ::: saveResource :: data ", req.body);
    var user = await adminService.saveResource(utils.body(req));
    res.json({ data: user });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
};
controller.deleteResource = async (req, res) => {
  try {
    // log.write("ControllerService ::: deleteResource :: data ", req.body);
    var user = await adminService.deleteResource(req.params.id);
    res.json({ data: user });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
};

controller.listDesks = async (req, res) => {
  try {
    // log.write("ControllerService ::: listDesks :: data ", req.body);
    var items = await adminService.listDesks(utils.body(req));
    res.json({ data: items });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
};
controller.saveDesk = async (req, res) => {
  try {
    // log.write("ControllerService ::: saveDesk :: data ", req.body);
    var user = await adminService.saveDesk(utils.body(req));
    res.json({ data: user });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
};
controller.deleteDesk = async (req, res) => {
  try {
    // log.write("ControllerService ::: deleteDesk :: data ", req.body);
    var user = await adminService.deleteDesk(req.params.id);
    res.json({ data: user });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
};

controller.listSkuCategories = async (req, res) => {
  try {
    // log.write("ControllerService ::: listSkuCategories :: data ", req.body);
    var items = await adminService.listSkuCategories(utils.body(req));
    res.json({ data: items });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
};
controller.saveSkuCategory = async (req, res) => {
  try {
    // log.write("ControllerService ::: saveSkuCategory :: data ", req.body);
    var user = await adminService.saveSkuCategory(utils.body(req));
    res.json({ data: user });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
};
controller.deleteSkuCategory = async (req, res) => {
  try {
    // log.write("ControllerService ::: deleteSkuCategory :: data ", req.body);
    var user = await adminService.deleteSkuCategory(req.params.id);
    res.json({ data: user });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
};

controller.listSkus = async (req, res) => {
  try {
    // log.write("ControllerService ::: listSkuCategories :: data ", req.body);
    var items = await adminService.listSkus(utils.body(req));
    res.json({ data: items });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
};
controller.saveSku = async (req, res) => {
  try {
    // log.write("ControllerService ::: saveSku :: data ", req.body);
    var user = await adminService.saveSku(utils.body(req));
    res.json({ data: user });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
};
controller.deleteSku = async (req, res) => {
  try {
    // log.write("ControllerService ::: deleteSku :: data ", req.body);
    var user = await adminService.deleteSku(req.params.id);
    res.json({ data: user });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
};

controller.listAssets = async (req, res) => {
  try {
    // log.write("ControllerService ::: listSkuCategories :: data ", req.body);
    var items = await adminService.listAssets(utils.body(req));
    res.json({ data: items });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
};
controller.saveAsset = async (req, res) => {
  try {
    // log.write("ControllerService ::: saveAsset :: data ", req.body);
    var user = await adminService.saveAsset(utils.body(req));
    res.json({ data: user });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
};
controller.deleteAsset = async (req, res) => {
  try {
    // log.write("ControllerService ::: deleteAsset :: data ", req.body);
    var user = await adminService.deleteAsset(req.params.id);
    res.json({ data: user });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
};

controller.listServiceProviderServices = async (req, res) => {
  try {
    // log.write("ControllerService ::: listSkuCategories :: data ", req.body);
    var items = await adminService.listServiceProviderServices(utils.body(req));
    res.json({ data: items });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
};
controller.saveServiceProviderService = async (req, res) => {
  try {
    // log.write("ControllerService ::: saveServiceProviderService :: data ", req.body);
    var user = await adminService.saveServiceProviderService(
      utils.body(req),
      utils.getUserName(req)
    );
    res.json({ data: user });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
};

controller.listServiceProviders = async (req, res) => {
  try {
    // log.write("ControllerService ::: listSkuCategories :: data ", req.body);
    var items = await adminService.listServiceProviders(utils.body(req));
    res.json({ data: items });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
};
controller.saveServiceProvider = async (req, res) => {
  try {
    // log.write("ControllerService ::: saveServiceProvider :: data ", req.body);
    var user = await adminService.saveServiceProvider(
      utils.body(req),
      utils.getUserName(req)
    );
    res.json({ data: user });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
};

controller.listExternalSystems = async (req, res) => {
  try {
    // log.write("ControllerService ::: listSkuCategories :: data ", req.body);
    var items = await adminService.listExternalSystems(utils.body(req));
    res.json({ data: items });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
};
controller.saveExternalSystem = async (req, res) => {
  try {
    // log.write("ControllerService ::: saveExternalSystem :: data ", req.body);
    var user = await adminService.saveExternalSystem(utils.body(req));
    res.json({ data: user });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
};
controller.deleteExternalSystem = async (req, res) => {
  try {
    // log.write("ControllerService ::: deleteExternalSystem :: data ", req.body);
    var user = await adminService.deleteExternalSystem(req.params.id);
    res.json({ data: user });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
};

controller.listMails = async (req, res) => {
  try {
    // log.write("ControllerService ::: listSkuCategories :: data ", req.body);
    var items = await adminService.listMails(utils.body(req));
    res.json({ data: items });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
};
controller.saveMail = async (req, res) => {
  try {
    // log.write("ControllerService ::: saveMail :: data ", req.body);
    var user = await adminService.saveMail(utils.body(req));
    res.json({ data: user });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
};
controller.deleteMail = async (req, res) => {
  try {
    // log.write("ControllerService ::: deleteMail :: data ", req.body);
    var user = await adminService.deleteMail(req.params.id);
    res.json({ data: user });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
};
controller.getNotification = async (req, res) => {
  try {
    // log.write("ControllerService ::: getNotification :: data ", req.body);
    var user = await adminService.getNotification(req.params.id);
    res.json({ data: user });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
};
controller.listClients = async (req, res) => {
  try {
    // log.write("ControllerService ::: listSkuCategories :: data ", req.body);
    var items = await adminService.listClients(utils.body(req));
    res.json({ data: items });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
};
controller.listNotifications = async (req, res) => {
  try {
    // log.write("ControllerService ::: listSkuCategories :: data ", req.body);
    var items = await adminService.listNotifications(utils.body(req));
    res.json({ data: items });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
};
controller.saveNotification = async (req, res) => {
  try {
    // log.write("ControllerService ::: saveNotification :: data ", req.body);
    var item = await adminService.saveNotification(utils.body(req));
    res.json({ data: item });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
};
controller.publishNotification = async (req, res) => {
  try {
    // log.write("ControllerService ::: publishNotification :: data ", req.body);
    var item = await adminService.publishNotification(utils.body(req));
    res.json({ data: item });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
};
controller.getUserMessages = async (req, res) => {
  try {
    // log.write("ControllerService ::: getUserMessages :: data ", req.body);
    var item = await adminService.getUserMessages(utils.body(req));
    res.json({ data: item });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
};
exports.controller = controller;
