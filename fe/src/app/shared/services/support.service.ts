import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
import { HttpClient } from "@angular/common/http";
import { Helpers } from "../../helpers";

import * as _ from "lodash";

declare let $: any;
@Injectable()
export class SupportService {
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

	listTickets(data: any) {
		return this.httpClient.post(Helpers.composeEnvUrl() + "internal/support/listTickets", data, this.httpOptions)
	}
	saveTicket(data: any) {
		return this.httpClient.post(Helpers.composeEnvUrl() + "internal/support/saveTicket", data, this.httpOptions)
	}
	saveTicketMessage(data: any) {
		return this.httpClient.post(Helpers.composeEnvUrl() + "internal/support/saveTicketMessage", data, this.httpOptions)
	}
	getTicket(id: any) {
		return this.httpClient.get(Helpers.composeEnvUrl() + "internal/support/getTicket/" + id, this.httpOptions)
	}
	deleteTicket(id: any) {
		return this.httpClient.get(Helpers.composeEnvUrl() + "internal/support/deleteTicket/" + id, this.httpOptions)
	}
	assignTicket(id: any) {
		return this.httpClient.get(Helpers.composeEnvUrl() + "internal/support/assignTicket/" + id, this.httpOptions)
	}

	getCategories() {
		return this.httpClient.post(Helpers.composeEnvUrl() + "internal/support/getCategories", this.httpOptions)
	}
	getPriorities() {
		return this.httpClient.post(Helpers.composeEnvUrl() + "internal/support/getPriorities", this.httpOptions)
	}
	getSupportUsers(data: any) {
		return this.httpClient.post(Helpers.composeEnvUrl() + "internal/support/getSupportUsers", data, this.httpOptions)
	}
	getManagerUsers(data: any) {
		return this.httpClient.post(Helpers.composeEnvUrl() + "internal/support/getManagerUsers", data, this.httpOptions)
	}
	saveTicketCategory(data: any) {
		return this.httpClient.post(Helpers.composeEnvUrl() + "internal/support/saveTicketCategory", data, this.httpOptions)
	}
	saveTicketSubCategory(data: any) {
		return this.httpClient.post(Helpers.composeEnvUrl() + "internal/support/saveTicketSubCategory", data, this.httpOptions)
	}
	saveTicketContext(data: any) {
		return this.httpClient.post(Helpers.composeEnvUrl() + "internal/support/saveTicketContext", data, this.httpOptions)
	}
	savePriority(data: any) {
		return this.httpClient.post(Helpers.composeEnvUrl() + "internal/support/savePriority", data, this.httpOptions)
	}
}