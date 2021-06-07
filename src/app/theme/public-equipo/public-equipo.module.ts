import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PublicEquipoRoutingModule } from './public-equipo-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SelectModule } from 'ng-select';
import { SharedModule } from '../../shared/shared.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { FileUploadModule } from 'ng2-file-upload';
import { AngularCropperjsModule } from 'angular-cropperjs';
import { PublicEquipoComponent } from './public-equipo.component';
import { QRCodeModule } from 'angularx-qrcode';
import { PublicEquiposReparacionComponent } from './public-equipos-reparacion/public-equipos-reparacion.component';
import { SafeHtmlEquiposPipe2 } from '../../pipes/safe-html-equipos2.pipe';

@NgModule({
  declarations: [
    PublicEquiposReparacionComponent,
    PublicEquipoComponent,
    SafeHtmlEquiposPipe2
  ],
  imports: [
    CommonModule,
    PublicEquipoRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SelectModule,
    SharedModule,
    NgxDatatableModule,
    FileUploadModule,
    AngularCropperjsModule,
    QRCodeModule
  ],
  exports: [PublicEquiposReparacionComponent]
})
export class PublicEquipoModule { }
