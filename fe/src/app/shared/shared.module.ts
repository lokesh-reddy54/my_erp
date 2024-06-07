import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { ToastrModule } from 'ngx-toastr';
import { LaddaModule } from 'angular2-ladda';
import { TagInputModule } from 'ngx-chips';
import { NgBootstrapFormValidationModule } from 'ng-bootstrap-form-validation';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FroalaEditorModule, FroalaViewModule } from 'angular-froala-wysiwyg';
import { AgmCoreModule } from '@agm/core';
import { NgImageSliderModule } from 'ng-image-slider';

import { SearchModule } from './components/search/search.module';
import { SharedComponentsModule } from './components/shared-components.module';
import { SharedDirectivesModule } from './directives/shared-directives.module';
import { SharedPipesModule } from './pipes/shared-pipes.module';

import { ComposeDialogComponent } from 'src/app/modules/admin/mails/compose-dialog/compose-dialog.component';
import { NewBookingComponent } from 'src/app/modules/bookings/new-booking/new-booking.component';
import { ResourceBookingComponent } from 'src/app/modules/bookings/resource-booking/new-booking.component';
import { ParkingComponent } from '../modules/bookings/new-parking/new-parking.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        PerfectScrollbarModule,
        SearchModule,
        TagInputModule,
        ToastrModule.forRoot(),
        NgbModule,
        AgmCoreModule.forRoot({
            apiKey: 'AIzaSyAzBN8iPuHozGxmFSxjxJuYPwodzrm6AeQ'
        }),
        LaddaModule.forRoot({ style: 'expand-left' }),
        FroalaEditorModule.forRoot(),
        FroalaViewModule.forRoot(),
        NgImageSliderModule,
        SharedComponentsModule,
        SharedDirectivesModule,
        SharedPipesModule,
        RouterModule,
        NgBootstrapFormValidationModule,
        NgSelectModule
    ],
    declarations: [ComposeDialogComponent, NewBookingComponent, ParkingComponent, ResourceBookingComponent],
    entryComponents: [ComposeDialogComponent, NewBookingComponent, ParkingComponent, ResourceBookingComponent]
})
export class SharedModule { }
