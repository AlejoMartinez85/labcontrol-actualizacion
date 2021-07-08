import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClienteRoutingModule } from './cliente-routing.module';
import { IndexComponent } from './index/index.component';
import { SharedModule } from '../../shared/shared.module';
import { ChartModule } from '../../theme/chart/chart.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { JsonpModule } from '@angular/http';
import { TagInputModule } from 'ngx-chips';
import { SelectModule } from 'ng-select';
import { EnsayosModule } from '../ensayos/ensayos.module';
import { DetailsComponent } from './details/details.component';
import { PerfilComponent } from './perfil/perfil.component';
import { FileUploadModule } from 'ng2-file-upload';

@NgModule({
  imports: [
    CommonModule,
    ClienteRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    ChartModule,
    NgxDatatableModule,
    TagInputModule,
    // JsonpModule,
    SelectModule,
    EnsayosModule,
    FileUploadModule
  ],
  declarations: [IndexComponent, DetailsComponent, PerfilComponent]
})
export class ClienteModule { }
