import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EquipoIndexComponent } from './equipo-index/equipo-index.component';
import { EquipoUpdateComponent } from './equipo-update/equipo-update.component';

const routes: Routes = [
  {
    path: '', component: EquipoIndexComponent, data: {
      title: 'Equipos',
      icon: 'ti-package',
      caption: 'Cree o consulte los Equipos',
      status: false,
    },
  },
  {
    path: 'add', component: EquipoUpdateComponent, data: {
      title: 'Equipo',
      icon: 'ti-ruler-pencil',
      caption: 'Cree, edite los equipos',
      status: false,
    },
  },
  {
    path: 'edit/:id', component: EquipoUpdateComponent, data: {
      title: 'Equipo',
      icon: 'ti-ruler-pencil',
      caption: 'Cree, edite los equipos',
      status: false,
    },
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EquipoRoutingModule { }
