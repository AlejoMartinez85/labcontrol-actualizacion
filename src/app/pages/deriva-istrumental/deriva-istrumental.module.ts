import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { ChartModule } from '../../theme/chart/chart.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { SelectModule } from 'ng-select';
import { NgApexchartsModule } from 'ng-apexcharts';
import { DerivaInstrumentalComponent } from './deriva-instrumental/deriva-instrumental.component';
import { CrearDerivaInstrumentalComponent } from './crear-deriva-instrumental/crear-deriva-instrumental.component';
import { VerDerivaInstrumentalComponent } from './ver-deriva-instrumental/ver-deriva-instrumental.component';
import { DerivadaIstrumentalRoutingModule } from './deriva-istrumental.routimg.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    DerivadaIstrumentalRoutingModule,
    ReactiveFormsModule,
    SharedModule,
    ChartModule,
    NgxDatatableModule,
    SelectModule,
    NgApexchartsModule
  ],
  declarations: [
    DerivaInstrumentalComponent,
    CrearDerivaInstrumentalComponent,
    VerDerivaInstrumentalComponent
  ]
})
export class DerivadaIstrumentalModule { }
