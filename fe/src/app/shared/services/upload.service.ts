import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { HttpHeaders, HttpEventType, HttpClient } from '@angular/common/http';
import { Helpers } from "../../helpers";

import * as _ from "lodash";

declare let $: any;
@Injectable({
  providedIn: 'root'
})
export class UploadService {
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

	public upload(data) {
		return this.httpClient.post<any>(Helpers.composeEnvUrl() + "upload", data, {
			reportProgress: true,
			observe: 'events'
		}).pipe(map((event) => {

			switch (event.type) {

				case HttpEventType.UploadProgress:
					const progress = Math.round(100 * event.loaded / event.total);
					return { status: 'progress', message: progress };

				case HttpEventType.Response:
					return event.body;
				default:
					return `Unhandled event: ${event.type}`;
			}
		})
		);
	}
}
