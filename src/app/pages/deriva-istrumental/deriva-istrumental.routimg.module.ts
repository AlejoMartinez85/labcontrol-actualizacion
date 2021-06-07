import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DerivaInstrumentalComponent } from './deriva-instrumental/deriva-instrumental.component';
import { VerDerivaInstrumentalComponent } from './ver-deriva-instrumental/ver-deriva-instrumental.component';
import { CrearDerivaInstrumentalComponent } from './crear-deriva-instrumental/crear-deriva-instrumental.component';

const routes: Routes = [
  {
    path: '', component: DerivaInstrumentalComponent, data: {
      title: 'Listado de análisis de deriva Intrumental',
      icon: 'ti-ruler-pencil',
      caption: 'Cree o consulte un análisis de deriva Instrumental',
      status: false
    }
  },
  {
    path: 'ver/:id', component: VerDerivaInstrumentalComponent, data: {
      title: 'Derivada Instrumental',
      icon: 'ti-ruler-pencil',
      caption: 'Consulte los detalles de un análisis de deriva Instrumental',
      status: false,
    },
  },
  {
    path: 'crear-derivada', component: CrearDerivaInstrumentalComponent, data: {
      title: 'Crear análisis de Deriva Instrumental',
      icon: 'ti-ruler-pencil',
      caption: 'Crear nuevo análisis de deriva Instrumental',
      status: false,
    },
  }

];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DerivadaIstrumentalRoutingModule { }
