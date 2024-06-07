import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
import { HttpClient } from "@angular/common/http";
import { Helpers } from "../../helpers";

import * as _ from "lodash";

declare let $: any;
@Injectable()
export class ThirdPartyService {
	httpGstOptions;

	constructor(private httpClient: HttpClient) {

			this.httpGstOptions = {headers: new HttpHeaders(
				{'User-agent': 'Dalvik/2.1.0 (Linux; U; Android 10; SM-A920F Build/QP1A.190711.020)',
				'Referer': 'https://www.mastersindia.co/',
				'Origin': 'https://www.mastersindia.co',
				'Host': 'blog-backend.mastersindia.co'}
			)}
		
	}


	getGSTinfo(id: any) {
		return this.httpClient.get(`https://blog-backend.mastersindia.co/api/v1/custom/search/gstin/?keyword=${id}&unique_id=922581554c964de0b986ba509f116684`, this.httpGstOptions)
	}
	
	getCategories() {
		return this.httpClient.post(Helpers.composeEnvUrl() + "internal/support/getCategories", this.httpGstOptions)
	}
}