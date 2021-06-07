import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {DefaultComponent} from './default.component';

const routes: Routes = [
  {
    path: '',
    component: DefaultComponent,
    data: {
      title: 'DashBoard',
      icon: 'ti-home',
      caption: 'Cree o consulte las solicitudes de ensayo.',
      status: true
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DefaultRoutingModule { }
