import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
  HttpErrorResponse,
} from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import { AuthenticationService } from '../../shared/authentication';
import { NotificationService } from '../../shared/notification';
@Injectable({
  providedIn: 'root'
})
export class ErrorHttpService implements HttpInterceptor {

  constructor(
    private authService: AuthenticationService,
    private notificationService: NotificationService,
  ) { }


  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    return next.handle(request).do((event: HttpEvent<any>) => { }, (err: any) => {
      if (err instanceof HttpErrorResponse) {

        if ((err.status == 401 && !(err.url.toLowerCase().includes('/oauth/token')))
          || (err.status == 400 && (err.message.includes('invalid_credentials')
            || err.message.includes('Unauthenticated')))
          || (err.error.status == 400 && (err.error.message.includes('invalid_credentials')
            || err.error.message.includes('Unauthenticated')))
        ) {
          this.authService.logout();
          this.notificationService.addNotify({ title: 'Alerta', msg: 'Por favor valide los datos ', type: 'error' });
        }
      }
    });
  }


}
