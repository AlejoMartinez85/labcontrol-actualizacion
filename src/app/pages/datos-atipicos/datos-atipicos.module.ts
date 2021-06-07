import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { ChartModule } from '../../theme/chart/chart.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { SelectModule } from 'ng-select';
import { NgApexchartsModule } from 'ng-apexcharts';
import { DatosAtipicosComponent } from './datos-atipicos/datos-atipicos.component';
import { DatosAtipicosverComponent } from './datos-atipicosver/datos-atipicosver.component';
import { DatosAtipicosRoutingModule } from './datos-atipicos.routing.module';
import { CrearMatrizDatosAtipicosComponent } from '../crear-matriz-datos-atipicos/crear-matriz-datos-atipicos/crear-matriz-datos-atipicos.component';

@NgModule({
  imports: [
    CommonModule,
    DatosAtipicosRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    ChartModule,
    NgxDatatableModule,
    SelectModule,
    NgApexchartsModule
  ],
  declarations: [
      DatosAtipicosComponent,
      DatosAtipicosverComponent,
      CrearMatrizDatosAtipicosComponent
  ]
})
export class DatosAtipicosModule { }
