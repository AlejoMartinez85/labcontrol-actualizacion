import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { EnvironmentService } from '../../shared/environment';

@Injectable({
  providedIn: 'root'
})
export class GraficasService {


  metodo = '';
  constructor(private _http: HttpClient,
    private environmentService: EnvironmentService) {
    this.metodo = 'grafica';
  }



  public getVentas(page) {
    let url = '';
    url = this.environmentService.setApiServiceWithPage(this.metodo + '/ventas', page);

    return this._http.get(url)
      .map(res => res)
      .catch(this.handleError);
  }

  public getFacturas(page) {
    let url = '';
    url = this.environmentService.setApiServiceWithPage(this.metodo + '/facturas', page);

    return this._http.get(url)
      .map(res => res)
      .catch(this.handleError);
  }






  private handleError(error: HttpErrorResponse | any) {
    let errMsg: string;
    errMsg = error.error;
    return Observable.throw(errMsg);

  }

}
