import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LaboratorioRoutingModule } from './laboratorio-routing.module';
import { IndexComponent } from './index/index.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { ChartModule } from '../../theme/chart/chart.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { TagInputModule } from 'ngx-chips';
import { JsonpModule } from '@angular/http';
import { DetailsComponent } from './details/details.component';
import { EnsayosModule } from '../ensayos/ensayos.module';

@NgModule({
  imports: [
    CommonModule,
    LaboratorioRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    ChartModule,
    NgxDatatableModule,
    TagInputModule,
    JsonpModule,
    EnsayosModule,
  ],
  declarations: [IndexComponent, DetailsComponent]
})
export class LaboratorioModule { }
