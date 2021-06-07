import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IncertidumbreRoutingModule } from './incertidumbre-routing.module';
import { IncertidumbreAddComponent } from './incertidumbre-add/incertidumbre-add.component';
import { SharedModule } from '../../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SelectModule } from 'ng-select';
import { EquipoModule } from '../equipo/equipo.module';
import { IncertidumbreElementAddComponent } from './incertidumbre-element-add/incertidumbre-element-add.component';
import { IncertidumbreUtotalComponent } from './incertidumbre-utotal/incertidumbre-utotal.component';
import { IncertidumbreMuestraComponent,RemoveAlertDirective } from './incertidumbre-muestra/incertidumbre-muestra.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { IncertidumbreValidacionesComponent } from './incertidumbre-validaciones/incertidumbre-validaciones.component';
import { IncertidumbreDetalleComponent } from './incertidumbre-detalle/incertidumbre-detalle.component';
import { ArchwizardModule } from 'ng2-archwizard';
import { IncertidumbreDetalleVarComponent } from './incertidumbre-detalle-var/incertidumbre-detalle-var.component';
import { IncertidumbreDetalleMuestraComponent } from './incertidumbre-detalle-muestra/incertidumbre-detalle-muestra.component';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IncertidumbreRoutingModule,
    SharedModule,
    SelectModule,
    EquipoModule,
    NgxDatatableModule,
    ArchwizardModule,
  ],
  exports: [IncertidumbreAddComponent, IncertidumbreUtotalComponent, IncertidumbreMuestraComponent, IncertidumbreValidacionesComponent
  ,IncertidumbreDetalleMuestraComponent],
  declarations: [IncertidumbreAddComponent, IncertidumbreElementAddComponent, IncertidumbreUtotalComponent,
    IncertidumbreMuestraComponent,RemoveAlertDirective, IncertidumbreValidacionesComponent, IncertidumbreDetalleComponent, IncertidumbreDetalleVarComponent, IncertidumbreDetalleMuestraComponent]
})
export class IncertidumbreModule { }
