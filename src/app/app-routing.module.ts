import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AdminComponent} from './layout/admin/admin.component';
import {AuthComponent} from './layout/auth/auth.component';
import { ProtectedGuard, PublicGuard } from 'ngx-auth';
import { VerParametroComponent } from './pages/parametro/ver-parametro/ver-parametro.component';
import { PublicEquipoComponent } from './theme/public-equipo/public-equipo.component';
import { EquipoComponent } from './layout/equipo/equipo.component';

const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    canActivate: [ ProtectedGuard ],
    children: [
      {
        path: '',
        redirectTo: 'ensayos/admin',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadChildren: './theme/dashboard/dashboard.module#DashboardModule'
      },
      {
        path: 'ensayos',
        loadChildren: './pages/ensayos/ensayos.module#EnsayosModule'
      },
      {
        path: 'config/parametro',
        loadChildren: './pages/parametro/parametro.module#ParametroModule',
      },
      {
        path: 'config/agrupacionparametro',
        loadChildren: './pages/agrupacion-parametros/agrupacion-parametros.module#AgrupacionParametrosModule'
      },
      {
        path: 'config/cartas-control',
        loadChildren: './pages/cartas-control/cartas-control.module#CartasControlModule'
      },
      {
        path: 'config/condiciones-ambientales',
        loadChildren: './pages/condiciones-ambientales/condiciones-ambientales.module#CondicionesAmbientalesModule'
      },
      {
        path: 'config/datos-atipicos',
        loadChildren: './pages/datos-atipicos/datos-atipicos.module#DatosAtipicosModule'
      },
      {
        path: 'config/derivada-instrumental',
        loadChildren: './pages/deriva-istrumental/deriva-istrumental.module#DerivadaIstrumentalModule'
      },
      {
        path: 'config/validacion-de-metodos',
        loadChildren: './pages/validacion-de-metodos/validacion-de-metodos.module#ValidacionDeMetodoslModule'
      },
      {
        path: 'config/reporte',
        loadChildren: './pages/configracion/configracion.module#ConfigracionModule'
      },
      {
        path: 'config/cliente',
        loadChildren: './pages/cliente/cliente.module#ClienteModule'
      },
      {
        path: 'config/laboratorio',
        loadChildren: './pages/laboratorio/laboratorio.module#LaboratorioModule'
      },
      {
        path: 'config/usuario',
        loadChildren: './pages/usuarios/usuarios.module#UsuariosModule'
      },
      {
        path: 'config/roles',
        loadChildren: './pages/roles/roles.module#RolesModule'
      },
      {
        path: 'config/invitacion',
        loadChildren: './pages/invitacion/invitacion.module#InvitacionModule'
      },
      {
        path: 'basic',
        loadChildren: './theme/ui-elements/basic/basic.module#BasicModule'
      },
      {
        path: 'advance',
        loadChildren: './theme/ui-elements/advance/advance.module#AdvanceModule'
      },
      {
        path: 'animations',
        loadChildren: './theme/ui-elements/animation/animation.module#AnimationModule'
      },
      {
        path: 'forms',
        loadChildren: './theme/forms/forms.module#FormsModule'
      },
      {
        path: 'bootstrap-table',
        loadChildren: './theme/table/bootstrap-table/bootstrap-table.module#BootstrapTableModule'
      },
      {
        path: 'data-table',
        loadChildren: './theme/table/data-table/data-table.module#DataTableModule'
      },
      {
        path: 'maintenance/error',
        loadChildren: './theme/maintenance/error/error.module#ErrorModule'
      },
      {
        path: 'maintenance/coming-soon',
        loadChildren: './theme/maintenance/coming-soon/coming-soon.module#ComingSoonModule'
      },
      {
        path: 'user',
        loadChildren: './theme/user/user.module#UserModule'
      },
      {
        path: 'task',
        loadChildren: './theme/task/task.module#TaskModule'
      },
      {
        path: 'invoice',
        loadChildren: './theme/extension/invoice/invoice.module#InvoiceModule'
      },
      {
        path: 'file-upload-ui',
        loadChildren: './theme/extension/file-upload-ui/file-upload-ui.module#FileUploadUiModule'
      },
      {
        path: 'charts',
        loadChildren: './theme/chart/chart.module#ChartModule'
      },
      {
        path: 'map',
        loadChildren: './theme/map/map.module#MapModule'
      },
      {
        path: 'simple-page',
        loadChildren: './theme/simple-page/simple-page.module#SimplePageModule'
      },
      {
        path: 'incertidumbre',
        loadChildren: './pages/incertidumbre/incertidumbreModule.module#IncertidumbreModule'
      },
      {
        path: 'config/equipos',
        loadChildren: './pages/equipo/equipo.module#EquipoModule'
      },
      {
        path: 'config-generales',
        loadChildren: './pages/super-user/config-plataforma-super-user.module#ConfigPlataformaSuperUserModule'
      }
    ]
  },
  {
    path: '',
    component: AuthComponent,
    children: [
      {
        path: 'auth',
        loadChildren: './theme/auth/auth.module#AuthModule',
        canActivate: [ PublicGuard ],
      },
      {
        path: 'maintenance/offline-ui',
        loadChildren: './theme/maintenance/offline-ui/offline-ui.module#OfflineUiModule'
      }
    ]
  },
  {
    path: '',
    component: EquipoComponent,
    children: [
      {
        path: 'equipo',
        loadChildren: './theme/public-equipo/public-equipo.module#PublicEquipoModule',
        canActivate: [ PublicGuard ]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
