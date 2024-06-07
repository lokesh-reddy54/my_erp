import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
import { HttpClient } from "@angular/common/http";
import { Helpers } from "../../helpers";

import * as _ from "lodash";

declare let $: any;
@Injectable()
export class LeadsService {
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

	listLeads(data: any) {
		return this.httpClient.post(Helpers.composeEnvUrl() + "internal/leads/listLeads", data, this.httpOptions)
	}
	saveLead(data: any) {
		return this.httpClient.post(Helpers.composeEnvUrl() + "internal/leads/saveLead", data, this.httpOptions)
	}
	saveLeadCall(data: any) {
		return this.httpClient.post(Helpers.composeEnvUrl() + "internal/leads/saveLeadCall", data, this.httpOptions)
	}
	saveLeadComment(data: any) {
		return this.httpClient.post(Helpers.composeEnvUrl() + "internal/leads/saveLeadComment", data, this.httpOptions)
	}
	saveLeadProposition(data: any) {
		return this.httpClient.post(Helpers.composeEnvUrl() + "internal/leads/saveLeadProposition", data, this.httpOptions)
	}
	saveLeadVisit(data: any) {
		return this.httpClient.post(Helpers.composeEnvUrl() + "internal/leads/saveLeadVisit", data, this.httpOptions)
	}
	getLead(id: any) {
		return this.httpClient.get(Helpers.composeEnvUrl() + "internal/leads/getLead/" + id, this.httpOptions)
	}
	getLeadPropositions(id: any) {
		return this.httpClient.post(Helpers.composeEnvUrl() + "internal/leads/getLeadPropositions/" + id,{}, this.httpOptions)
	}
	getLeadCalls(id: any) {
		return this.httpClient.post(Helpers.composeEnvUrl() + "internal/leads/getLeadCalls/" + id, {}, this.httpOptions)
	}
	getLeadVisits(id: any) {
		return this.httpClient.post(Helpers.composeEnvUrl() + "internal/leads/getLeadVisits/" + id,{}, this.httpOptions)
	}
	updateLeadPropositions(id: any) {
		return this.httpClient.get(Helpers.composeEnvUrl() + "internal/leads/updateLeadPropositions/" + id, this.httpOptions)
	}
	sendLeadPropositions(id: any) {
		return this.httpClient.get(Helpers.composeEnvUrl() + "internal/leads/sendLeadPropositions/" + id, this.httpOptions)
	}

	createPropositionQuote(data: any) {
		return this.httpClient.post(Helpers.composeEnvUrl() + "internal/leads/createPropositionQuote", data, this.httpOptions)
	}
	copyPropositionQuote(data: any) {
		return this.httpClient.post(Helpers.composeEnvUrl() + "internal/leads/copyPropositionQuote", data, this.httpOptions)
	}
	updatePropositionQuote(data: any) {
		return this.httpClient.post(Helpers.composeEnvUrl() + "internal/leads/updatePropositionQuote", data, this.httpOptions)
	}
	savePriceQuote(data: any) {
		return this.httpClient.post(Helpers.composeEnvUrl() + "internal/leads/savePriceQuote", data, this.httpOptions)
	}
	savePriceContract(data: any) {
		return this.httpClient.post(Helpers.composeEnvUrl() + "internal/leads/savePriceContract", data, this.httpOptions)
	}
	getPropositionQuotes(id: any) {
		return this.httpClient.get(Helpers.composeEnvUrl() + "internal/leads/getPropositionQuotes/" + id, this.httpOptions)
	}
	sendQuotationMail(data: any) {
		return this.httpClient.post(Helpers.composeEnvUrl() + "internal/leads/sendQuotationMail", data, this.httpOptions)
	}


	getVisits(data: any) {
		return this.httpClient.post(Helpers.composeEnvUrl() + "internal/leads/getVisits", data, this.httpOptions)
	}
	getVisit(id: any) {
		return this.httpClient.get(Helpers.composeEnvUrl() + "internal/leads/getVisit/" + id, this.httpOptions)
	}
}