import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IndexComponent } from './index/index.component';
import { VerParametroComponent } from './ver-parametro/ver-parametro.component';


const routes: Routes = [
  {
    path: '', component: IndexComponent, data: {
      title: 'Parámetros',
      icon: 'ti-ruler-pencil',
      caption: 'Cree o consulte los Parámetros',
      status: false,
    },
  },
  {
    path: 'ver/:id', component: VerParametroComponent, data: {
      title: 'Configuracion Incertidumbre',
      icon: 'ti-ruler-pencil',
      caption: 'Configure la incertidumbre para el parametro',
      status: false,
    },
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ParametroRoutingModule { }
