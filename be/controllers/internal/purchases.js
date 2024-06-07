'use strict';

var Q = require('q');
var util = require('util');
var request = require('request-promise');
var jwt = require('jsonwebtoken');
var requestIp = require('request-ip');

var config = require('../../utils/config').config;
var log = require('../../utils/log').log;
var utils = require('../../utils/utils').utils;
var purchaseService = require('../../services/purchases').service;

var controller = {};

controller.listSkuCategories = async (req, res) => {
  try {
    // log.write("ControllerService ::: listSkuCategories :: data ", req.body);
    var users = await purchaseService.listSkuCategories(utils.body(req));
    res.json({ data: users });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
}
controller.saveSkuCategory = async (req, res) => {
  try {
    // log.write("ControllerService ::: saveSkuCategory :: data ", req.body);
    var user = await purchaseService.saveSkuCategory(utils.body(req), utils.getUserName(req));
    res.json({ data: user })
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
}

controller.listSkuTypes = async (req, res) => {
  try {
    // log.write("ControllerService ::: listSkuTypes :: data ", req.body);
    var users = await purchaseService.listSkuTypes(utils.body(req));
    res.json({ data: users });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
}
controller.saveSkuType = async (req, res) => {
  try {
    // log.write("ControllerService ::: saveSkuType :: data ", req.body);
    var user = await purchaseService.saveSkuType(utils.body(req), utils.getUserName(req));
    res.json({ data: user })
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
}

controller.listSkus = async (req, res) => {
  try {
    // log.write("ControllerService ::: listSkus :: data ", req.body);
    var users = await purchaseService.listSkus(utils.body(req));
    res.json({ data: users });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
}
controller.searchSkus = async (req, res) => {
  try {
    // log.write("ControllerService ::: searchSkus :: data ", req.body);
    var users = await purchaseService.searchSkus(utils.body(req));
    res.json({ data: users });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
}
controller.saveSku = async (req, res) => {
  try {
    // log.write("ControllerService ::: saveSku :: data ", req.body);
    var user = await purchaseService.saveSku(utils.body(req), utils.getUserName(req));
    res.json({ data: user })
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
}
controller.listSkuUnits = async (req, res) => {
  try {
    // log.write("ControllerService ::: listSkuUnits :: data ", req.body);
    var user = await purchaseService.listSkuUnits(utils.body(req), utils.getUserName(req));
    res.json({ data: user })
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
}
controller.saveSkuUnit = async (req, res) => {
  try {
    // log.write("ControllerService ::: saveSkuUnit :: data ", req.body);
    var user = await purchaseService.saveSkuUnit(utils.body(req), utils.getUserName(req));
    res.json({ data: user })
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
}
controller.deleteSkuUnit = async (req, res) => {
  try {
    // log.write("ControllerService ::: saveSkuUnit :: data ", req.body);
    var item = await purchaseService.deleteSkuUnit(req.params.id, utils.getUserName(req));
    res.json({ data: item })
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
}

controller.listAssets = async (req, res) => {
  try {
    // log.write("ControllerService ::: listAssets :: data ", req.body);
    var users = await purchaseService.listAssets(utils.body(req));
    res.json({ data: users });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
}
controller.listAssetItems = async (req, res) => {
  try {
    // log.write("ControllerService ::: listAssetItems :: data ", req.body);
    var users = await purchaseService.listAssetItems(utils.body(req));
    res.json({ data: users });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
}
controller.saveAsset = async (req, res) => {
  try {
    // log.write("ControllerService ::: saveAsset :: data ", req.body);
    var user = await purchaseService.saveAsset(utils.body(req), utils.getUserName(req));
    res.json({ data: user })
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
}
controller.saveAssetItems = async (req, res) => {
  try {
    // log.write("ControllerService ::: saveAssetItems :: data ", req.body);
    var user = await purchaseService.saveAssetItems(utils.body(req), utils.getUserName(req));
    res.json({ data: user })
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
}

controller.listSkus = async (req, res) => {
  try {
    // log.write("ControllerService ::: listSkus :: data ", req.body);
    var users = await purchaseService.listSkus(utils.body(req));
    res.json({ data: users });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
}
controller.saveSku = async (req, res) => {
  try {
    // log.write("ControllerService ::: saveSku :: data ", req.body);
    var user = await purchaseService.saveSku(utils.body(req), utils.getUserName(req));
    res.json({ data: user })
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
}

controller.listServiceVendors = async (req, res) => {
  try {
    // log.write("ControllerService ::: listServiceVendors :: data ", req.body);
    var users = await purchaseService.listServiceVendors(utils.body(req));
    res.json({ data: users });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
}
controller.listVendors = async (req, res) => {
  try {
    // log.write("ControllerService ::: listVendors :: data ", req.body);
    var users = await purchaseService.listVendors(utils.body(req));
    res.json({ data: users });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
}
controller.saveVendor = async (req, res) => {
  try {
    // log.write("ControllerService ::: saveVendor :: data ", req.body);
    var user = await purchaseService.saveVendor(utils.body(req), utils.getUserName(req));
    res.json({ data: user })
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
}
controller.saveServiceVendor = async (req, res) => {
  try {
    // log.write("ControllerService ::: saveServiceVendor :: data ", req.body);
    var user = await purchaseService.saveServiceVendor(utils.body(req), utils.getUserName(req));
    res.json({ data: user })
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
}
controller.deductTDS = async (req, res) => {
  try {
    // log.write("ControllerService ::: deductTDS :: data ", req.body);
    var user = await purchaseService.deductTDS(utils.body(req), utils.getUserName(req));
    res.json({ data: user })
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
}
controller.getVendorServiceSkus = async (req, res) => {
  try {
    // log.write("ControllerService ::: getVendorServiceSkus :: data ", req.body);
    var user = await purchaseService.getVendorServiceSkus(utils.body(req), utils.getUserName(req));
    res.json({ data: user })
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
}
controller.getVendorTdsDeductions = async (req, res) => {
  try {
    // log.write("ControllerService ::: getVendorTdsDeductions :: data ", req.body);
    var user = await purchaseService.getVendorTdsDeductions(utils.body(req), utils.getUserName(req));
    res.json({ data: user })
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
}
controller.getVendor = async (req, res) => {
  try {
    // log.write("ControllerService ::: getVendor :: data ", req.body);
    var user = await purchaseService.getVendor(req.params.id);
    res.json({ data: user })
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
}
controller.sendVendorVerificationMail = async (req, res) => {
  try {
    // log.write("ControllerService ::: sendVendorVerificationMail :: data ", req.body);
    var user = await purchaseService.sendVendorVerificationMail(req.params.id);
    res.json({ data: user })
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
}

controller.listVendorContacts = async (req, res) => {
  try {
    // log.write("ControllerService ::: listVendorContacts :: data ", req.body);
    var users = await purchaseService.listVendorContacts(utils.body(req));
    res.json({ data: users });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
}
controller.saveVendorContact = async (req, res) => {
  try {
    // log.write("ControllerService ::: saveVendorContact :: data ", req.body);
    var user = await purchaseService.saveVendorContact(utils.body(req), utils.getUserName(req));
    res.json({ data: user })
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
}

controller.listVendorBankAccounts = async (req, res) => {
  try {
    // log.write("ControllerService ::: listVendorBankAccounts :: data ", req.body);
    var users = await purchaseService.listVendorBankAccounts(utils.body(req));
    res.json({ data: users });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
}
controller.saveVendorBankAccount = async (req, res) => {
  try {
    // log.write("ControllerService ::: saveVendorBankAccount :: data ", req.body);
    var user = await purchaseService.saveVendorBankAccount(utils.body(req), utils.getUserName(req));
    res.json({ data: user })
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
}

controller.listVendorPayments = async (req, res) => {
  try {
    // log.write("ControllerService ::: listVendorPayments :: data ", req.body);
    var users = await purchaseService.listVendorPayments(utils.body(req));
    res.json({ data: users });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
}
controller.listVendorPaymentTerms = async (req, res) => {
  try {
    // log.write("ControllerService ::: listVendorPaymentTerms :: data ", req.body);
    var users = await purchaseService.listVendorPaymentTerms(utils.body(req));
    res.json({ data: users });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
}
controller.saveVendorPaymentTerm = async (req, res) => {
  try {
    // log.write("ControllerService ::: saveVendorPaymentTerm :: data ", req.body);
    var user = await purchaseService.saveVendorPaymentTerm(utils.body(req), utils.getUserName(req));
    res.json({ data: user })
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
}
controller.savePurchaseOrderInvoice = async (req, res) => {
  try {
    // log.write("ControllerService ::: savePurchaseOrderInvoice :: data ", req.body);
    var user = await purchaseService.savePurchaseOrderInvoice(utils.body(req), utils.getUserName(req));
    res.json({ data: user })
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
}
controller.listPurchaseOrderInvoices = async (req, res) => {
  try {
    // log.write("ControllerService ::: listPurchaseOrderInvoices :: data ", req.body);
    var user = await purchaseService.listPurchaseOrderInvoices(utils.body(req), utils.getUserName(req));
    res.json({ data: user })
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
}
controller.getPurchaseOrderInvoiceGsts = async (req, res) => {
  try {
    // log.write("ControllerService ::: getPurchaseOrderInvoiceGsts :: data ", req.body);
    var user = await purchaseService.getPurchaseOrderInvoiceGsts(req.params.purchaseOrderInvoiceId);
    res.json({ data: user })
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
}
controller.savePurchaseOrderInvoiceGsts = async (req, res) => {
  try {
    // log.write("ControllerService ::: savePurchaseOrderInvoiceGsts :: data ", req.body);
    var user = await purchaseService.savePurchaseOrderInvoiceGsts(utils.body(req), utils.getUserName(req));
    res.json({ data: user })
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
}

controller.listVendorSkus = async (req, res) => {
  try {
    // log.write("ControllerService ::: listVendorSkus :: data ", req.body);
    var users = await purchaseService.listVendorSkus(utils.body(req));
    res.json({ data: users });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
}
controller.saveVendorSku = async (req, res) => {
  try {
    // log.write("ControllerService ::: saveVendorSku :: data ", req.body);
    var user = await purchaseService.saveVendorSku(utils.body(req), utils.getUserName(req));
    res.json({ data: user })
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
}
controller.updateVendorSkuLastPrice = async (req, res) => {
  try {
    // log.write("ControllerService ::: updateVendorSkuLastPrice :: data ", req.body);
    var user = await purchaseService.updateVendorSkuLastPrice(utils.body(req), utils.getUserName(req));
    res.json({ data: user })
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
}
controller.sendVendorSKUsPricingMail = async (req, res) => {
  try {
    // log.write("ControllerService ::: sendVendorSKUsPricingMail :: data ", req.body);
    var user = await purchaseService.sendVendorSKUsPricingMail(utils.body(req), utils.getUserName(req));
    res.json({ data: user })
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
}

controller.listWorkOrders = async (req, res) => {
  try {
    // log.write("ControllerService ::: listWorkOrders :: data ", req.body);
    var users = await purchaseService.listWorkOrders(utils.body(req));
    res.json({ data: users });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
}
controller.saveWorkOrder = async (req, res) => {
  try {
    // log.write("ControllerService ::: saveWorkOrder :: data ", req.body);
    var user = await purchaseService.saveWorkOrder(utils.body(req), utils.getUserName(req));
    res.json({ data: user })
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
}
controller.getWorkOrder = async (req, res) => {
  try {
    // log.write("ControllerService ::: getWorkOrder :: data ", req.body);
    var user = await purchaseService.getWorkOrder(req.params.id);
    res.json({ data: user })
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
}
controller.prepareRepeatPO = async (req, res) => {
  try {
    // log.write("ControllerService ::: prepareRepeatPO :: data ", req.body);
    var user = await purchaseService.prepareRepeatPO(req.params.id);
    res.json({ data: user })
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
}
controller.prepareEditPO = async (req, res) => {
  try {
    // log.write("ControllerService ::: prepareEditPO :: data ", req.body);
    var user = await purchaseService.prepareEditPO(req.params.id);
    res.json({ data: user })
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
}
controller.listVendorProjects = async (req, res) => {
  try {
    // log.write("ControllerService ::: listVendorProjects :: data ", req.body);
    var users = await purchaseService.listVendorProjects(utils.body(req));
    res.json({ data: users });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
}
controller.saveVendorProject = async (req, res) => {
  try {
    // log.write("ControllerService ::: saveVendorProject :: data ", req.body);
    var user = await purchaseService.saveVendorProject(utils.body(req), utils.getUserName(req));
    res.json({ data: user })
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
}
controller.saveProjectBill = async (req, res) => {
  try {
    // log.write("ControllerService ::: saveProjectBill :: data ", req.body);
    var user = await purchaseService.saveProjectBill(utils.body(req), utils.getUserName(req));
    res.json({ data: user })
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
}
controller.getVendorProject = async (req, res) => {
  try {
    // log.write("ControllerService ::: getVendorProject :: data ", req.body);
    var user = await purchaseService.getVendorProject(req.params.id);
    res.json({ data: user })
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
}

controller.listWorkItems = async (req, res) => {
  try {
    // log.write("ControllerService ::: listWorkItems :: data ", req.body);
    var users = await purchaseService.listWorkItems(utils.body(req));
    res.json({ data: users });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
}
controller.saveWorkItem = async (req, res) => {
  try {
    // log.write("ControllerService ::: saveWorkItem :: data ", req.body);
    var user = await purchaseService.saveWorkItem(utils.body(req), utils.getUserName(req));
    res.json({ data: user })
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
}

controller.savePurchaseItem = async (req, res) => {
  try {
    // log.write("ControllerService ::: savePurchaseItem :: data ", req.body);
    var user = await purchaseService.savePurchaseItem(utils.body(req), utils.getUserName(req));
    res.json({ data: user })
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
}
controller.deletePurchaseItem = async (req, res) => {
  try {
    // log.write("ControllerService ::: deletePurchaseItem :: data ", req.body);
    var user = await purchaseService.deletePurchaseItem(utils.body(req), utils.getUserName(req));
    res.json({ data: user })
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
}
controller.listPurchaseOrders = async (req, res) => {
  try {
    // log.write("ControllerService ::: listPurchaseOrders :: data ", req.body);
    var users = await purchaseService.listPurchaseOrders(utils.body(req));
    res.json({ data: users });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
}
controller.savePurchaseOrder = async (req, res) => {
  try {
    // log.write("ControllerService ::: savePurchaseOrder :: data ", req.body);
    var user = await purchaseService.savePurchaseOrder(utils.body(req), utils.getUserName(req));
    res.json({ data: user })
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
}
controller.getPurchaseOrder = async (req, res) => {
  try {
    // log.write("ControllerService ::: getPurchaseOrder :: data ", req.body);
    var user = await purchaseService.getPurchaseOrder(req.params.id);
    res.json({ data: user })
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
}
controller.regeneratePurchaseOrder = async (req, res) => {
  try {
    // log.write("ControllerService ::: regeneratePurchaseOrder :: data ", req.body);
    var user = await purchaseService.regeneratePurchaseOrder(req.params.id);
    res.json({ data: user })
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
}
controller.updatePurchaseOrdersLedger = async (req, res) => {
  try {
    // log.write("ControllerService ::: updatePurchaseOrdersLedger :: data ", req.body);
    var data = await purchaseService.updatePurchaseOrdersLedger();
    res.json({ data: data })
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
}


controller.listPurchaseItems = async (req, res) => {
  try {
    // log.write("ControllerService ::: listPurchaseItems :: data ", req.body);
    var users = await purchaseService.listPurchaseItems(utils.body(req));
    res.json({ data: users });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
}
controller.savePurchaseItem = async (req, res) => {
  try {
    // log.write("ControllerService ::: savePurchaseItem :: data ", req.body);
    var user = await purchaseService.savePurchaseItem(utils.body(req), utils.getUserName(req));
    res.json({ data: user })
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
}

controller.listVendorPendingMilestones = async (req, res) => {
  try {
    // log.write("ControllerService ::: listVendorPendingMilestones :: data ", req.body);
    var users = await purchaseService.listVendorPendingMilestones(utils.body(req));
    res.json({ data: users });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
}
controller.confirmVendorMilestoneApprovals = async (req, res) => {
  try {
    // log.write("ControllerService ::: confirmVendorMilestoneApprovals :: data ", req.body);
    var users = await purchaseService.confirmVendorMilestoneApprovals(utils.body(req));
    res.json({ data: users });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
}
controller.listPurchaseOrderMilestones = async (req, res) => {
  try {
    // log.write("ControllerService ::: listPurchaseOrderMilestones :: data ", req.body);
    var users = await purchaseService.listPurchaseOrderMilestones(utils.body(req));
    res.json({ data: users });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
}
controller.savePurchaseOrderMilestone = async (req, res) => {
  try {
    // log.write("ControllerService ::: savePurchaseOrderMilestone :: data ", req.body);
    var user = await purchaseService.savePurchaseOrderMilestone(utils.body(req), utils.getUserName(req));
    res.json({ data: user })
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
}

controller.listPurchaseStatusImages = async (req, res) => {
  try {
    // log.write("ControllerService ::: listPurchaseStatusImages :: data ", req.body);
    var users = await purchaseService.listPurchaseStatusImages(utils.body(req));
    res.json({ data: users });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
}
controller.listPurchaseItemStatuses = async (req, res) => {
  try {
    // log.write("ControllerService ::: listPurchaseItemStatuses :: data ", req.body);
    var users = await purchaseService.listPurchaseItemStatuses(utils.body(req));
    res.json({ data: users });
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
}
controller.savePurchaseItemStatus = async (req, res) => {
  try {
    // log.write("ControllerService ::: savePurchaseItemStatus :: data ", req.body);
    var user = await purchaseService.savePurchaseItemStatus(utils.body(req), utils.getUserName(req));
    res.json({ data: user })
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
}
controller.savePurchaseItemDelivery = async (req, res) => {
  try {
    // log.write("ControllerService ::: savePurchaseItemDelivery :: data ", req.body);
    var user = await purchaseService.savePurchaseItemDelivery(utils.body(req), utils.getUserName(req));
    res.json({ data: user })
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
}

controller.searchVendorSkus = async (req, res) => {
  try {
    // log.write("ControllerService ::: searchVendorSkus :: data ", req.body);
    var user = await purchaseService.searchVendorSkus(utils.body(req), utils.getUserName(req));
    res.json({ data: user })
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
}
controller.raiseWorkOrders = async (req, res) => {
  try {
    // log.write("ControllerService ::: raiseWorkOrders :: data ", req.body);
    var user = await purchaseService.raiseWorkOrders(utils.body(req), utils.getUserName(req));
    res.json({ data: user })
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
}
controller.approveDeclineWorkItem = async (req, res) => {
  try {
    // log.write("ControllerService ::: approveDeclineWorkItem :: data ", req.body);
    var user = await purchaseService.approveDeclineWorkItem(utils.body(req), utils.getUserName(req));
    res.json({ data: user })
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
}
controller.requestVendorApproval = async (req, res) => {
  try {
    // log.write("ControllerService ::: requestVendorApproval :: data ", req.body);
    var user = await purchaseService.requestVendorApproval(utils.body(req), utils.getUserName(req));
    res.json({ data: user })
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
}

controller.raisePurchaseOrder = async (req, res) => {
  try {
    // log.write("ControllerService ::: raisePurchaseOrder :: data ", req.body);
    var user = await purchaseService.raisePurchaseOrder(utils.body(req), utils.getUserName(req));
    res.json({ data: user })
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
}
controller.updatePurchaseOrder = async (req, res) => {
  try {
    // log.write("ControllerService ::: updatePurchaseOrder :: data ", req.body);
    var user = await purchaseService.updatePurchaseOrder(utils.body(req), utils.getUserName(req));
    res.json({ data: user })
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
}


controller.listVendorTdsPayments = async (req, res) => {
  try {
    // log.write("ControllerService ::: listVendorTdsPayments :: data ", req.body);
    var user = await purchaseService.listVendorTdsPayments(utils.body(req), utils.getUserName(req));
    res.json({ data: user })
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
}
controller.getVendorTdsPayments = async (req, res) => {
  try {
    // log.write("ControllerService ::: getVendorTdsPayments :: data ", req.body);
    var user = await purchaseService.getVendorTdsPayments(utils.body(req), utils.getUserName(req));
    res.json({ data: user })
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
}
controller.saveVendorTdsPayment = async (req, res) => {
  try {
    // log.write("ControllerService ::: saveVendorTdsPayment :: data ", req.body);
    var user = await purchaseService.saveVendorTdsPayment(utils.body(req), utils.getUserName(req));
    res.json({ data: user })
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
}
controller.listVendorTdsComplianceTerms = async (req, res) => {
  try {
    // log.write("ControllerService ::: listVendorTdsComplianceTerms :: data ", req.body);
    var user = await purchaseService.listVendorTdsComplianceTerms(utils.body(req), utils.getUserName(req));
    res.json({ data: user })
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
}
controller.saveTdsComplianceTerm = async (req, res) => {
  try {
    // log.write("ControllerService ::: saveTdsComplianceTerm :: data ", req.body);
    var user = await purchaseService.saveTdsComplianceTerm(utils.body(req), utils.getUserName(req));
    res.json({ data: user })
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
}
controller.listVendorGstComplianceTerms = async (req, res) => {
  try {
    // log.write("ControllerService ::: listVendorGstComplianceTerms :: data ", req.body);
    var user = await purchaseService.listVendorGstComplianceTerms(utils.body(req), utils.getUserName(req));
    res.json({ data: user })
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
}
controller.saveGstComplianceTerm = async (req, res) => {
  try {
    // log.write("ControllerService ::: saveGstComplianceTerm :: data ", req.body);
    var user = await purchaseService.saveGstComplianceTerm(utils.body(req), utils.getUserName(req));
    res.json({ data: user })
  } catch (e) {
    res.json({ error: utils.firstError(e) });
  }
}
exports.controller = controller;