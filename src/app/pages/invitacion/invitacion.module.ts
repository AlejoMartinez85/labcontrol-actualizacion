import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InvitacionRoutingModule } from './invitacion-routing.module';
import { IndexComponent } from './index/index.component';
import { SharedModule } from '../../shared/shared.module';
import { ChartModule } from '../../theme/chart/chart.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    InvitacionRoutingModule,
    SharedModule,
    ChartModule,
    NgxDatatableModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  declarations: [IndexComponent]
})
export class InvitacionModule { }
