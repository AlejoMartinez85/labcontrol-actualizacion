import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EquipoRoutingModule } from './equipo-routing.module';
import { EquipoAddComponent } from './equipo-add/equipo-add.component';
import { EquipoIndexComponent } from './equipo-index/equipo-index.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SelectModule } from 'ng-select';
import { SharedModule } from '../../shared/shared.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { FileUploadModule } from 'ng2-file-upload';
import { EquipoReparacionComponent } from './equipo-reparacion/equipo-reparacion.component';
import { EquipoUpdateComponent } from './equipo-update/equipo-update.component';
import { AngularCropperjsModule } from 'angular-cropperjs';
import { QRCodeModule } from 'angularx-qrcode';
import { CKEditorModule } from 'ng2-ckeditor';
import { InfoAdicionalComponent } from './info-adicional/info-adicional.component';
import { SafeHtmlEquiposPipe } from '../../pipes/safe-html-equipos.pipe';
import { TagInputModule } from 'ngx-chips';
@NgModule({
  imports: [
    CommonModule,
    EquipoRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SelectModule,
    SharedModule,
    NgxDatatableModule,
    FileUploadModule,
    AngularCropperjsModule,
    QRCodeModule,
    CKEditorModule,
    TagInputModule
  ],
  exports: [EquipoAddComponent, EquipoReparacionComponent],
  declarations: [
    EquipoAddComponent,
    EquipoIndexComponent,
    EquipoReparacionComponent,
    EquipoUpdateComponent,
    InfoAdicionalComponent,
    SafeHtmlEquiposPipe
  ]
})
export class EquipoModule {}
