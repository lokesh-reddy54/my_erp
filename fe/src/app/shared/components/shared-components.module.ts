import { NgModule} from '@angular/core';
import { HttpModule } from '@angular/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgxChartsModule } from '@swimlane/ngx-charts';

import { LoadingComponent } from './loading/loading.component';
import { EditorComponent } from './editor/editor.component';
import { BtnLoadingComponent } from './btn-loading/btn-loading.component';
import { DataListComponent } from './data-list/datalist.component';
import { FeatherIconComponent } from './feather-icon/feather-icon.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedPipesModule } from '../pipes/shared-pipes.module';
import { FloorPlanModule } from './floorplan/floorplan.module';
import { SearchModule } from './search/search.module';
import { HelpNotesComponent } from './help-notes/view.component';
import { CardSuggestionComponent } from './card-suggestion/view.component';
import { SharedDirectivesModule } from '../directives/shared-directives.module';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { LayoutsModule } from './layouts/layouts.module';
import { ComboChartComponent } from './combo-charts/combo-chart.component';
import { ComboSeriesVerticalComponent } from './combo-charts/combo-series-vertical.component';

const components = [
  LoadingComponent,
  EditorComponent,
  BtnLoadingComponent,
  FeatherIconComponent,
  DataListComponent,
  HelpNotesComponent,
  CardSuggestionComponent,
  ComboChartComponent,
  ComboSeriesVerticalComponent
];

@NgModule({
  imports: [
    CommonModule,
    HttpModule,
    FormsModule,
    RouterModule,
    LayoutsModule,
    SharedPipesModule,
    SharedDirectivesModule,
    SearchModule,
    FloorPlanModule,
    PerfectScrollbarModule,
    NgxChartsModule,
    NgbModule
  ],
  declarations: components,
  exports: components
})
export class SharedComponentsModule { }
