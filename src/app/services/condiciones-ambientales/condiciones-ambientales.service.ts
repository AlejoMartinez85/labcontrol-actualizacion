import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { EnvironmentService } from '../../shared/environment';

@Injectable({
  providedIn: 'root'
})
export class CondicionesAmbientalesService {

  constructor(private _http: HttpClient,
    private environmentService: EnvironmentService) { }

  /**
   * Condiciones Ambientales
   */

  public getAllCondicionesAmbientales(desde) {
    let url = this.environmentService.setApiService('condicionesambientales');
    url += '?desde=' + desde;
    return this._http.get(url)
      .map(res => res)
      .catch(this.handleError);
  }

  public getIdCondicionesAmbientales($id) {
    let url = this.environmentService.setApiServiceById('condicionesambientales', $id);
      return this._http.get(url)
        .map(res => res)
        .catch(this.handleError);
  }

  public addCondicionesAmbientales(condicion) {
    let url = this.environmentService.setApiService('condicionesambientales');
    return this._http.post(url, condicion)
      .map(res => res)
      .catch(this.handleError);
  }

  public updateCondicionesAmbientales($id, condicion) {
    let url = this.environmentService.setApiServiceById('condicionesambientales', $id);
    return this._http.put(url, condicion)
      .map(res => res)
      .catch(this.handleError);
  }
  public updateUltimoIngresoCondicionesAmbientales($id, condicion) {
    let url = this.environmentService.setApiServiceById('condicionesambientalesultimoingreso', $id);
    return this._http.put(url, condicion)
      .map(res => res)
      .catch(this.handleError);
  }

  public updateDatosEstadisticos($id, condicion) {
    let url = this.environmentService.setApiServiceById('condicionesambientalesdatosestadisticos', $id);
    return this._http.put(url, condicion)
      .map(res => res)
      .catch(this.handleError);
  }

  public updateEstadoCondicionesAmbientales($id, condicion) {
    let url = this.environmentService.setApiServiceById('condicionesambientalesestado', $id);
    return this._http.put(url, condicion)
      .map(res => res)
      .catch(this.handleError);
  }
  public update($id, condicion) {
    let url = this.environmentService.setApiServiceById('condicionesambientales', $id);
    return this._http.put(url, condicion)
      .map(res => res)
      .catch(this.handleError);
  }

  public deleteCondicionesAmbientales($id) {
    let url = this.environmentService.setApiServiceById('condicionesambientales', $id);
    return this._http.delete(url)
      .map(res => res)
      .catch(this.handleError);
  }
  getBuscarcondiciones(busqueda) {
    let url = this.environmentService.setApiServiceById('condicionesambientales_busqueda', busqueda);
    return this._http.get(url)
      .map(res => res)
      .catch(this.handleError);
  }
  /**
   * Methodos de ensayo condiciones ambientales
   */

  public getIdMethodosdeEnsayo($id) {
    let url = this.environmentService.setApiServiceById('metodosEnsayoscondicionesAmbientales', $id);
      return this._http.get(url)
        .map(res => res)
        .catch(this.handleError);
  }

  public addMethodosdeEnsayo(metodo) {
    let url = this.environmentService.setApiService('metodosEnsayoscondicionesAmbientales');
    return this._http.post(url, metodo)
      .map(res => res)
      .catch(this.handleError);
  }

  /**
   * Datos Condiciones ambientales
   */

   public getIdDatos($id) {
    let url = this.environmentService.setApiServiceById('datoscondicionesambientales', $id);
      return this._http.get(url)
        .map(res => res)
        .catch(this.handleError);
  }
   public getIdDato($id) {
    let url = this.environmentService.setApiServiceById('datoscondicionesambientalesespesifico', $id);
      return this._http.get(url)
        .map(res => res)
        .catch(this.handleError);
  }

  public addDatos(dato) {
    let url = this.environmentService.setApiService('datoscondicionesambientales');
    return this._http.post(url, dato)
      .map(res => res)
      .catch(this.handleError);
  }

  public updateDatos($id, dato) {
    let url = this.environmentService.setApiServiceById('datoscondicionesambientalesComnentarios', $id);
    return this._http.put(url, dato)
      .map(res => res)
      .catch(this.handleError);
  }

  public updateValor(dato) {
    const url = this.environmentService.setApiServiceById('datoscondicionesambientales', dato._id);
    return this._http.put(url, dato).map(res => res).catch(this.handleError);
  }
  public deleteDatos($id) {
    let url = this.environmentService.setApiServiceById('datoscondicionesambientales', $id);
    return this._http.delete(url)
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
