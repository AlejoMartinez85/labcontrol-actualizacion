import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { ChartModule } from '../../theme/chart/chart.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { RolesRoutingModule } from './roles-routing.module';

import { RolesComponent } from './roles.component';
import { RolComponent } from './rol/rol.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RolesRoutingModule,
    SharedModule,
    ChartModule,
    NgxDatatableModule
  ],
  declarations: [RolesComponent, RolComponent]
})
export class RolesModule { }
