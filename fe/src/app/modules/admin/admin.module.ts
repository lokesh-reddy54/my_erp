import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FileUploadModule } from 'ng2-file-upload';
import { NgxEchartsModule } from 'ngx-echarts';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgBootstrapFormValidationModule } from 'ng-bootstrap-form-validation';
import { NgSelectModule } from '@ng-select/ng-select';
import { ToastrModule } from 'ngx-toastr';
import { LaddaModule } from 'angular2-ladda';
import { TagInputModule } from 'ngx-chips';
import { Ng5SliderModule } from 'ng5-slider';
import { AgmCoreModule } from '@agm/core';
// import { NgxGalleryModule } from 'ngx-gallery-9';
import { NgImageSliderModule } from 'ng-image-slider';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { FloorPlanModule } from 'src/app/shared/components/floorplan/floorplan.module';
import { SharedPipesModule } from 'src/app/shared/pipes/shared-pipes.module';
import { SharedComponentsModule } from 'src/app/shared/components/shared-components.module';
import { SharedDirectivesModule } from 'src/app/shared/directives/shared-directives.module';
import { DashboardRoutingModule } from './admin-routing.module';

import { AdminCompanyComponent } from './company/view.component';
import { AdminClientCompaniesComponent } from './clientcompanies/view.component';
import { AdminUsersComponent } from './users/users.component';
import { AdminOfficesComponent } from './offices/offices.component';
import { AdminPropertiesComponent } from './property-contracting/properties.component';
import { AdminLocationsComponent } from './locations/locations.component';
import { AdminFacilitiesComponent } from './facilities/facilities.component';
import { MailsComponent } from './mails/mails.component';
import { AdminSMSComponent } from './sms/sms.component';
import { AdminExternalSystemsComponent } from './externalsystems/externalsystems.component';
import { AdminHelpNotesComponent } from './helpnotes/view.component';
import { AdminSchedulerComponent } from './scheduler/view.component';
import { AdminPettyCashAccountsComponent } from './pettycash-accounts/list.component';
import { AdminDebitCardAccountsComponent } from './debitcard-accounts/list.component';
import { ChatComponent } from './chat/chat/chat.component';
import { ChatLeftSidebarComponent } from './chat/chat-left-sidebar/chat-left-sidebar.component';
import { ChatContentsComponent } from './chat/chat-contents/chat-contents.component';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		FileUploadModule,
		ReactiveFormsModule,
		NgxPaginationModule,
		NgxDatatableModule,
		TagInputModule,
		NgSelectModule,
		NgBootstrapFormValidationModule,
		LaddaModule.forRoot({ style: 'expand-left' }),
		NgbModule,
		ToastrModule,
		PerfectScrollbarModule,
		NgxEchartsModule,
		SharedPipesModule,
		SharedDirectivesModule,
		SharedComponentsModule,
		FloorPlanModule,
		AgmCoreModule,
		NgImageSliderModule,
		Ng5SliderModule,
		// NgxGalleryModule,
		DashboardRoutingModule
	],
	declarations: [AdminUsersComponent, AdminOfficesComponent, AdminLocationsComponent, MailsComponent, 
		AdminCompanyComponent, AdminPettyCashAccountsComponent,AdminDebitCardAccountsComponent,
		AdminSMSComponent, AdminFacilitiesComponent, AdminExternalSystemsComponent, AdminHelpNotesComponent, 
		AdminSchedulerComponent, AdminPropertiesComponent, AdminClientCompaniesComponent,
		ChatComponent, ChatLeftSidebarComponent, ChatContentsComponent
	],
	entryComponents: []
})
export class AdminModule { }
