import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DefaultComponent } from './default.component';
import {DefaultRoutingModule} from './default-routing.module';
import {SharedModule} from '../../../shared/shared.module';
import {ChartModule} from 'angular2-chartjs';
import {SimpleNotificationsModule} from 'angular2-notifications';
import { EnsayoService } from '../../../services/ensayo/ensayo.service';

@NgModule({
  imports: [
    CommonModule,
    DefaultRoutingModule,
    SharedModule,
    ChartModule,
    SimpleNotificationsModule.forRoot()
  ],
  declarations: [DefaultComponent],
  bootstrap: [DefaultComponent],
  providers:[EnsayoService]
})
export class DefaultModule { }
