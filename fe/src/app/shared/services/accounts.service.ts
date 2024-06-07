import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
import { HttpClient } from "@angular/common/http";
import { Helpers } from "../../helpers";

import * as _ from "lodash";

declare let $: any;
@Injectable()
export class AccountsService {
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
	
	mapImageToBill(data: any) {
		return this.httpClient.post(Helpers.composeEnvUrl() + "internal/accounts/mapImageToBill", data, this.httpOptions)
	}
	getRecurringBillSuggestions(data: any) {
		return this.httpClient.post(Helpers.composeEnvUrl() + "internal/accounts/getRecurringBillSuggestions", data, this.httpOptions)
	}
	getOpexCategories(data: any) {
		return this.httpClient.post(Helpers.composeEnvUrl() + "internal/accounts/getOpexCategories", data, this.httpOptions)
	}
	listCategories(data: any) {
		return this.httpClient.post(Helpers.composeEnvUrl() + "internal/accounts/listOpexCategories", data, this.httpOptions)
	}
	listTypes(data: any) {
		return this.httpClient.post(Helpers.composeEnvUrl() + "internal/accounts/listOpexTypes", data, this.httpOptions)
	}
	saveCategory(data: any) {
		return this.httpClient.post(Helpers.composeEnvUrl() + "internal/accounts/saveOpexCategory", data, this.httpOptions)
	}
	saveType(data: any) {
		return this.httpClient.post(Helpers.composeEnvUrl() + "internal/accounts/saveOpexType", data, this.httpOptions)
	}
	listOpexPayments(data: any) {
		return this.httpClient.post(Helpers.composeEnvUrl() + "internal/accounts/listOpexPayments", data, this.httpOptions)
	}
	saveOpexPayment(data: any) {
		return this.httpClient.post(Helpers.composeEnvUrl() + "internal/accounts/saveOpexPayment", data, this.httpOptions)
	}
	listOpexBills(data: any) {
		return this.httpClient.post(Helpers.composeEnvUrl() + "internal/accounts/listOpexBills", data, this.httpOptions)
	}
	listBillItems(data: any) {
		return this.httpClient.post(Helpers.composeEnvUrl() + "internal/accounts/listBillItems", data, this.httpOptions)
	}
	saveOpexBill(data: any) {
		return this.httpClient.post(Helpers.composeEnvUrl() + "internal/accounts/saveOpexBill", data, this.httpOptions)
	}
	listBillsQueue(data: any) {
		return this.httpClient.post(Helpers.composeEnvUrl() + "internal/accounts/listBillsQueue", data, this.httpOptions)
	}
	saveBillsQueue(data: any) {
		return this.httpClient.post(Helpers.composeEnvUrl() + "internal/accounts/saveBillsQueue", data, this.httpOptions)
	}
	raiseOpexBills(data: any) {
		return this.httpClient.post(Helpers.composeEnvUrl() + "internal/accounts/raiseOpexBills", data, this.httpOptions)
	}

	getPayinsByStatus(data: any) {
		return this.httpClient.post(Helpers.composeEnvUrl() + "internal/accounts/getPayinsByStatus", data, this.httpOptions)
	}
	getPayoutsByStatus(data: any) {
		return this.httpClient.post(Helpers.composeEnvUrl() + "internal/accounts/getPayoutsByStatus", data, this.httpOptions)
	}
	getPayoutEntry(data: any) {
		return this.httpClient.post(Helpers.composeEnvUrl() + "internal/accounts/getPayoutEntry", data, this.httpOptions)
	}
	getPayoutEntriesByStatus(data: any) {
		return this.httpClient.post(Helpers.composeEnvUrl() + "internal/accounts/getPayoutEntriesByStatus", data, this.httpOptions)
	}
	getDebitSuggestions(data: any) {
		return this.httpClient.post(Helpers.composeEnvUrl() + "internal/accounts/getDebitSuggestions", data, this.httpOptions)
	}
	getAttributeSuggestions(data: any) {
		return this.httpClient.post(Helpers.composeEnvUrl() + "internal/accounts/getAttributeSuggestions", data, this.httpOptions)
	}
	listPayinEntries(data: any) {
		return this.httpClient.post(Helpers.composeEnvUrl() + "internal/accounts/listPayinEntries", data, this.httpOptions)
	}
	listPayouts(data: any) {
		return this.httpClient.post(Helpers.composeEnvUrl() + "internal/accounts/listPayouts", data, this.httpOptions)
	}
	savePayment(data: any) {
		return this.httpClient.post(Helpers.composeEnvUrl() + "internal/accounts/savePayment", data, this.httpOptions)
	}
	getPayout(id: any) {
		return this.httpClient.get(Helpers.composeEnvUrl() + "internal/accounts/getPayout/" + id, this.httpOptions)
	}
	processPayout(data: any) {
		return this.httpClient.post(Helpers.composeEnvUrl() + "internal/accounts/processPayout", data, this.httpOptions)
	}
	updatePayoutStatus(data: any) {
		return this.httpClient.post(Helpers.composeEnvUrl() + "internal/accounts/updatePayoutStatus", data, this.httpOptions)
	}
	savePayout(data: any) {
		return this.httpClient.post(Helpers.composeEnvUrl() + "internal/accounts/savePayout", data, this.httpOptions)
	}
	savePayoutEntry(data: any) {
		return this.httpClient.post(Helpers.composeEnvUrl() + "internal/accounts/savePayoutEntry", data, this.httpOptions)
	}
	savePayinEntry(data: any) {
		return this.httpClient.post(Helpers.composeEnvUrl() + "internal/accounts/savePayinEntry", data, this.httpOptions)
	}
	mapBillsQueue(data: any) {
		return this.httpClient.post(Helpers.composeEnvUrl() + "internal/accounts/mapBillsQueue", data, this.httpOptions)
	}

	listInvoiceServices(data: any) {
		return this.httpClient.post(Helpers.composeEnvUrl() + "internal/accounts/listInvoiceServices", data, this.httpOptions)
	}
	saveInvoiceService(data: any) {
		return this.httpClient.post(Helpers.composeEnvUrl() + "internal/accounts/saveInvoiceService", data, this.httpOptions)
	}

	listServicePayments(data: any) {
		return this.httpClient.post(Helpers.composeEnvUrl() + "internal/accounts/listServicePayments", data, this.httpOptions)
	}
	saveServicePayment(data: any) {
		return this.httpClient.post(Helpers.composeEnvUrl() + "internal/accounts/saveServicePayment", data, this.httpOptions)
	}
	saveServiceBill(data: any) {
		return this.httpClient.post(Helpers.composeEnvUrl() + "internal/accounts/saveServiceBill", data, this.httpOptions)
	}
	raiseServiceBills(data: any) {
		return this.httpClient.post(Helpers.composeEnvUrl() + "internal/accounts/raiseServiceBills", data, this.httpOptions)
	}
	listServiceBills(data: any) {
		return this.httpClient.post(Helpers.composeEnvUrl() + "internal/accounts/listServiceBills", data, this.httpOptions)
	}
	searchPurchaseOrders(data: any) {
		return this.httpClient.post(Helpers.composeEnvUrl() + "internal/accounts/searchPurchaseOrders", data, this.httpOptions)
	}
	searchUnPaidBills(data: any) {
		return this.httpClient.post(Helpers.composeEnvUrl() + "internal/accounts/searchUnPaidBills", data, this.httpOptions)
	}
}