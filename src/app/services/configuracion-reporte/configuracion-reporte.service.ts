import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { EnvironmentService } from '../../shared/environment';
@Injectable({
  providedIn: 'root'
})
export class ConfiguracionReporteService {

  constructor(private _http: HttpClient,
    private environmentService: EnvironmentService) { }

  /**
   * Función de manejo de errores
   */
  public get() {
    let url = this.environmentService.setApiService('configReporte');
    return this._http.get(url)
      .map(res => res)
      .catch(this.handleError);
  }

  public edit($id, valor) {
    let url = this.environmentService.setApiServiceById('configReporte', $id);
    return this._http.put(url, valor)
      .map(res => res)
      .catch(this.handleError);
  }

  public add(valor) {
    let url = this.environmentService.setApiService('configReporte');
    return this._http.post(url, valor)
      .map(res => res)
      .catch(this.handleError);
  }
  private handleError(error: HttpErrorResponse | any) {
    let errMsg: string;
    errMsg = error.error;
    return Observable.throw(errMsg);
  }

}
