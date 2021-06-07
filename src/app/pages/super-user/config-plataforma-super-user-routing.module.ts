import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ConfigPlataformaSuperUserComponent } from './config-plataforma-super-user/config-plataforma-super-user.component';
import { VerRestriccionForUserComponent } from './ver-restriccion-for-user/ver-restriccion-for-user.component';

const routes: Routes = [
    {
        path: '', component: ConfigPlataformaSuperUserComponent, data: {
            title: 'Listado Configuraciones',
            icon: 'ti-ruler-pencil',
            caption: 'Listado de Configuraciones',
            status: false,
        },
    },
    {
        path: 'user/:id', component: VerRestriccionForUserComponent, data: {
            title: 'Listado de Restricciones por Usuario',
            icon: 'ti-ruler-pencil',
            caption: 'Listado de Configuraciones',
            status: false,
        },
    }
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class ConfigPlataformaSuperUserRoutingModule { }