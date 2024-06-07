import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
import { HttpClient } from "@angular/common/http";
import { Helpers } from "../../helpers";

import * as _ from "lodash";

declare let $: any;
@Injectable()
export class DashboardsService {
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

	getBuildingMetrics(data: any) {
		return this.httpClient.post(Helpers.composeEnvUrl() + "internal/dashboards/getBuildingMetrics", data, this.httpOptions)
	}
	getExpensesDashboard(data: any) {
		return this.httpClient.post(Helpers.composeEnvUrl() + "internal/dashboards/getExpensesDashboard", data, this.httpOptions)
	}
	getCapexDashboard(data: any) {
		return this.httpClient.post(Helpers.composeEnvUrl() + "internal/dashboards/getCapexDashboard", data, this.httpOptions)
	}
	getRevenueDashboard(data: any) {
		return this.httpClient.post(Helpers.composeEnvUrl() + "internal/dashboards/getRevenueDashboard", data, this.httpOptions)
	}
	getProfitandLossDashboard(data: any) {
		return this.httpClient.post(Helpers.composeEnvUrl() + "internal/dashboards/getProfitandLossDashboard", data, this.httpOptions)
	}

	getAccountsCards(data: any) {
		return this.httpClient.post(Helpers.composeEnvUrl() + "internal/dashboards/getAccountsCards", data, this.httpOptions)
	}
	getAccountsCardsList(data: any) {
		return this.httpClient.post(Helpers.composeEnvUrl() + "internal/dashboards/getAccountsCardsList", data, this.httpOptions)
	}
}