import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IndexComponent } from './index/index.component';
import { DetailsComponent } from './details/details.component';
import { PerfilComponent } from './perfil/perfil.component';

const routes: Routes = [
  {
    path: '', component: IndexComponent, data: {
      title: 'Clientes',
      icon: 'ti-signal',
      caption: 'Cree o consulte sus clientes',
      status: false
    }
  },
  {
    path: 'detalle/:id', component: DetailsComponent, data: {
      title: 'Clientes',
      icon: 'ti-signal',
      caption: 'Consulte los detalles de su cliente',
      status: false
    }
  },
  {
    path: 'perfil', component: PerfilComponent, data: {
      title: 'Clientes',
      icon: 'ti-signal',
      caption: 'Alctualice los datos de su empresa',
      status: false
    }
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClienteRoutingModule { }
