import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { ChartModule } from '../../theme/chart/chart.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { SelectModule } from 'ng-select';
import { CondicionesAmbientalesComponent } from './condiciones-ambientales/condiciones-ambientales.component';
import { CondicionesAmbientalesVerComponent } from './condiciones-ambientales-ver/condiciones-ambientales-ver.component';
import { CondicionesAmbientalesRoutingModule } from './condiciones-ambientales.routing.module';
import { NgApexchartsModule } from 'ng-apexcharts';
import { JsonDatePipePipe } from '../../pipes/json-date-pipe.pipe';
import { DatePipe } from '@angular/common';
@NgModule({
  imports: [
    CommonModule,
    CondicionesAmbientalesRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    ChartModule,
    NgxDatatableModule,
    SelectModule,
    NgApexchartsModule
  ],
  declarations: [
      CondicionesAmbientalesComponent,
      CondicionesAmbientalesVerComponent,
      JsonDatePipePipe
  ],
  providers:[DatePipe]
})
export class CondicionesAmbientalesModule { }
