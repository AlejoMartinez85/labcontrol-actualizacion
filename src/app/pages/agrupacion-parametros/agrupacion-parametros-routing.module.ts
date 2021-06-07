import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AgrupacionParametrosIndexComponent } from './agrupacion-parametros-index/agrupacion-parametros-index.component';

const routes: Routes = [
  {
    path: '', component: AgrupacionParametrosIndexComponent, data: {
      title: 'Agrupación de Parámetros',
      icon: 'ti-ruler-pencil',
      caption: 'Cree o consulte la Agrupación de Parámetros',
      status: false
    }
  },

];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AgrupacionParametrosRoutingModule { }
