import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
import { HttpClient } from "@angular/common/http";
import { Helpers } from "../../helpers";

import * as _ from "lodash";

declare let $: any;
@Injectable()
export class ReportsService {
	httpOptions;

	constructor(private httpClient: HttpClient) {
		if (localStorage.getItem("cwo_user") && localStorage.getItem("cwo_user") != "") {
			var user = JSON.parse(localStorage.getItem("cwo_user"));
			var companyId = user && user.companyId ? user.companyId : 1;
			var headers = {
				'Content-Type': 'application/json',
				'companyid': companyId + ""
			}
			if (user && user.token) {
				headers['Authorization'] = user.token;
			}
			this.httpOptions = {
				headers: new HttpHeaders(headers)
			};
		} else {
			this.httpOptions = {
				headers: new HttpHeaders({
					'Content-Type': 'application/json'
				})
			}
		}
	}

	listTdsDueClients(data: any) {
		return this.httpClient.post(Helpers.composeEnvUrl() + "internal/reports/listTdsDueClients", data, this.httpOptions)
	}
	listCustomers(data: any) {
		return this.httpClient.post(Helpers.composeEnvUrl() + "internal/reports/listCustomers", data, this.httpOptions)
	}
	listVendors(data: any) {
		return this.httpClient.post(Helpers.composeEnvUrl() + "internal/reports/listVendors", data, this.httpOptions)
	}
	listProducts(data: any) {
		return this.httpClient.post(Helpers.composeEnvUrl() + "internal/reports/listProducts", data, this.httpOptions)
	}
	getRevenueInvoices(data: any) {
		return this.httpClient.post(Helpers.composeEnvUrl() + "internal/reports/getRevenueInvoices", data, this.httpOptions)
	}
	getExpenseBills(data: any) {
		return this.httpClient.post(Helpers.composeEnvUrl() + "internal/reports/getExpenseBills", data, this.httpOptions)
	}
	listActivities(data: any) {
		return this.httpClient.post(Helpers.composeEnvUrl() + "internal/reports/listActivities", data, this.httpOptions)
	}
	getExpenses(data: any) {
		return this.httpClient.post(Helpers.composeEnvUrl() + "internal/reports/getExpenses", data, this.httpOptions)
	}
	getBills(data: any) {
		return this.httpClient.post(Helpers.composeEnvUrl() + "internal/reports/getBills", data, this.httpOptions)
	}
	getRevenue(data: any) {
		return this.httpClient.post(Helpers.composeEnvUrl() + "internal/reports/getRevenue", data, this.httpOptions)
	}
	getSupportReport(data: any) {
		return this.httpClient.post(Helpers.composeEnvUrl() + "internal/reports/getSupport", data, this.httpOptions)
	}
	getLiability(data: any) {
		return this.httpClient.post(Helpers.composeEnvUrl() + "internal/reports/getLiability", data, this.httpOptions)
	}
	getProductsAnalysis(data: any) {
		return this.httpClient.post(Helpers.composeEnvUrl() + "internal/reports/getProductsAnalysis", data, this.httpOptions)
	}
	getAR(data: any) {
		return this.httpClient.post(Helpers.composeEnvUrl() + "internal/reports/getAR", data, this.httpOptions)
	}
	getInvoiceSummery (data: any) {
		return this.httpClient.post(Helpers.composeEnvUrl() + "internal/reports/getInvoiceSummery", data, this.httpOptions)
	}
	getTDSAP(data: any) {
		return this.httpClient.post(Helpers.composeEnvUrl() + "internal/reports/getTDSAP", data, this.httpOptions)
	}
	getTDSAR(data: any) {
		return this.httpClient.post(Helpers.composeEnvUrl() + "internal/reports/getTDSAR", data, this.httpOptions)
	}
	sendTDSARNotifications(data: any) {
		return this.httpClient.post(Helpers.composeEnvUrl() + "internal/reports/sendTDSARNotifications", data, this.httpOptions)
	}
	getAvailability(data: any) {
		return this.httpClient.post(Helpers.composeEnvUrl() + "internal/reports/getAvailability", data, this.httpOptions)
	}
	listArCallHistory(data: any) {
		return this.httpClient.post(Helpers.composeEnvUrl() + "internal/reports/listArCallHistory", data, this.httpOptions)
	}
	saveArCallHistory(data: any) {
		return this.httpClient.post(Helpers.composeEnvUrl() + "internal/reports/saveArCallHistory", data, this.httpOptions)
	}
	getUserDashboards(data: any) {
		return this.httpClient.post(Helpers.composeEnvUrl() + "internal/reports/getUserDashboards", data, this.httpOptions)
	}
	getClientDashboards(data: any) {
		return this.httpClient.post(Helpers.composeEnvUrl() + "internal/reports/getClientDashboards", data, this.httpOptions)
	}
	getWorkBenches(data: any) {
		return this.httpClient.post(Helpers.composeEnvUrl() + "internal/reports/getWorkBenches", data, this.httpOptions)
	}
	loadBuildingBookings(data: any) {
		return this.httpClient.post(Helpers.composeEnvUrl() + "internal/reports/loadBuildingBookings", data, this.httpOptions)
	}
	loadBuildingTickets(data: any) {
		return this.httpClient.post(Helpers.composeEnvUrl() + "internal/reports/loadBuildingTickets", data, this.httpOptions)
	}
	getTicketsByStatus(data: any) {
		return this.httpClient.post(Helpers.composeEnvUrl() + "internal/reports/getTicketsByStatus", data, this.httpOptions)
	}
	loadBuildingPurchaseOrders(data: any) {
		return this.httpClient.post(Helpers.composeEnvUrl() + "internal/reports/loadBuildingPurchaseOrders", data, this.httpOptions)
	}
	getPurchaseOrdersByStatus(data: any) {
		return this.httpClient.post(Helpers.composeEnvUrl() + "internal/reports/getPurchaseOrdersByStatus", data, this.httpOptions)
	}
	loadBuildingWorkOrders(data: any) {
		return this.httpClient.post(Helpers.composeEnvUrl() + "internal/reports/loadBuildingWorkOrders", data, this.httpOptions)
	}
	getWorkOrdersByStatus(data: any) {
		return this.httpClient.post(Helpers.composeEnvUrl() + "internal/reports/getWorkOrdersByStatus", data, this.httpOptions)
	}
	getBillsByStatus(data: any) {
		return this.httpClient.post(Helpers.composeEnvUrl() + "internal/reports/getBillsByStatus", data, this.httpOptions)
	}
	loadBuildingProjects(data: any) {
		return this.httpClient.post(Helpers.composeEnvUrl() + "internal/reports/loadBuildingProjects", data, this.httpOptions)
	}
	getProjectsByStatus(data: any) {
		return this.httpClient.post(Helpers.composeEnvUrl() + "internal/reports/getProjectsByStatus", data, this.httpOptions)
	}
	loadBuildingBills(data: any) {
		return this.httpClient.post(Helpers.composeEnvUrl() + "internal/reports/loadBuildingBills", data, this.httpOptions)
	}
	getBillsQueueByStatus(data: any) {
		return this.httpClient.post(Helpers.composeEnvUrl() + "internal/reports/getBillsQueueByStatus", data, this.httpOptions)
	}
	loadBuildingBillsQueue(data: any) {
		return this.httpClient.post(Helpers.composeEnvUrl() + "internal/reports/loadBuildingBillsQueue", data, this.httpOptions)
	}
	getPurchaseBuilingWisePayables(data: any) {
		return this.httpClient.post(Helpers.composeEnvUrl() + "internal/reports/getPurchaseBuilingWisePayables", data, this.httpOptions)
	}
	getPurchaseDueMilestones(data: any) {
		return this.httpClient.post(Helpers.composeEnvUrl() + "internal/reports/getPurchaseDueMilestones", data, this.httpOptions)
	}
}