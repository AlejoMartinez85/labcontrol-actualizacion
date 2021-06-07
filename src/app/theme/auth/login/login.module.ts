import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {LoginRoutingModule} from './login-routing.module';
import {SharedModule} from '../../../shared/shared.module';
import { SimpleNotificationsModule } from 'angular2-notifications';

@NgModule({
  imports: [
    CommonModule,
    LoginRoutingModule,
    SharedModule,
    SimpleNotificationsModule.forRoot()
  ],
  declarations: []
})
export class LoginModule { }
