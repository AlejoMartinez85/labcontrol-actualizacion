import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EnsayosRoutingModule } from './ensayos-routing.module';
import { AdminComponent } from './admin/admin.component';
import { SharedModule } from '../../shared/shared.module';
import {ChartModule} from 'angular2-chartjs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UiSwitchModule } from 'ng2-ui-switch';
import { TagInputModule } from 'ngx-chips';
import { SelectModule } from 'ng-select';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { OrdenComponent } from './orden/orden.component';
import { SolicitudComponent } from './solicitud/solicitud.component';
import { PagoComponent } from './pago/pago.component';
import { VistapreviaComponent } from './vistaprevia/vistaprevia.component';
import { IndexComponent } from './index/index.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LaboratorioComponent } from './laboratorio/laboratorio.component';
import { SolicitudCliComponent } from './solicitud-cli/solicitud-cli.component';
import { PagoCliComponent } from './pago-cli/pago-cli.component';
import { CargarArchivosComponent } from './cargar-archivos/cargar-archivos.component';
import { FileUploadModule } from 'ng2-file-upload';
import { ComentariosComponent } from './comentarios/comentarios.component';
import { ActividadComponent } from './actividad/actividad.component';
import { ReporteComponent } from './reporte/reporte.component';
import { GraficasComponent } from './graficas/graficas.component';
import { ResultadoComponent } from './resultado/resultado.component';
import { ResultadoViewComponent } from './resultado-view/resultado-view.component';
import { SafeHtmlPipe } from '../../shared/pipes/SafeHtmlPipe.pipe';
import { CKEditorModule } from 'ng2-ckeditor';
import { RecepcionEnsayoComponent } from './recepcion-ensayo/recepcion-ensayo.component';
import { IncertidumbreModule } from '../incertidumbre/incertidumbreModule.module';
import { VerMuestraComponent } from './ver-muestra/ver-muestra.component';
import { QRCodeModule } from 'angularx-qrcode';
import { EditMuestraComponent } from './edit-muestra/edit-muestra.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { NumeroPasteComaToPuntoPipe } from '../../pipes/numero-paste-coma-to-punto.pipe';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    EnsayosRoutingModule,
    SharedModule,
    ChartModule,
    UiSwitchModule,
    TagInputModule,
    SelectModule,
    NgxDatatableModule,
    FileUploadModule,
    CKEditorModule,
    IncertidumbreModule,
    QRCodeModule,
    PdfViewerModule
  ],
  declarations: [
    AdminComponent,
    OrdenComponent,
    SolicitudComponent,
    PagoComponent,
    VistapreviaComponent,
    IndexComponent,
    DashboardComponent,
    LaboratorioComponent,
    SolicitudCliComponent,
    PagoCliComponent,
    CargarArchivosComponent,
    ComentariosComponent,
    ActividadComponent,
    ReporteComponent,
    GraficasComponent,
    ResultadoComponent,
    ResultadoViewComponent,
    SafeHtmlPipe,
    RecepcionEnsayoComponent,
    NumeroPasteComaToPuntoPipe,
    VerMuestraComponent,
    EditMuestraComponent
  ],
  // exports: [
  //   ActividadComponent,
  // ]
})
export class EnsayosModule { }
