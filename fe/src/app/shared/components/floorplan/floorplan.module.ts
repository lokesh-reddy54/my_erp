import { NgModule } from '@angular/core';
import { FloorPlanComponent } from './floorplan.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        NgxPaginationModule,
        PerfectScrollbarModule
    ],
    declarations: [FloorPlanComponent],
    exports: [FloorPlanComponent]
})
export class FloorPlanModule {

}
