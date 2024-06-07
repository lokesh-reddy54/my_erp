import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
import { HttpClient } from "@angular/common/http";
import { Helpers } from "../../helpers";

import * as _ from "lodash";

declare let $: any;
@Injectable()
export class AssetsService {
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

	listStoreManagers(data: any) {
		return this.httpClient.post(Helpers.composeEnvUrl() + "internal/assets/listStoreManagers", data, this.httpOptions)
	}
	listStores(data: any) {
		return this.httpClient.post(Helpers.composeEnvUrl() + "internal/assets/listStores", data, this.httpOptions)
	}
	saveStore(data: any) {
		return this.httpClient.post(Helpers.composeEnvUrl() + "internal/assets/saveStore", data, this.httpOptions)
	}
	listBuildingAssets(data: any) {
		return this.httpClient.post(Helpers.composeEnvUrl() + "internal/assets/listBuildingAssets", data, this.httpOptions)
	}
	listProjectAssets(data: any) {
		return this.httpClient.post(Helpers.composeEnvUrl() + "internal/assets/listProjectAssets", data, this.httpOptions)
	}
	listAssetsRegistry(data: any) {
		return this.httpClient.post(Helpers.composeEnvUrl() + "internal/assets/listAssetsRegistry", data, this.httpOptions)
	}
	listAssetItems(data: any) {
		return this.httpClient.post(Helpers.composeEnvUrl() + "internal/assets/listAssetItems", data, this.httpOptions)
	}
	listStoreAssets(data: any) {
		return this.httpClient.post(Helpers.composeEnvUrl() + "internal/assets/listStoreAssets", data, this.httpOptions)
	}
	createAssetItems(data: any) {
		return this.httpClient.post(Helpers.composeEnvUrl() + "internal/assets/createAssetItems", data, this.httpOptions)
	}
	assignAssetItems(data: any) {
		return this.httpClient.post(Helpers.composeEnvUrl() + "internal/assets/assignAssetItems", data, this.httpOptions)
	}
	saveAsset(data: any) {
		return this.httpClient.post(Helpers.composeEnvUrl() + "internal/assets/saveAsset", data, this.httpOptions)
	}
	saveAssetItem(data: any) {
		return this.httpClient.post(Helpers.composeEnvUrl() + "internal/assets/saveAssetItem", data, this.httpOptions)
	}
	currentAssetItem(data: any) {
		return this.httpClient.post(Helpers.composeEnvUrl() + "internal/assets/currentAssetItem", data, this.httpOptions)
	}
	getAssets(data: any) {
		return this.httpClient.post(Helpers.composeEnvUrl() + "internal/assets/getAssets", data, this.httpOptions)
	}
	getAssetItem(id: any) {
		return this.httpClient.get(Helpers.composeEnvUrl() + "internal/assets/getAssetItem/" + id, this.httpOptions)
	}
	listAssetServiceProviders(data: any) {
		return this.httpClient.post(Helpers.composeEnvUrl() + "internal/assets/listAssetServiceProviders", data, this.httpOptions)
	}
	saveAssetServiceProvider(data: any) {
		return this.httpClient.post(Helpers.composeEnvUrl() + "internal/assets/saveAssetServiceProvider", data, this.httpOptions)
	}
	listAssetWarrenties(data: any) {
		return this.httpClient.post(Helpers.composeEnvUrl() + "internal/assets/listAssetWarrenties", data, this.httpOptions)
	}
	saveAssetWarrenty(data: any) {
		return this.httpClient.post(Helpers.composeEnvUrl() + "internal/assets/saveAssetWarrenty", data, this.httpOptions)
	}
	deleteHelpNote(id: any) {
		return this.httpClient.get(Helpers.composeEnvUrl() + "internal/assets/deleteHelpNote/" + id, this.httpOptions)
	}

}