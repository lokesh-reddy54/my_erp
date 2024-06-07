'use strict';

var express = require('express');
var controllers = require('../../controllers/internal').controllers;
var utils = require('../../utils/utils.js').utils;
var config = require('../../utils/config.js').config;
var route = express.Router();

if (config.checkAuth) {
  route.use(utils.authChecker);
}

route.post('/listStoreManagers', controllers.assets.listStoreManagers);
route.post('/listStores', controllers.assets.listStores);
route.post('/saveStore', controllers.assets.saveStore);

route.post('/listBuildingAssets', controllers.assets.listBuildingAssets);
route.post('/listProjectAssets', controllers.assets.listProjectAssets);
route.post('/listStoreAssets', controllers.assets.listStoreAssets);
route.post('/listAssetsRegistry', controllers.assets.listAssetsRegistry);
route.post('/listAssetItems', controllers.assets.listAssetItems);
route.post('/createAssetItems', controllers.assets.createAssetItems);
route.post('/assignAssetItems', controllers.assets.assignAssetItems);
route.post('/getAssets', controllers.assets.getAssets);
route.get('/getAssetItem/:id', controllers.assets.getAssetItem);
route.post('/saveAsset', controllers.assets.saveAsset);
route.post('/saveAssetItem', controllers.assets.saveAssetItem);

route.post('/listAssetServiceProviders', controllers.assets.listAssetServiceProviders);
route.post('/saveAssetServiceProvider', controllers.assets.saveAssetServiceProvider);
route.post('/listAssetWarrenties', controllers.assets.listAssetWarrenties);
route.post('/saveAssetWarrenty', controllers.assets.saveAssetWarrenty);

exports.route = route;