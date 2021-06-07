import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { ChartModule } from '../../theme/chart/chart.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { SelectModule } from 'ng-select';
import { CartasControlRoutingModule } from './cartas-control.routing.module';
import { CartasControlComponent } from './cartas-control/cartas-control.component';
import { CartasControlVerComponent } from './cartas-control-ver/cartas-control-ver.component';

@NgModule({
  imports: [
    CommonModule,
    CartasControlRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    ChartModule,
    NgxDatatableModule,
    SelectModule
  ],
  declarations: [
    CartasControlComponent,
    CartasControlVerComponent
  ]
})
export class CartasControlModule { }
