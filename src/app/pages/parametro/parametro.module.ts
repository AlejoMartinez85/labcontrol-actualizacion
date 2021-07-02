import { ArchwizardModule } from 'ng2-archwizard';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ParametroRoutingModule } from './parametro-routing.module';
import { IndexComponent } from './index/index.component';
import { SharedModule } from '../../shared/shared.module';
import { ChartModule } from '../../theme/chart/chart.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { VerParametroComponent } from './ver-parametro/ver-parametro.component';
import { IncertidumbreModule } from '../incertidumbre/incertidumbreModule.module';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ParametroRoutingModule,
    SharedModule,
    ChartModule,
    NgxDatatableModule,
    // ArchwizardModule,
    IncertidumbreModule
  ],
  declarations: [IndexComponent, VerParametroComponent],
  // exports: [IndexComponent, VerParametroComponent]
})
export class ParametroModule {}
