import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { EnsayoService } from '../../services/ensayo/ensayo.service';

@NgModule({
  imports: [
    CommonModule,
    DashboardRoutingModule,
    HttpClientModule,
  ],
  declarations: [],
  providers:[ EnsayoService]
})
export class DashboardModule { }
