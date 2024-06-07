'use strict';

var express = require('express');
var controllers = require('../../controllers/internal').controllers;
var utils = require('../../utils/utils.js').utils;
var config = require('../../utils/config.js').config;
var route = express.Router();

if (config.checkAuth) {
  route.use(utils.authChecker);
}

route.post('/listSkuCategories', controllers.purchases.listSkuCategories);
route.post('/saveSkuCategory', controllers.purchases.saveSkuCategory);
route.post('/listSkuTypes', controllers.purchases.listSkuTypes);
route.post('/saveSkuType', controllers.purchases.saveSkuType);
route.post('/searchSkus', controllers.purchases.searchSkus);
route.post('/listSkus', controllers.purchases.listSkus);
route.post('/saveSku', controllers.purchases.saveSku);
route.post('/listSkuUnits', controllers.purchases.listSkuUnits);
route.post('/saveSkuUnit', controllers.purchases.saveSkuUnit);
route.get('/deleteSkuUnit/:id', controllers.purchases.deleteSkuUnit);
route.post('/listAssets', controllers.purchases.listAssets);
route.post('/saveAsset', controllers.purchases.saveAsset);
route.post('/listAssetItems', controllers.purchases.listAssetItems);
route.post('/saveAssetItems', controllers.purchases.saveAssetItems);
route.post('/listPurchaseOrderInvoices', controllers.purchases.listPurchaseOrderInvoices);
route.post('/savePurchaseOrderInvoice', controllers.purchases.savePurchaseOrderInvoice);
route.post('/savePurchaseOrderInvoiceGsts', controllers.purchases.savePurchaseOrderInvoiceGsts);
route.get('/getPurchaseOrderInvoiceGsts/:purchaseOrderInvoiceId', controllers.purchases.getPurchaseOrderInvoiceGsts);

route.post('/listServiceVendors', controllers.purchases.listServiceVendors);
route.post('/listVendors', controllers.purchases.listVendors);
route.post('/saveVendor', controllers.purchases.saveVendor);
route.post('/saveProjectBill', controllers.purchases.saveProjectBill);
route.post('/saveServiceVendor', controllers.purchases.saveServiceVendor);
route.post('/getVendorServiceSkus', controllers.purchases.getVendorServiceSkus);
route.post('/getVendorTdsDeductions', controllers.purchases.getVendorTdsDeductions);
route.post('/deductTDS', controllers.purchases.deductTDS);
route.get('/getVendor/:id', controllers.purchases.getVendor);
route.get('/prepareRepeatPO/:id', controllers.purchases.prepareRepeatPO);
route.get('/prepareEditPO/:id', controllers.purchases.prepareEditPO);
route.get('/sendVendorVerificationMail/:id', controllers.purchases.sendVendorVerificationMail);

route.post('/listVendorContacts', controllers.purchases.listVendorContacts);
route.post('/saveVendorContact', controllers.purchases.saveVendorContact);

route.post('/listVendorBankAccounts', controllers.purchases.listVendorBankAccounts);
route.post('/saveVendorBankAccount', controllers.purchases.saveVendorBankAccount);

route.post('/listVendorPayments', controllers.purchases.listVendorPayments);
route.post('/listVendorPaymentTerms', controllers.purchases.listVendorPaymentTerms);
route.post('/saveVendorPaymentTerm', controllers.purchases.saveVendorPaymentTerm);

route.post('/listVendorSkus', controllers.purchases.listVendorSkus);
route.post('/saveVendorSku', controllers.purchases.saveVendorSku);
route.post('/updateVendorSkuLastPrice', controllers.purchases.updateVendorSkuLastPrice);
route.post('/sendVendorSKUsPricingMail', controllers.purchases.sendVendorSKUsPricingMail);

route.post('/listVendorProjects', controllers.purchases.listVendorProjects);
route.post('/saveVendorProject', controllers.purchases.saveVendorProject);
route.get('/getVendorProject/:id', controllers.purchases.getVendorProject);

route.post('/listWorkOrders', controllers.purchases.listWorkOrders);
route.post('/saveWorkOrder', controllers.purchases.saveWorkOrder);
route.get('/getWorkOrder/:id', controllers.purchases.getWorkOrder);
route.get('/regeneratePurchaseOrder/:id', controllers.purchases.regeneratePurchaseOrder);
route.get('/updatePurchaseOrdersLedger', controllers.purchases.updatePurchaseOrdersLedger);

route.post('/listWorkItems', controllers.purchases.listWorkItems);
route.post('/saveWorkItem', controllers.purchases.saveWorkItem);

route.post('/savePurchaseItem', controllers.purchases.savePurchaseItem);
route.post('/deletePurchaseItem', controllers.purchases.deletePurchaseItem);
route.post('/listPurchaseOrders', controllers.purchases.listPurchaseOrders);
route.post('/savePurchaseOrder', controllers.purchases.savePurchaseOrder);
route.get('/getPurchaseOrder/:id', controllers.purchases.getPurchaseOrder);

route.post('/listPurchaseItems', controllers.purchases.listPurchaseItems);
route.post('/savePurchaseItem', controllers.purchases.savePurchaseItem);

route.post('/listVendorPendingMilestones', controllers.purchases.listVendorPendingMilestones);
route.post('/confirmVendorMilestoneApprovals', controllers.purchases.confirmVendorMilestoneApprovals);
route.post('/listPurchaseOrderMilestones', controllers.purchases.listPurchaseOrderMilestones);
route.post('/savePurchaseOrderMilestone', controllers.purchases.savePurchaseOrderMilestone);

route.post('/listPurchaseStatusImages', controllers.purchases.listPurchaseStatusImages);
route.post('/listPurchaseItemStatuses', controllers.purchases.listPurchaseItemStatuses);
route.post('/savePurchaseItemStatus', controllers.purchases.savePurchaseItemStatus);
route.post('/savePurchaseItemDelivery', controllers.purchases.savePurchaseItemDelivery);

route.post('/searchVendorSkus', controllers.purchases.searchVendorSkus);
route.post('/raiseWorkOrders', controllers.purchases.raiseWorkOrders);
route.post('/approveDeclineWorkItem', controllers.purchases.approveDeclineWorkItem);
route.post('/requestVendorApproval', controllers.purchases.requestVendorApproval);

route.post('/raisePurchaseOrder', controllers.purchases.raisePurchaseOrder);
route.post('/updatePurchaseOrder', controllers.purchases.updatePurchaseOrder);

route.post('/listVendorTdsPayments', controllers.purchases.listVendorTdsPayments);
route.post('/getVendorTdsPayments', controllers.purchases.getVendorTdsPayments);
route.post('/saveVendorTdsPayment', controllers.purchases.saveVendorTdsPayment);
route.post('/listVendorTdsComplianceTerms', controllers.purchases.listVendorTdsComplianceTerms);
route.post('/saveTdsComplianceTerm', controllers.purchases.saveTdsComplianceTerm);
route.post('/listVendorGstComplianceTerms', controllers.purchases.listVendorGstComplianceTerms);
route.post('/saveGstComplianceTerm', controllers.purchases.saveGstComplianceTerm);

exports.route = route;