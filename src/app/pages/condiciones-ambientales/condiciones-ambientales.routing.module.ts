import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CondicionesAmbientalesComponent } from './condiciones-ambientales/condiciones-ambientales.component';
import { CondicionesAmbientalesVerComponent } from './condiciones-ambientales-ver/condiciones-ambientales-ver.component';

const routes: Routes = [
  {
    path: '', component: CondicionesAmbientalesComponent, data: {
      title: 'Condiciones Ambientales',
      icon: 'ti-ruler-pencil',
      caption: 'Cree o consulte la Condiciones Ambiental',
      status: false,
    }
  },
  {
    path: 'ver/:id', component: CondicionesAmbientalesVerComponent, data: {
      title: 'Condiciones Ambientales',
      icon: 'ti-ruler-pencil',
      caption: 'Consulte los detalles de la Condición Ambiental',
      status: false,
    },
  }

];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CondicionesAmbientalesRoutingModule { }
