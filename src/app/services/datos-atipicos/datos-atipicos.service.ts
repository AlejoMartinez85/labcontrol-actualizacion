import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { EnvironmentService } from '../../shared/environment';

@Injectable({
  providedIn: 'root'
})
export class DatosAtipicosService {

  constructor(private _http: HttpClient,
    private environmentService: EnvironmentService) { }

    /**
     * @param id
     * @param datoAtipico
     * Servivios Datos Atípicos
     */

    public getAllDatosAtipicos() {
      let url = this.environmentService.setApiService('datosatipicos');
      return this._http.get(url)
        .map(res => res)
        .catch(this.handleError);
    }

    public getAllDatosAtipicosID($id) {
      let url = this.environmentService.setApiServiceById('datosatipicos', $id);
      return this._http.get(url)
        .map(res => res)
        .catch(this.handleError);
    }

    public updateDatosAtipicos($id, datoAtipico) {
      let url = this.environmentService.setApiServiceById('datosatipicos', $id);
      return this._http.put(url, datoAtipico)
        .map(res => res)
        .catch(this.handleError);
    }

    public addDatosAtipicos(datoAtipico) {
      let url = this.environmentService.setApiService('datosatipicos');
      return this._http.post(url, datoAtipico)
        .map(res => res)
        .catch(this.handleError);
    }

    public deleteDatosAtipicos($id) {
      let url = this.environmentService.setApiServiceById('datosatipicos', $id);
      return this._http.delete(url)
        .map(res => res)
        .catch(this.handleError);
    }

    /**
     * 
     * @param error 
     */

    public getAllValorDatosAtipicos($id) {
      let url = this.environmentService.setApiServiceById('valordatosatipicos', $id);
      return this._http.get(url)
        .map(res => res)
        .catch(this.handleError);
    }

    public addValorDatosAtipicos(valorDatoAtipico) {
      let url = this.environmentService.setApiService('valordatosatipicos');
      return this._http.post(url, valorDatoAtipico)
        .map(res => res)
        .catch(this.handleError);
    }

    public deleteValorDatosAtipicos($id) {
      let url = this.environmentService.setApiServiceById('valordatosatipicos', $id);
      return this._http.delete(url)
        .map(res => res)
        .catch(this.handleError);
    }
    public updateValorDatosAtipicos($id, datoAtipico) {
      let url = this.environmentService.setApiServiceById('valordatosatipicos', $id);
      return this._http.put(url, datoAtipico)
        .map(res => res)
        .catch(this.handleError);
    }
     /**
   * Función de manejo de errores
   */

  private handleError(error: HttpErrorResponse | any) {
    let errMsg: string;
    errMsg = error.error;
    return Observable.throw(errMsg);
  }

}
