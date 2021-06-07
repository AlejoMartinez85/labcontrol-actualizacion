import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ConfigracionReporteComponent } from './configracion-reporte/configracion-reporte.component';
import { ConfiguracionListComponent } from './configuracion-list/configuracion-list.component';

const routes: Routes = [
  {
    path: '', component: ConfiguracionListComponent , data: {
      title: 'Configuración Reporte',
      icon: 'ti-notepad',
      caption: 'Configura el formato del reporte de ensayo',
      status: false,

    }
  },];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConfigracionRoutingModule { }
