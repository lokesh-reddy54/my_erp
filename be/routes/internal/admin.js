'use strict';

var express = require('express');
var controllers = require('../../controllers/internal').controllers;
var utils = require('../../utils/utils.js').utils;
var config = require('../../utils/config.js').config;
var route = express.Router();

if (config.checkAuth) {
  route.use(utils.authChecker);
}

route.get('/migrateProviders', controllers.admin.migrateProviders);
route.post('/listCompanies', controllers.admin.listCompanies);
route.post('/saveCompany', controllers.admin.saveCompany);
route.post('/saveCompanyContact', controllers.admin.saveCompanyContact);
route.post('/listPettyCashAccounts', controllers.admin.listPettyCashAccounts);
route.post('/savePettyCashAccount', controllers.admin.savePettyCashAccount);
route.post('/savePettyCashAccountUser', controllers.admin.savePettyCashAccountUser);
route.post('/listDebitCardAccounts', controllers.admin.listDebitCardAccounts);
route.post('/saveDebitCardAccount', controllers.admin.saveDebitCardAccount);
route.post('/saveDebitCardAccountUser', controllers.admin.saveDebitCardAccountUser);
route.post('/listRoles', controllers.admin.listRoles);
route.post('/saveRole', controllers.admin.saveRole);
route.post('/listBusinessTerms', controllers.admin.listBusinessTerms);
route.post('/saveBusinessTerm', controllers.admin.saveBusinessTerm);
route.get('/deleteBusinessTerm/:id', controllers.admin.deleteBusinessTerm);
route.post('/listHelpNotes', controllers.admin.listHelpNotes);
route.post('/saveHelpNote', controllers.admin.saveHelpNote);
route.get('/deleteHelpNote/:id', controllers.admin.deleteHelpNote);
route.post('/listUsers', controllers.admin.listUsers);
route.post('/saveUser', controllers.admin.saveUser);
route.get('/deleteUser/:id', controllers.admin.deleteUser);

route.post('/listCountries', controllers.admin.listCountries);
route.post('/saveCountry', controllers.admin.saveCountry);
route.get('/deleteCountry/:id', controllers.admin.deleteCountry);

route.post('/getCitiesWithBuildings', controllers.admin.getCitiesWithBuildings);
route.post('/listCities', controllers.admin.listCities);
route.post('/saveCity', controllers.admin.saveCity);
route.get('/deleteCity/:id', controllers.admin.deleteCity);

route.post('/listLocations', controllers.admin.listLocations);
route.post('/saveLocation', controllers.admin.saveLocation);
route.get('/deleteLocation/:id', controllers.admin.deleteLocation);

route.post('/listFacilitySets', controllers.admin.listFacilitySets);
route.post('/saveFacilitySet', controllers.admin.saveFacilitySet);
route.get('/deleteFacilitySet/:id', controllers.admin.deleteFacilitySet);

route.post('/listFacilities', controllers.admin.listFacilities);
route.post('/saveFacility', controllers.admin.saveFacility);
route.get('/deleteFacility/:id', controllers.admin.deleteFacility);

route.post('/updateFacilitySetFacilities', controllers.admin.updateFacilitySetFacilities);

route.post('/listOffices', controllers.admin.listOffices);
route.post('/saveOffice', controllers.admin.saveOffice);
route.get('/deleteOffice/:id', controllers.admin.deleteOffice);

route.post('/listParkingLots', controllers.admin.listParkingLots);
route.post('/saveParkingLot', controllers.admin.saveParkingLot);
route.post('/listParkingSpots', controllers.admin.listParkingSpots);
route.post('/saveParkingSpots', controllers.admin.saveParkingSpots);


route.post('/listOfficePricings', controllers.admin.listOfficePricings);
route.post('/saveOfficePricing', controllers.admin.saveOfficePricing);
route.get('/deleteOfficePricing/:id', controllers.admin.deleteOfficePricing);

route.post('/listFloors', controllers.admin.listFloors);
route.post('/saveFloor', controllers.admin.saveFloor);
route.get('/deleteFloor/:id', controllers.admin.deleteFloor);

route.post('/listBuildings', controllers.admin.listBuildings);
route.post('/saveBuilding', controllers.admin.saveBuilding);
route.post('/listBuildingContacts', controllers.admin.listBuildingContacts);
route.post('/saveBuildingContact', controllers.admin.saveBuildingContact);
route.post('/listBuildingAmcs', controllers.admin.listBuildingAmcs);
route.post('/saveBuildingAmc', controllers.admin.saveBuildingAmc);
route.post('/listBuildingAmcItems', controllers.admin.listBuildingAmcItems);
route.post('/saveBuildingAmcItem', controllers.admin.saveBuildingAmcItem);
route.post('/saveBuildingContractTerm', controllers.admin.saveBuildingContractTerm);
route.post('/saveBuildingService', controllers.admin.saveBuildingService);
route.post('/saveBuildingServiceAssignee', controllers.admin.saveBuildingServiceAssignee);
route.get('/deleteBuilding/:id', controllers.admin.deleteBuilding);
route.get('/getBuildingServices/:id', controllers.admin.getBuildingServices);
route.get('/getBuildingContractTerms/:id', controllers.admin.getBuildingContractTerms);


route.post('/listBuildingProperties', controllers.admin.listBuildingProperties);
route.post('/saveBuildingProperty', controllers.admin.saveBuildingProperty);
route.post('/listPropertyContacts', controllers.admin.listPropertyContacts);
route.post('/savePropertyContact', controllers.admin.savePropertyContact);
route.post('/savePropertyContract', controllers.admin.savePropertyContract);
route.post('/listPropertyImages', controllers.admin.listPropertyImages);
route.post('/listPropertyContractNegotiations', controllers.admin.listPropertyContractNegotiations);
route.post('/savePropertyContractNegotiation', controllers.admin.savePropertyContractNegotiation);
route.get('/getPropertyContract/:id', controllers.admin.getPropertyContract);

route.post('/listCabins', controllers.admin.listCabins);
route.post('/saveCabin', controllers.admin.saveCabin);
route.get('/deleteCabin/:id', controllers.admin.deleteCabin);

route.post('/listResources', controllers.admin.listResources);
route.post('/listResourceImages', controllers.admin.listResourceImages);
route.post('/saveResource', controllers.admin.saveResource);
route.get('/deleteResource/:id', controllers.admin.deleteResource);

route.post('/listDesks', controllers.admin.listDesks);
route.post('/saveDesk', controllers.admin.saveDesk);
route.get('/deleteDesk/:id', controllers.admin.deleteDesk);

route.post('/listSkuCategories', controllers.admin.listSkuCategories);
route.post('/saveSkuCategory', controllers.admin.saveSkuCategory);
route.get('/deleteSkuCategory/:id', controllers.admin.deleteSkuCategory);

route.post('/listSkus', controllers.admin.listSkus);
route.post('/saveSku', controllers.admin.saveSku);
route.get('/deleteSku/:id', controllers.admin.deleteSku);

route.post('/listAssets', controllers.admin.listAssets);
route.post('/saveAsset', controllers.admin.saveAsset);
route.get('/deleteAsset/:id', controllers.admin.deleteAsset);


route.post('/listServiceProviderServices', controllers.admin.listServiceProviderServices);
route.post('/saveServiceProviderService', controllers.admin.saveServiceProviderService);

route.post('/listServiceProviders', controllers.admin.listServiceProviders);
route.post('/saveServiceProvider', controllers.admin.saveServiceProvider);

route.post('/listExternalSystems', controllers.admin.listExternalSystems);
route.post('/saveExternalSystem', controllers.admin.saveExternalSystem);
route.get('/deleteExternalSystem/:id', controllers.admin.deleteExternalSystem);


route.post('/listNotifications', controllers.admin.listNotifications);
route.post('/saveNotification', controllers.admin.saveNotification);
route.post('/publishNotification', controllers.admin.publishNotification);
route.get('/getNotification/:id', controllers.admin.getNotification);

route.post('/listClients', controllers.admin.listClients);
route.post('/listMails', controllers.admin.listMails);
route.post('/saveMail', controllers.admin.saveMail);
route.get('/deleteMail/:id', controllers.admin.deleteMail);

route.post('/getUserMessages', controllers.admin.getUserMessages);

exports.route = route;