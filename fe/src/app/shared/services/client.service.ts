import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
import { HttpClient } from "@angular/common/http";
import { Helpers } from "../../helpers";

import * as _ from "lodash";

declare let $: any;
@Injectable()
export class ClientService {
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
	
	listCompanies(data: any) {
		return this.httpClient.post(Helpers.composeEnvUrl() + "client/listCompanies", data, this.httpOptions)
	}
	getDashboard(id: any) {
		return this.httpClient.get(Helpers.composeEnvUrl() + "client/getDashboard/" + id, this.httpOptions)
	}
	getBooking(id: any) {
		return this.httpClient.get(Helpers.composeEnvUrl() + "client/getBooking/" + id, this.httpOptions)
	}
	getBookings(id: any) {
		return this.httpClient.get(Helpers.composeEnvUrl() + "client/getBookings/" + id, this.httpOptions)
	}
	listVisits(data: any) {
		return this.httpClient.post(Helpers.composeEnvUrl() + "client/listVisits", data, this.httpOptions)
	}
	listVisitors(data: any) {
		return this.httpClient.post(Helpers.composeEnvUrl() + "client/listVisitors", data, this.httpOptions)
	}
	listSubscriptions(data: any) {
		return this.httpClient.post(Helpers.composeEnvUrl() + "client/listSubscriptions", data, this.httpOptions)
	}
}