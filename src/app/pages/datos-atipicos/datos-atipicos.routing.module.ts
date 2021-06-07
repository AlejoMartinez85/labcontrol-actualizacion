import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DatosAtipicosComponent } from './datos-atipicos/datos-atipicos.component';
import { DatosAtipicosverComponent } from './datos-atipicosver/datos-atipicosver.component';
import { CrearMatrizDatosAtipicosComponent } from '../crear-matriz-datos-atipicos/crear-matriz-datos-atipicos/crear-matriz-datos-atipicos.component';

const routes: Routes = [
  {
    path: '', component: DatosAtipicosComponent, data: {
      title: 'Datos Atípicos',
      icon: 'ti-ruler-pencil',
      caption: 'Cree o consulte un Dato Atípico',
      status: false
    }
  },
  {
    path: 'ver/:id', component: DatosAtipicosverComponent, data: {
      title: 'Datos Atípicos',
      icon: 'ti-ruler-pencil',
      caption: 'Consulte los detalles de un Dato Atípico',
      status: false,
    },
  },
  {
    path: 'crear-matrix', component: CrearMatrizDatosAtipicosComponent, data: {
      title: 'Crear Matrix',
      icon: 'ti-ruler-pencil',
      caption: 'Crear nueva matriz para el cálculo de datos atípicos',
      status: false,
    },
  }

];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DatosAtipicosRoutingModule { }
