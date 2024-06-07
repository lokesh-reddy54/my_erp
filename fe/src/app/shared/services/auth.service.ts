import { Injectable } from "@angular/core";
import { LocalStoreService } from "./local-store.service";
import { Router } from "@angular/router";
import { of, Observable, Subject } from "rxjs";
import { delay } from "rxjs/operators";
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Helpers } from "../../helpers";
import { NavigationService, IMenuItem, IChildItem } from 'src/app/shared/services/navigation.service';
import { DialogsService } from "./dialogs.services";
import { AdminService } from "./admin.service";
import * as _ from "lodash";

declare let webpushr: any;

@Injectable({
  providedIn: "root"
})
export class AuthService {
  //Only for demo purpose
  authenticated = false;
  httpOptions: any = {};
  myBookings: any = [];
  userRoles: any = [];
  buildings: any = [];
  userRole: any = new Subject<any>();
  selectedBuilding: any = new Subject<any>();

  constructor(private store: LocalStoreService, private dialogsService: DialogsService, public navService: NavigationService,
    private router: Router, private httpClient: HttpClient, private adminService: AdminService) {
    this.checkAuth();
  }

  getUserRole(): Observable<any> {
    return this.userRole.asObservable();
  }
  getBuilding(): Observable<any> {
    return this.selectedBuilding.asObservable();
  }

  checkAuth() {
    var user: any = this.store.getItem("cwo_user") || {};
    if (user.id) {
      this.authenticated = true;
      var user = JSON.parse(localStorage.getItem("cwo_user"));
      var companyId = user && user.companyId ? user.companyId : 1;
      this.httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': user && user.token,
          'companyid': companyId + ""
        })
      };

      var data = { filters: { email: user.email } };
      var promise = this.httpClient.post(Helpers.composeEnvUrl() + "client/authenticate", data);
      promise.subscribe(
        res => {
          if (res['data']) {
            if (res['data']['id'] > 0) {
              this.authenticated = true;
              this.store.setItem("cwo_user", res['data']);
              user = res['data'];
              console.log("AuthService :: user : ", user);
              var self = this;
              if (webpushr) {
                webpushr('fetch_id', function(sid) {
                  console.log('webpushr subscriber id: ' + sid);
                  var data: any = {
                    id: user.id
                  }
                  if (self.detectMob()) {
                    data.mobilePushId = sid || null;
                  } else {
                    data.webPushId = sid || null;
                  }
                  self.adminService.saveUser(data).subscribe();
                });
              }
              var userType = 'admin';
              if (user.clientId) {
                userType = 'client';
              }
              this.navService.publishNavigationChange(userType, user.roles);
            } else {
              this.signout();
              this.dialogsService.error(res['error']['message'], "Authentication Failed")
            }
          } else if (res['error']) {
            this.signout();
            this.dialogsService.error(res['error']['message'], "Authentication Failed")
          }
        }, err => {

        })
    } else {
      this.authenticated = false;
    }
  }

  signin(credentials) {
    var password = _.clone(credentials.password);
    password = window.btoa(password);
    var data = {
      filters: { email: credentials.email, password: password }
    }
    if (credentials.otpVerified) {
      data = credentials;
    }
    var promise = this.httpClient.post(Helpers.composeEnvUrl() + "client/authenticate", data);
    promise.subscribe(
      res => {
        if (res['data']) {
          if (res['data']['id'] > 0) {
            this.authenticated = true;
            this.store.setItem("cwo_user", res['data']);
            if (res['data']['clientId']) {
              this.router.navigateByUrl('/client/dashboard');
            } else if (this.detectMob()) {
              this.router.navigateByUrl('/mobile/dashboard');
            } else {
              /////////////////////////////////////////////
              var userType = "admin";
              if (res["data"].clientId) {
                userType = "client";
              }
              this.navService.publishNavigationChange(
                userType,
                res["data"].roles
              );
              //////////////////////////////////////////////////////////

              this.router.navigateByUrl('/dashboards/main');
            }
          } else {
            this.dialogsService.error("Invalid login credentials , please try again", "Authentication Failed")
          }
        } else if (res['error']) {
          this.dialogsService.error(res['error']['message'], "Authentication Failed")
        }
      }, err => {

      })
    return of({}).pipe(delay(1000));
  }

  detectMob() {
    var isMobile = {
      Android: function() {
        return navigator.userAgent.match(/Android/i);
      },
      BlackBerry: function() {
        return navigator.userAgent.match(/BlackBerry/i);
      },
      iOS: function() {
        return navigator.userAgent.match(/iPhone|iPad|iPod/i);
      },
      Opera: function() {
        return navigator.userAgent.match(/Opera Mini/i);
      },
      Windows: function() {
        return navigator.userAgent.match(/IEMobile/i) || navigator.userAgent.match(/WPDesktop/i);
      },
      any: function() {
        return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
      }
    };

    return isMobile.any();
  }

  signout() {
    this.authenticated = false;
    this.store.setItem("cwo_user", false);
    this.router.navigateByUrl("/sessions/signin");
  }
}
