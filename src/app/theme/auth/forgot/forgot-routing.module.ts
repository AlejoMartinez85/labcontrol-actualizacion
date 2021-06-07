import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ForgotComponent} from './forgot.component';

const routes: Routes = [
  {
    path: '',
    component: ForgotComponent,
    data: {
      title: 'Recordar contraseña'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ForgotRoutingModule { }
