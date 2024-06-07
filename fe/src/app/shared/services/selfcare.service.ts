import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
import { HttpClient } from "@angular/common/http";
import { Helpers } from "../../helpers";

import * as _ from "lodash";

declare let $: any;
@Injectable()
export class SelfcareService {
	httpOptions;

	constructor(private httpClient: HttpClient) {
		this.httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json'
			})
		};
	}

	getInitData(id: any) {
		return this.httpClient.get(Helpers.composeEnvUrl() + "internal/selfcare/getInitData/" + id, this.httpOptions)
	}
	requestOTP(data: any) {
		return this.httpClient.post(Helpers.composeEnvUrl() + "internal/selfcare/requestOTP", data, this.httpOptions)
	}
	verifyOTP(data: any) {
		return this.httpClient.post(Helpers.composeEnvUrl() + "internal/selfcare/verifyOTP", data, this.httpOptions)
	}
	acceptFinalStatement(data: any) {
		return this.httpClient.post(Helpers.composeEnvUrl() + "internal/selfcare/acceptFinalStatement", data, this.httpOptions)
	}
}