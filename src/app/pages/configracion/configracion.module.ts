import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConfigracionRoutingModule } from './configracion-routing.module';
import { ConfigracionReporteComponent } from './configracion-reporte/configracion-reporte.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { ChartModule } from '../../theme/chart/chart.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { CKEditorModule } from 'ng2-ckeditor';
import { FileUploadModule } from 'ng2-file-upload';
import { ConfiguracionListComponent } from './configuracion-list/configuracion-list.component';
import { ConfiguracionViewComponent } from './configuracion-view/configuracion-view.component';

@NgModule({
  imports: [
    CommonModule,
    ConfigracionRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    ChartModule,
    NgxDatatableModule,
    CKEditorModule,
    FileUploadModule,
  ],
  declarations: [ConfigracionReporteComponent, ConfiguracionListComponent, ConfiguracionViewComponent]
})
export class ConfigracionModule { }
