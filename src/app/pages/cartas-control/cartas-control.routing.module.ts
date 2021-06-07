import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CartasControlComponent } from './cartas-control/cartas-control.component';
import { CartasControlVerComponent } from './cartas-control-ver/cartas-control-ver.component';

const routes: Routes = [
  {
    path: '', component: CartasControlComponent, data: {
      title: 'Cartas de control',
      icon: 'ti-ruler-pencil',
      caption: 'Cree o consulte la Cartas de control',
      status: false
    }
  },
  {
    path: 'ver/:id', component: CartasControlVerComponent, data: {
      title: 'Cartas de control',
      icon: 'ti-ruler-pencil',
      caption: 'Consulte los detalles de los Cartas de control',
      status: false,
    },
  }

];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CartasControlRoutingModule { }
