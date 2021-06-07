import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PublicEquipoComponent } from './public-equipo.component';

const routes: Routes = [
  {
    path: 'public/:id', component: PublicEquipoComponent, data: {
      title: 'Equipo'
    }
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PublicEquipoRoutingModule { }
