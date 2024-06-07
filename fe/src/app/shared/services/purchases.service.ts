import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
import { HttpClient } from "@angular/common/http";
import { Helpers } from "../../helpers";

import * as _ from "lodash";

declare let $: any;
@Injectable()
export class PurchasesService {
	httpOptions;

	constructor(private httpClient: HttpClient) {
		if (localStorage.getItem("cwo_user") && localStorage.getItem("cwo_user") != "") {
			var user = JSON.parse(localStorage.getItem("cwo_user"));
			var companyId = user && user.companyId ? user.companyId : 1;
			this.httpOptions = {
				headers: new HttpHeaders({
					'Content-Type': 'application/json',
					'Authorization': user && user.token,
					'companyid': companyId + ""
				})
			};
		} else {
			this.httpOptions = {
				headers: new HttpHeaders({
					'Content-Type': 'application/json'
				})
			}
		}
	}

	listSkuUnits(data: any) {
		return this.httpClient.post(Helpers.composeEnvUrl() + "internal/purchases/listSkuUnits", data, this.httpOptions)
	}
	saveSkuUnit(data: any) {
		return this.httpClient.post(Helpers.composeEnvUrl() + "internal/purchases/saveSkuUnit", data, this.httpOptions)
	}
	deleteSkuUnit(id: any) {
		return this.httpClient.get(Helpers.composeEnvUrl() + "internal/purchases/deleteSkuUnit/ " + id, this.httpOptions)
	}
	listCategories(data: any) {
		return this.httpClient.post(Helpers.composeEnvUrl() + "internal/purchases/listSkuCategories", data, this.httpOptions)
	}
	listTypes(data: any) {
		return this.httpClient.post(Helpers.composeEnvUrl() + "internal/purchases/listSkuTypes", data, this.httpOptions)
	}
	listSkus(data: any) {
		return this.httpClient.post(Helpers.composeEnvUrl() + "internal/purchases/listSkus", data, this.httpOptions)
	}
	searchSkus(data: any) {
		return this.httpClient.post(Helpers.composeEnvUrl() + "internal/purchases/searchSkus", data, this.httpOptions)
	}
	listAssets(data: any) {
		return this.httpClient.post(Helpers.composeEnvUrl() + "internal/purchases/listAssets", data, this.httpOptions)
	}
	saveCategory(data: any) {
		return this.httpClient.post(Helpers.composeEnvUrl() + "internal/purchases/saveSkuCategory", data, this.httpOptions)
	}
	saveType(data: any) {
		return this.httpClient.post(Helpers.composeEnvUrl() + "internal/purchases/saveSKuType", data, this.httpOptions)
	}
	saveSku(data: any) {
		return this.httpClient.post(Helpers.composeEnvUrl() + "internal/purchases/saveSku", data, this.httpOptions)
	}
	saveAsset(data: any) {
		return this.httpClient.post(Helpers.composeEnvUrl() + "internal/purchases/saveAsset", data, this.httpOptions)
	}
	saveAssetItems(data: any) {
		return this.httpClient.post(Helpers.composeEnvUrl() + "internal/purchases/saveAssetItems", data, this.httpOptions)
	}


	approveBill(data: any) {
		return this.httpClient.post(Helpers.composeEnvUrl() + "internal/purchases/approveProjectBill", data, this.httpOptions)
	}
	saveProjectBill(data: any) {
		return this.httpClient.post(Helpers.composeEnvUrl() + "internal/purchases/saveProjectBill", data, this.httpOptions)
	}
	saveBill(data: any) {
		return this.httpClient.post(Helpers.composeEnvUrl() + "internal/purchases/saveBill", data, this.httpOptions)
	}
	listServiceVendors(data: any) {
		return this.httpClient.post(Helpers.composeEnvUrl() + "internal/purchases/listServiceVendors", data, this.httpOptions)
	}
	listVendors(data: any) {
		return this.httpClient.post(Helpers.composeEnvUrl() + "internal/purchases/listVendors", data, this.httpOptions)
	}
	saveServiceVendor(data: any) {
		return this.httpClient.post(Helpers.composeEnvUrl() + "internal/purchases/saveServiceVendor", data, this.httpOptions)
	}
	saveVendor(data: any) {
		return this.httpClient.post(Helpers.composeEnvUrl() + "internal/purchases/saveVendor", data, this.httpOptions)
	}
	getVendorServiceSkus(data: any) {
		return this.httpClient.post(Helpers.composeEnvUrl() + "internal/purchases/getVendorServiceSkus", data, this.httpOptions)
	}
	getVendorTdsDeductions(data: any) {
		return this.httpClient.post(Helpers.composeEnvUrl() + "internal/purchases/getVendorTdsDeductions", data, this.httpOptions)
	}
	deductTDS(data: any) {
		return this.httpClient.post(Helpers.composeEnvUrl() + "internal/purchases/deductTDS", data, this.httpOptions)
	}
	getVendor(id: any) {
		return this.httpClient.get(Helpers.composeEnvUrl() + "internal/purchases/getVendor/" + id, this.httpOptions)
	}
	getPurchaseOrderInvoiceGsts(id: any) {
		return this.httpClient.get(Helpers.composeEnvUrl() + "internal/purchases/getPurchaseOrderInvoiceGsts/" + id, this.httpOptions)
	}
	sendVendorVerificationMail(id: any) {
		return this.httpClient.get(Helpers.composeEnvUrl() + "internal/purchases/sendVendorVerificationMail/" + id, this.httpOptions)
	}
	listVendorContacts(data: any) {
		return this.httpClient.post(Helpers.composeEnvUrl() + "internal/purchases/listVendorContacts", data, this.httpOptions)
	}
	saveVendorContact(data: any) {
		return this.httpClient.post(Helpers.composeEnvUrl() + "internal/purchases/saveVendorContact", data, this.httpOptions)
	}
	listVendorBankAccounts(data: any) {
		return this.httpClient.post(Helpers.composeEnvUrl() + "internal/purchases/listVendorBankAccounts", data, this.httpOptions)
	}
	saveVendorBankAccount(data: any) {
		return this.httpClient.post(Helpers.composeEnvUrl() + "internal/purchases/saveVendorBankAccount", data, this.httpOptions)
	}
	listVendorPaymentTerms(data: any) {
		return this.httpClient.post(Helpers.composeEnvUrl() + "internal/purchases/listVendorPaymentTerms", data, this.httpOptions)
	}
	saveVendorPaymentTerm(data: any) {
		return this.httpClient.post(Helpers.composeEnvUrl() + "internal/purchases/saveVendorPaymentTerm", data, this.httpOptions)
	}
	listVendorSkus(data: any) {
		return this.httpClient.post(Helpers.composeEnvUrl() + "internal/purchases/listVendorSkus", data, this.httpOptions)
	}
	saveVendorSku(data: any) {
		return this.httpClient.post(Helpers.composeEnvUrl() + "internal/purchases/saveVendorSku", data, this.httpOptions)
	}
	updateVendorSkuLastPrice(data: any) {
		return this.httpClient.post(Helpers.composeEnvUrl() + "internal/purchases/updateVendorSkuLastPrice", data, this.httpOptions)
	}
	sendVendorSKUsPricingMail(data: any) {
		return this.httpClient.post(Helpers.composeEnvUrl() + "internal/purchases/sendVendorSKUsPricingMail", data, this.httpOptions)
	}
	listWorkOrders(data: any) {
		return this.httpClient.post(Helpers.composeEnvUrl() + "internal/purchases/listWorkOrders", data, this.httpOptions)
	}
	saveWorkOrder(data: any) {
		return this.httpClient.post(Helpers.composeEnvUrl() + "internal/purchases/saveWorkOrder", data, this.httpOptions)
	}
	getWorkOrder(id: any) {
		return this.httpClient.get(Helpers.composeEnvUrl() + "internal/purchases/getWorkOrder/" + id, this.httpOptions)
	}
	prepareRepeatPO(id: any) {
		return this.httpClient.get(Helpers.composeEnvUrl() + "internal/purchases/prepareRepeatPO/" + id, this.httpOptions)
	}
	prepareEditPO(id: any) {
		return this.httpClient.get(Helpers.composeEnvUrl() + "internal/purchases/prepareEditPO/" + id, this.httpOptions)
	}
	listWorkItems(data: any) {
		return this.httpClient.post(Helpers.composeEnvUrl() + "internal/purchases/listWorkItems", data, this.httpOptions)
	}
	saveWorkItem(data: any) {
		return this.httpClient.post(Helpers.composeEnvUrl() + "internal/purchases/saveWorkItem", data, this.httpOptions)
	}
	deletePurchaseItem(data: any) {
		return this.httpClient.post(Helpers.composeEnvUrl() + "internal/purchases/deletePurchaseItem", data, this.httpOptions)
	}
	listPurchaseOrders(data: any) {
		return this.httpClient.post(Helpers.composeEnvUrl() + "internal/purchases/listPurchaseOrders", data, this.httpOptions)
	}
	savePurchaseOrder(data: any) {
		return this.httpClient.post(Helpers.composeEnvUrl() + "internal/purchases/savePurchaseOrder", data, this.httpOptions)
	}
	listPurchaseItems(data: any) {
		return this.httpClient.post(Helpers.composeEnvUrl() + "internal/purchases/listPurchaseItems", data, this.httpOptions)
	}
	savePurchaseItem(data: any) {
		return this.httpClient.post(Helpers.composeEnvUrl() + "internal/purchases/savePurchaseItem", data, this.httpOptions)
	}
	listVendorPendingMilestones(data: any) {
		return this.httpClient.post(Helpers.composeEnvUrl() + "internal/purchases/listVendorPendingMilestones", data, this.httpOptions)
	}
	listPurchaseOrderMilestones(data: any) {
		return this.httpClient.post(Helpers.composeEnvUrl() + "internal/purchases/listPurchaseOrderMilestones", data, this.httpOptions)
	}
	confirmVendorMilestoneApprovals(data: any) {
		return this.httpClient.post(Helpers.composeEnvUrl() + "internal/purchases/confirmVendorMilestoneApprovals", data, this.httpOptions)
	}
	savePurchaseOrderMilestone(data: any) {
		return this.httpClient.post(Helpers.composeEnvUrl() + "internal/purchases/savePurchaseOrderMilestone", data, this.httpOptions)
	}
	listPurchaseStatusImages(data: any) {
		return this.httpClient.post(Helpers.composeEnvUrl() + "internal/purchases/listPurchaseStatusImages", data, this.httpOptions)
	}
	listPurchaseItemStatuses(data: any) {
		return this.httpClient.post(Helpers.composeEnvUrl() + "internal/purchases/listPurchaseItemStatuses", data, this.httpOptions)
	}
	savePurchaseItemDelivery(data: any) {
		return this.httpClient.post(Helpers.composeEnvUrl() + "internal/purchases/savePurchaseItemDelivery", data, this.httpOptions)
	}
	savePurchaseItemStatus(data: any) {
		return this.httpClient.post(Helpers.composeEnvUrl() + "internal/purchases/savePurchaseItemStatus", data, this.httpOptions)
	}
	listPurchaseOrderInvoices(data: any) {
		return this.httpClient.post(Helpers.composeEnvUrl() + "internal/purchases/listPurchaseOrderInvoices", data, this.httpOptions)
	}
	savePurchaseOrderInvoice(data: any) {
		return this.httpClient.post(Helpers.composeEnvUrl() + "internal/purchases/savePurchaseOrderInvoice", data, this.httpOptions)
	}
	savePurchaseOrderInvoiceGsts(data: any) {
		return this.httpClient.post(Helpers.composeEnvUrl() + "internal/purchases/savePurchaseOrderInvoiceGsts", data, this.httpOptions)
	}
	searchVendorSkus(data: any) {
		return this.httpClient.post(Helpers.composeEnvUrl() + "internal/purchases/searchVendorSkus", data, this.httpOptions)
	}
	raiseWorkOrders(data: any) {
		return this.httpClient.post(Helpers.composeEnvUrl() + "internal/purchases/raiseWorkOrders", data, this.httpOptions)
	}
	approveDeclineWorkItem(data: any) {
		return this.httpClient.post(Helpers.composeEnvUrl() + "internal/purchases/approveDeclineWorkItem", data, this.httpOptions)
	}
	requestVendorApproval(data: any) {
		return this.httpClient.post(Helpers.composeEnvUrl() + "internal/purchases/requestVendorApproval", data, this.httpOptions)
	}
	raisePurchaseOrder(data: any) {
		return this.httpClient.post(Helpers.composeEnvUrl() + "internal/purchases/raisePurchaseOrder", data, this.httpOptions)
	}
	getPurchaseOrder(id: any) {
		return this.httpClient.get(Helpers.composeEnvUrl() + "internal/purchases/getPurchaseOrder/" + id, this.httpOptions)
	}
	updatePurchaseOrder(data: any) {
		return this.httpClient.post(Helpers.composeEnvUrl() + "internal/purchases/updatePurchaseOrder", data, this.httpOptions)
	}
	regeneratePurchaseOrder(id: any) {
		return this.httpClient.get(Helpers.composeEnvUrl() + "internal/purchases/regeneratePurchaseOrder/" + id, this.httpOptions)
	}
	listProjects(data: any) {
		return this.httpClient.post(Helpers.composeEnvUrl() + "internal/purchases/listVendorProjects", data, this.httpOptions)
	}
	saveProject(data: any) {
		return this.httpClient.post(Helpers.composeEnvUrl() + "internal/purchases/saveVendorProject", data, this.httpOptions)
	}
	getProject(id: any) {
		return this.httpClient.get(Helpers.composeEnvUrl() + "internal/purchases/getVendorProject/" + id, this.httpOptions)
	}
	getVendorStats(data: any) {
		return this.httpClient.post(Helpers.composeEnvUrl() + "internal/reports/getVendorStats", data, this.httpOptions)
	}

	listVendorTdsPayments(data: any) {
		return this.httpClient.post(Helpers.composeEnvUrl() + "internal/purchases/listVendorTdsPayments", data, this.httpOptions)
	}
	getVendorTdsPayments(data: any) {
		return this.httpClient.post(Helpers.composeEnvUrl() + "internal/purchases/getVendorTdsPayments",data, this.httpOptions)
	}
	saveVendorTdsPayment(data: any) {
		return this.httpClient.post(Helpers.composeEnvUrl() + "internal/purchases/saveVendorTdsPayment", data, this.httpOptions)
	}
	listVendorTdsComplianceTerms(data: any) {
		return this.httpClient.post(Helpers.composeEnvUrl() + "internal/purchases/listVendorTdsComplianceTerms", data, this.httpOptions)
	}
	saveTdsComplianceTerm(data: any) {
		return this.httpClient.post(Helpers.composeEnvUrl() + "internal/purchases/saveTdsComplianceTerm", data, this.httpOptions)
	}
	listVendorGstComplianceTerms(data: any) {
		return this.httpClient.post(Helpers.composeEnvUrl() + "internal/purchases/listVendorGstComplianceTerms", data, this.httpOptions)
	}
	saveGstComplianceTerm(data: any) {
		return this.httpClient.post(Helpers.composeEnvUrl() + "internal/purchases/saveGstComplianceTerm", data, this.httpOptions)
	}

}