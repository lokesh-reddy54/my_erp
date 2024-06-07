'use strict';

var Q = require('q');
var util = require('util');
var request = require('request-promise');
var jwt = require('jsonwebtoken');
var requestIp = require('request-ip');

var config = require('../../utils/config').config;
var log = require('../../utils/log').log;
var utils = require('../../utils/utils').utils;
var assetsService = require('../../services/assets').service;

var controller = {};

controller.listStoreManagers = async (req, res) => {
  try {
    // log.write("ControllerService ::: listStoreManagers :: data ", req.body);
    var data = await assetsService.listStoreManagers(utils.body(req));
    res.json({ data: data });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
}
controller.listStores = async (req, res) => {
  try {
    // log.write("ControllerService ::: listStores :: data ", req.body);
    var data = await assetsService.listStores(utils.body(req));
    res.json({ data: data });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
}
controller.saveStore = async (req, res) => {
  try {
    // log.write("ControllerService ::: saveStore :: data ", req.body);
    var data = await assetsService.saveStore(utils.body(req));
    res.json({ data: data });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
}

controller.listBuildingAssets = async (req, res) => {
  try {
    // log.write("ControllerService ::: listBuildingAssets :: data ", req.body);
    var data = await assetsService.listBuildingAssets(utils.body(req));
    res.json({ data: data });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
}
controller.listStoreAssets = async (req, res) => {
  try {
    // log.write("ControllerService ::: listStoreAssets :: data ", req.body);
    var data = await assetsService.listStoreAssets(utils.body(req));
    res.json({ data: data });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
}
controller.listProjectAssets = async (req, res) => {
  try {
    // log.write("ControllerService ::: listProjectAssets :: data ", req.body);
    var data = await assetsService.listProjectAssets(utils.body(req));
    res.json({ data: data });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
}
controller.listAssetsRegistry = async (req, res) => {
  try {
    // log.write("ControllerService ::: listAssetsRegistry :: data ", req.body);
    var data = await assetsService.listAssetsRegistry(utils.body(req));
    res.json({ data: data });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
}
controller.listAssetItems = async (req, res) => {
  try {
    // log.write("ControllerService ::: listAssetItems :: data ", req.body);
    var data = await assetsService.listAssetItems(utils.body(req));
    res.json({ data: data });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
}
controller.createAssetItems = async (req, res) => {
  try {
    // log.write("ControllerService ::: createAssetItems :: data ", req.body);
    var data = await assetsService.createAssetItems(utils.body(req));
    res.json({ data: data });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
}
controller.assignAssetItems = async (req, res) => {
  try {
    // log.write("ControllerService ::: assignAssetItems :: data ", req.body);
    var data = await assetsService.assignAssetItems(utils.body(req));
    res.json({ data: data });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
}
controller.saveAsset = async (req, res) => {
  try {
    // log.write("ControllerService ::: saveAsset :: data ", req.body);
    var data = await assetsService.saveAsset(utils.body(req), utils.getUserName(req));
    res.json({ data: data });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
}
controller.saveAssetItem = async (req, res) => {
  try {
    // log.write("ControllerService ::: saveAssetItem :: data ", req.body);
    var data = await assetsService.saveAssetItem(utils.body(req), utils.getUserName(req));
    res.json({ data: data });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
}
controller.getAssets = async (req, res) => {
  try {
    // log.write("ControllerService ::: getAssets :: data ", req.body);
    var data = await assetsService.getAssets(req.body);
    res.json({ data: data });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
}
controller.getAssetItem = async (req, res) => {
  try {
    // log.write("ControllerService ::: getAssetItem :: data ", req.body);
    var data = await assetsService.getAssetItem(req.params.id);
    res.json({ data: data });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
}

controller.listAssetServiceProviders = async (req, res) => {
  try {
    // log.write("ControllerService ::: listAssetServiceProviders :: data ", req.body);
    var data = await assetsService.listAssetServiceProviders(utils.body(req));
    res.json({ data: data });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
}
controller.saveAssetServiceProvider = async (req, res) => {
  try {
    // log.write("ControllerService ::: saveAssetServiceProvider :: data ", req.body);
    var data = await assetsService.saveAssetServiceProvider(utils.body(req));
    res.json({ data: data });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
}

controller.listAssetWarrenties = async (req, res) => {
  try {
    // log.write("ControllerService ::: listAssetWarrenties :: data ", req.body);
    var data = await assetsService.listAssetWarrenties(utils.body(req));
    res.json({ data: data });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
}
controller.saveAssetWarrenty = async (req, res) => {
  try {
    // log.write("ControllerService ::: saveAssetWarrenty :: data ", req.body);
    var data = await assetsService.saveAssetWarrenty(utils.body(req), utils.getUserName(req));
    res.json({ data: data });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
}

exports.controller = controller;