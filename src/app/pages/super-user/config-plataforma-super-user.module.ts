import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ConfigPlataformaSuperUserRoutingModule } from './config-plataforma-super-user-routing.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ConfigPlataformaSuperUserComponent } from './config-plataforma-super-user/config-plataforma-super-user.component';
import { SelectModule } from 'ng-select';
import { VerRestriccionForUserComponent } from './ver-restriccion-for-user/ver-restriccion-for-user.component';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
    imports: [
      CommonModule,
      FormsModule,
      ReactiveFormsModule,
      ConfigPlataformaSuperUserRoutingModule,
      SharedModule,
      SelectModule,
      NgxDatatableModule
    ],
    declarations: [
        ConfigPlataformaSuperUserComponent,
        VerRestriccionForUserComponent
    ]
  })
  export class ConfigPlataformaSuperUserModule { }