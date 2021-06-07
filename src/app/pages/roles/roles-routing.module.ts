import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RolComponent } from './rol/rol.component';
import { RolesComponent } from './roles.component';

const routes: Routes = [
  {
    path: '', component: RolesComponent, data: {
      title: 'Roles',
      icon: 'ti-user',
      caption: 'Cree o consulte sus Roles',
      status: false
    }
  },
  {
    path: 'ver/:id', component: RolComponent, data: {
      title: 'Rol',
      icon: 'ti-user',
      caption: 'Rol Espesifico',
      status: false
    }
  },

];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RolesRoutingModule { }
