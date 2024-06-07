import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { NgSelectModule } from "@ng-select/ng-select";
import { FroalaEditorModule, FroalaViewModule } from "angular-froala-wysiwyg";
import { HttpClientModule } from "@angular/common/http";
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { AppRoutingModule } from "./app-routing.module";
import { Helpers } from "./helpers";
import { AppComponent } from "./app.component";
import { SharedModule } from "./shared/shared.module";
import { InMemoryWebApiModule } from "angular-in-memory-web-api";
import { InMemoryDataService } from "./shared/inmemory-db/inmemory-db.service";
import { NgBootstrapFormValidationModule } from "ng-bootstrap-form-validation";
import { SocketIoModule, SocketIoConfig } from "ngx-socket-io";

const config: SocketIoConfig = {
  url: environment.socketUrl + ":" + environment.port,
  options: {},
};

import { environment } from "../environments/environment";

import { CommonService } from "./shared/services/common.service";
import { DialogsService } from "./shared/services/dialogs.services";
import { AdminService } from "./shared/services/admin.service";
import { BookingsService } from "./shared/services/bookings.service";
import { LeadsService } from "./shared/services/leads.service";
import { SupportService } from "./shared/services/support.service";
import { UploadService } from "./shared/services/upload.service";
import { SocketService } from "./shared/services/socket.service";
import { AccountsService } from "./shared/services/accounts.service";
import { SelfcareService } from "./shared/services/selfcare.service";
import { PgClientService } from "./shared/services/pgclient.service";
import { PurchasesService } from "./shared/services/purchases.service";
import { ClientService } from "./shared/services/client.service";
import { ReportsService } from "./shared/services/reports.service";
import { AssetsService } from "./shared/services/assets.service";
import { DashboardsService } from "./shared/services/dashboards.services";
import { ThirdPartyService } from "./shared/services/third-party.service";


@NgModule({
  declarations: [AppComponent, Helpers],
  imports: [
    BrowserModule,
    SharedModule,
    NgbModule,
    HttpClientModule,
    BrowserAnimationsModule,
    NgSelectModule,
    SocketIoModule.forRoot(config),
    NgBootstrapFormValidationModule.forRoot(),
    FroalaEditorModule.forRoot(),
    FroalaViewModule.forRoot(),
    InMemoryWebApiModule.forRoot(InMemoryDataService, {
      passThruUnknownUrl: true,
    }),
    AppRoutingModule,
  ],

  providers: [
    CommonService,
    AssetsService,
    AdminService,
    AccountsService,
    SelfcareService,
    PgClientService,
    PurchasesService,
    ClientService,
    BookingsService,
    LeadsService,
    SupportService,
    DialogsService,
    SocketService,
    UploadService,
    ReportsService,
    DashboardsService,
    ThirdPartyService,
    NgbActiveModal,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
