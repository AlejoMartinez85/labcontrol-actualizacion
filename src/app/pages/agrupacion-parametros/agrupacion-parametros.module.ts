import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AgrupacionParametrosRoutingModule } from './agrupacion-parametros-routing.module';

import { AgrupacionParametrosIndexComponent } from './agrupacion-parametros-index/agrupacion-parametros-index.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { ChartModule } from '../../theme/chart/chart.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { SelectModule } from 'ng-select';
@NgModule({
  imports: [
    CommonModule,
    AgrupacionParametrosRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    ChartModule,
    NgxDatatableModule,
    SelectModule,
  ],
  declarations: [AgrupacionParametrosIndexComponent]
})
export class AgrupacionParametrosModule { }
