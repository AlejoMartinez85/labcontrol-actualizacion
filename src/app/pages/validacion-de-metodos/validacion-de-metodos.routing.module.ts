import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CrearComponent } from './crear/crear.component';
import { ValidacionDeMetodosComponent } from './validacion-de-metodos.component';

const routes: Routes = [
  {
    path: '', component: ValidacionDeMetodosComponent, data: {
      title: 'Validación de métodos',
      icon: 'ti-ruler-pencil',
      caption: 'Cree o consulte una Validaciòn de métodos',
      status: false
    }
  },
  {
    path: 'crear/:id', component: CrearComponent, data: {
      title: 'Validación de métodos',
      icon: 'ti-ruler-pencil',
      caption: 'Cree o consulte una Validaciòn de métodos',
      status: false
    }
  }

];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ValidacionDeMetodosRoutingModule { }
