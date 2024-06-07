import { NgModule } from '@angular/core';
import { SearchComponent } from './search.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { CommonModule } from '@angular/common';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { LaddaModule } from 'angular2-ladda';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgBootstrapFormValidationModule } from 'ng-bootstrap-form-validation';
import { NgSelectModule } from '@ng-select/ng-select';
import { SharedPipesModule } from 'src/app/shared/pipes/shared-pipes.module';
import { SharedDirectivesModule } from 'src/app/shared/directives/shared-directives.module';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        NgxPaginationModule,
        PerfectScrollbarModule,
        LaddaModule,
        SharedPipesModule,
        NgbModule,
        NgBootstrapFormValidationModule,
        NgSelectModule,
        RouterModule,
        SharedDirectivesModule
    ],
    declarations: [SearchComponent],
    exports: [SearchComponent]
})
export class SearchModule {

}
