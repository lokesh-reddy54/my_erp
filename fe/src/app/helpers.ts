import {
  Component,
  OnInit,
  ViewEncapsulation,
  AfterViewInit,
  ViewChild,
} from "@angular/core";
import { environment } from "../environments/environment";
import { CommonService } from "src/app/shared/services/common.service";
import { HttpHeaders } from "@angular/common/http";

import * as $ from "jquery";

declare let mApp: any;
@Component({
  selector: "helpers",
  template: "",
})
export class Helpers {
  constructor(private commonService: CommonService) {}

  static processResponse(object, errorTitle) {
    if (object.data) {
      return object;
    } else {
      console.log("Helpers ::: processResponse :: response : ", object);
    }
  }

  static setTableLoading(enable) {
    let body = $("body");
    if (enable) {
      $(body).find(".card").addClass("card-refresh");
    } else {
      $(body).find(".card").removeClass("card-refresh");
    }
  }

  static composeEnvUrl() {
    // var url = "http://localhost:9000/v1/";
    if(environment.production == false){
      // environment.host +
      // "/" +
      // environment.version +
      // "/";
      var url = "https://uat-api.hustlehub.tech/v1/";
    }
    else{
    var url =
      environment.host +
      ":" +
      environment.port +
      "/" +
      environment.version +
      "/";}
    // console.log(url);
    // var url = "https://uat-api.hustlehub.tech/v1/";
    return url;
  }
  static composeApiUrl(host: string, port: number, version: string) {
    var url = host + ":" + port + "/" + version + "/";
    return url;
  }

  static removeBase64Header = function (baseString) {
    var endIdx = 0;
    var startIdx = baseString.indexOf("data:");
    if (startIdx == 0) {
      endIdx = baseString.indexOf("base64");
    }
    return baseString.substr(endIdx + 7);
  };

  static checkAccess(elements) {
    return CommonService.checkAccess(elements);
  }

  static trackById(index, item) {
    return item.id;
  }

  static rheaders() {
    if (
      localStorage.getItem("cwo_user") &&
      localStorage.getItem("cwo_user") != ""
    ) {
      var user = JSON.parse(localStorage.getItem("cwo_user"));
      var companyId = user && user.companyId ? user.companyId : 1;
      var headers = {
        "Content-Type": "application/json",
        companyid: companyId + "",
      };
      if (user && user.token) {
        headers["Authorization"] = user.token;
      }
      return {
        headers: new HttpHeaders(headers),
      };
    } else {
      return {
        headers: new HttpHeaders({
          "Content-Type": "application/json",
        }),
      };
    }
  }
}
