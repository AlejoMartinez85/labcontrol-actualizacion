import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AdminComponent} from './layout/admin/admin.component';
import {AuthComponent} from './layout/auth/auth.component';
import { ProtectedGuard, PublicGuard } from 'ngx-auth';
//import { VerParametroComponent } from './pages/parametro/ver-parametro/ver-parametro.component';
// import { PublicEquipoComponent } from './theme/public-equipo/public-equipo.component';
import { EquipoComponent } from './layout/equipo/equipo.component';

const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    canActivate: [ProtectedGuard],
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
        loadChildren: () =>
          import('./pages/ensayos/ensayos.module').then(m => m.EnsayosModule)
        // loadChildren: './pages/ensayos/ensayos.module#EnsayosModule'
      },
      {
        path: 'config/parametro',
        loadChildren: () =>
          import('./pages/parametro/parametro.module').then(
            m => m.ParametroModule
          )
      },
      {
        path: 'config/agrupacionparametro',
        loadChildren: () =>
          import(
            './pages/agrupacion-parametros/agrupacion-parametros.module'
          ).then(m => m.AgrupacionParametrosModule)
      },
      {
        path: 'config/cartas-control',
        loadChildren: () =>
          import('./pages/cartas-control/cartas-control.module').then(
            m => m.CartasControlModule
          )
      },
      {
        path: 'config/condiciones-ambientales',
        loadChildren: () =>
          import(
            './pages/condiciones-ambientales/condiciones-ambientales.module'
          ).then(m => m.CondicionesAmbientalesModule)
      },
      {
        path: 'config/datos-atipicos',
        loadChildren: () =>
          import('./pages/datos-atipicos/datos-atipicos.module').then(
            m => m.DatosAtipicosModule
          )
      },
      {
        path: 'config/derivada-instrumental',
        loadChildren: () =>
          import('./pages/deriva-istrumental/deriva-istrumental.module').then(
            m => m.DerivadaIstrumentalModule
          )
      },
      {
        path: 'config/validacion-de-metodos',
        loadChildren: () =>
          import(
            './pages/validacion-de-metodos/validacion-de-metodos.module'
          ).then(m => m.ValidacionDeMetodoslModule)
      },
      {
        path: 'config/reporte',
        loadChildren: () =>
          import('./pages/configracion/configracion.module').then(
            m => m.ConfigracionModule
          )
      },
      {
        path: 'config/cliente',
        loadChildren: () =>
          import('./pages/cliente/cliente.module').then(m => m.ClienteModule)
      },
      {
        path: 'config/laboratorio',
        loadChildren: () =>
          import('./pages/laboratorio/laboratorio.module').then(
            m => m.LaboratorioModule
          )
      },
      {
        path: 'config/usuario',
        loadChildren: () =>
          import('./pages/usuarios/usuarios.module').then(m => m.UsuariosModule)
      },
      {
        path: 'config/roles',
        loadChildren: () =>
          import('./pages/roles/roles.module').then(m => m.RolesModule)
      },
      {
        path: 'config/invitacion',
        loadChildren: () =>
          import('./pages/invitacion/invitacion.module').then(
            m => m.InvitacionModule
          )
      },
      {
        path: 'basic',
        loadChildren: () =>
          import('./theme/ui-elements/basic/basic.module').then(
            m => m.BasicModule
          )
      },
      {
        path: 'advance',
        loadChildren: () =>
          import('./theme/ui-elements/advance/advance.module').then(
            m => m.AdvanceModule
          )
      },
      /* {
        path: 'animations',
        loadChildren: () =>
          import('./theme/ui-elements/animation/animation.module').then(
            m => m.AnimationModule
          )
      }, */
      {
        path: 'forms',
        loadChildren: () =>
          import('./theme/forms/forms.module').then(m => m.FormsModule)
      },
      {
        path: 'bootstrap-table',
        loadChildren: () =>
          import('./theme/table/bootstrap-table/bootstrap-table.module').then(
            m => m.BootstrapTableModule
          )
      },
      {
        path: 'data-table',
        loadChildren: () =>
          import('./theme/table/data-table/data-table.module').then(
            m => m.DataTableModule
          )
      },
      {
        path: 'maintenance/error',
        loadChildren: () =>
          import('./theme/maintenance/error/error.module').then(
            m => m.ErrorModule
          )
      },
      {
        path: 'maintenance/coming-soon',
        loadChildren: () =>
          import('./theme/maintenance/coming-soon/coming-soon.module').then(
            m => m.ComingSoonModule
          )
      },
      {
        path: 'user',
        loadChildren: () =>
          import('./theme/user/user.module').then(m => m.UserModule)
      },
      {
        path: 'task',
        loadChildren: () =>
          import('./theme/task/task.module').then(m => m.TaskModule)
      },
      {
        path: 'invoice',
        loadChildren: () =>
          import('./theme/extension/invoice/invoice.module').then(
            m => m.InvoiceModule
          )
      },
      {
        path: 'file-upload-ui',
        loadChildren: () =>
          import('./theme/extension/file-upload-ui/file-upload-ui.module').then(
            m => m.FileUploadUiModule
          )
      },
      {
        path: 'charts',
        loadChildren: () =>
          import('./theme/chart/chart.module').then(m => m.ChartModule)
      },
      {
        path: 'map',
        loadChildren: () =>
          import('./theme/map/map.module').then(m => m.MapModule)
      },
      {
        path: 'simple-page',
        loadChildren: () =>
          import('./theme/simple-page/simple-page.module').then(
            m => m.SimplePageModule
          )
      },
      {
        path: 'incertidumbre',
        loadChildren: () =>
          import('./pages/incertidumbre/incertidumbreModule.module').then(
            m => m.IncertidumbreModule
          )
      },
      {
        path: 'config/equipos',
        loadChildren: () =>
          import('./pages/equipo/equipo.module').then(m => m.EquipoModule)
      },
      {
        path: 'config-generales',
        loadChildren: () =>
          import('./pages/super-user/config-plataforma-super-user.module').then(m => m.ConfigPlataformaSuperUserModule)
      }
    ]
  },
  {
    path: '',
    component: AuthComponent,
    children: [
      {
        path: 'auth',
        loadChildren:
        () => import('./theme/auth/auth.module').then(m => m.AuthModule),
        canActivate: [PublicGuard]
      },
      {
        path: 'maintenance/offline-ui',
        loadChildren:
          () => import('./theme/maintenance/offline-ui/offline-ui.module').then(m => m.OfflineUiModule),
      }
    ]
  },
  {
    path: '',
    component: EquipoComponent,
    children: [
      {
        path: 'equipo',
        loadChildren:
          () => import('./theme/public-equipo/public-equipo.module').then(m => m.PublicEquipoModule),
        canActivate: [PublicGuard]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
