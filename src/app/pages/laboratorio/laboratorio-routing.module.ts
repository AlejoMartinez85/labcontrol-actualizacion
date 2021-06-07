import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IndexComponent } from './index/index.component';
import { DetailsComponent } from './details/details.component';

const routes: Routes = [
  {
    path: '', component: IndexComponent, data: {
      title: 'Laboratorios',
      icon: 'ti-user',
      caption: 'Cree o consulte sus laboratorios',
      status: true
    },

  },
  {
    path: 'detalle/:id', component: DetailsComponent, data: {
      title: 'Laboratorios',
      icon: 'ti-signal',
      caption: 'Consulte los detalles de sus laboratorios',
      status: true
    }
  }

];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LaboratorioRoutingModule { }
