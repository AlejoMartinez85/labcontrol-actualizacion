import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminComponent } from './admin/admin.component';
import { VistapreviaComponent } from './vistaprevia/vistaprevia.component';
import { IndexComponent } from './index/index.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ReporteComponent } from './reporte/reporte.component';
import { RecepcionEnsayoComponent } from './recepcion-ensayo/recepcion-ensayo.component';
import { VerMuestraComponent } from './ver-muestra/ver-muestra.component';
import { EditMuestraComponent } from './edit-muestra/edit-muestra.component';

const routes: Routes = [
  {
    path: 'ensayos', component: IndexComponent, data: {
      title: 'Ensayos',
      icon: 'ti-signal',
      caption: 'Consulta las solicitudes en proceso de ensayo',
      status: false,

    }
  },
  {
    path: 'admin', component: DashboardComponent, data: {
      // title: 'DashBoard',
      // icon: 'ti-home',
      // caption: 'Gestiona las actividades de tu laboratorio',
      status: true,

    }
  },
  {
    path: 'vistaprevia/:id', component: VistapreviaComponent, data: {
      // title: 'Resultado Ensayo',
      // icon: 'ti-home',
      // caption: 'Visualice el resultado del ensayo',
      status: false,

    }
  },
  {
    path: 'reporte', component: ReporteComponent, data: {
      title: 'Reporte',
      icon: 'ti-signal',
      caption: 'Consulta las solicitudes en proceso de reporte',
      status: false,

    }
  },
  {
    path: 'recepcionEnsayo', component: RecepcionEnsayoComponent, data: {
      title: 'Recepción de Muestras',
      icon: 'ti-signal',
      caption: 'Consulta las muestras de ensayo y solicitudes asociadas',
      status: false,

    }
  },
  {
    path: 'muestra/:id', component: VerMuestraComponent,
    data: {
      title: 'Ver Muestra',
      icon: 'ti-signal',
      caption: 'Consulta la muestra seleccionada',
      status: false,
    }
  },
  {
    path: 'edit-muestra/:id', component: EditMuestraComponent,
    data: {
      title: 'Editar Muestra',
      icon: 'ti-signal',
      caption: 'Edita la muestra seleccionada',
      status: false
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EnsayosRoutingModule { }
