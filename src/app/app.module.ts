import { BrowserModule } from '@angular/platform-browser';
import { NgModule, LOCALE_ID } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { registerLocaleData } from '@angular/common';
import localeCo from '@angular/common/locales/es-CO';
registerLocaleData(localeCo);

/* Modules */
import { AppRoutingModule } from './app-routing.module';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { SharedModule } from './shared/shared.module';

/* Components */
import { AppComponent } from './app.component';
import { AdminComponent } from './layout/admin/admin.component';
import { AuthComponent } from './layout/auth/auth.component';
import { BreadcrumbsComponent } from './layout/admin/breadcrumbs/breadcrumbs.component';
import { EquipoComponent } from './layout/equipo/equipo.component';

/* Services */
import { ErrorHttpService } from './services/error-http/error-http.service';

@NgModule({
  declarations: [
    AppComponent,
    AdminComponent,
    AuthComponent,
    EquipoComponent,
    BreadcrumbsComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    SharedModule,
    FormsModule,
    SimpleNotificationsModule.forRoot(),
    HttpClientModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorHttpService,
      multi: true,
    },
    { provide: LOCALE_ID, useValue: "es-CO" }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
