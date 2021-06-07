import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { EnvironmentService } from '../../shared/environment';
@Injectable({
  providedIn: 'root'
})
export class ConfigAlertaEquiposService {

  public endpoint = 'configequipos';

  constructor(private _http: HttpClient,
    private environmentService: EnvironmentService) { }


  public getconfiguracionEquipos() {
    const url = this.environmentService.setApiService(this.endpoint);
    return this._http.get(url)
      .map(res => res)
      .catch(this.handleError);
  }

  public addconfiguracionEquipos(config) {
    const url = this.environmentService.setApiService(this.endpoint);
    return this._http.post(url, config).map(res => res).catch(this.handleError);
  }

  public editconfiguracionEquipos(config) {
    const url = this.environmentService.setApiServiceById(this.endpoint, config._id);
    return this._http.put(url, config).map(res => res).catch(this.handleError);
  }

  public deleteconfiguracionEquipos($id) {
    const url = this.environmentService.setApiServiceById(this.endpoint, $id);
    return this._http.delete(url).map( res => res ).catch(this.handleError);
  }

  public updateMantenimientosReparaciones(config) {
    const url = this.environmentService.setApiService('getEquiposUpdateFechaAviso');
    return this._http.post(url, config).map(res => res).catch(this.handleError);
  }
  private handleError(error: HttpErrorResponse | any) {
    let errMsg: string;
    errMsg = error.error;
    return Observable.throw(errMsg);

  }
}

