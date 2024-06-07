import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
import { HttpClient } from "@angular/common/http";
import { Helpers } from "../../helpers";

@Injectable({
	providedIn: 'root'
})
export class SearchService {
	public searchOpen: boolean;
	public callData: any;
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

	incomingCall(data) {
		this.searchOpen = true;
		this.callData = data;
	}

	globalSearch(phone: any) {
		return this.httpClient.get(Helpers.composeEnvUrl() + "internal/leads/globalSearch/" + phone, this.httpOptions)
	}

}
