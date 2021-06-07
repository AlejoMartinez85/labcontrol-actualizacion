import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { ChartModule } from '../../theme/chart/chart.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { SelectModule } from 'ng-select';
import { NgApexchartsModule } from 'ng-apexcharts';
import { ValidacionDeMetodosComponent } from './validacion-de-metodos.component';
import { ValidacionDeMetodosRoutingModule } from './validacion-de-metodos.routing.module';
import { CrearComponent } from './crear/crear.component';
import { LinealidadComponent } from './sub-modulos/linealidad/linealidad.component';
import { LimitesComponent } from './sub-modulos/limites/limites.component';
import { ExactitudComponent } from './sub-modulos/exactitud/exactitud.component';
import { PresicionesComponent } from './sub-modulos/presiciones/presiciones.component';
import { RobustezComponent } from './sub-modulos/robustez/robustez.component';
import { SensibilidadComponent } from './sub-modulos/sensibilidad/sensibilidad.component';
import { PdfComponent } from './sub-modulos/pdf/pdf.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { FileUploadModule } from 'ng2-file-upload';
import { TablaArraysComponent } from './search/tabla-arrays/tabla-arrays.component';
import { AccuracyComponent } from './sub-modulos/accuracy/accuracy.component';
import { NgbProgressbarModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { WorkIntervalComponent } from './sub-modulos/work-interval/work-interval.component';
import { ReportesComponent } from './sub-modulos/reportes/reportes.component';
import { CargaArchivoComponent } from './sub-modulos/carga-archivo/carga-archivo.component';

@NgModule({
  imports: [
    SharedModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ValidacionDeMetodosRoutingModule,
    ChartModule,
    NgxDatatableModule,
    SelectModule,
    NgApexchartsModule,
    PdfViewerModule,
    FileUploadModule,
    NgbProgressbarModule,
    NgbTooltipModule
  ],
  declarations: [
    ValidacionDeMetodosComponent,
    CrearComponent,
    LinealidadComponent,
    LimitesComponent,
    ExactitudComponent,
    PresicionesComponent,
    RobustezComponent,
    SensibilidadComponent,
    PdfComponent,
    TablaArraysComponent,
    AccuracyComponent,
    WorkIntervalComponent,
    ReportesComponent,
    CargaArchivoComponent
  ]
})
export class ValidacionDeMetodoslModule { }
