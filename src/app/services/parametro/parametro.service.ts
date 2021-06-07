import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { EnvironmentService } from '../../shared/environment';

@Injectable({
  providedIn: 'root'
})
export class ParametroService {

  constructor(private _http: HttpClient,
    private environmentService: EnvironmentService) { }

  public get(page) {
    let url = this.environmentService.setApiServiceWithPage('parametro', page);
    return this._http.get(url)
      .map(res => res)
      .catch(this.handleError);
  }
  public getUltimo(page) {
    let url = this.environmentService.setApiServiceWithPage('parametroPosicion', page);
    return this._http.get(url)
      .map(res => res)
      .catch(this.handleError);
  }


  add(userData) {
    let url = this.environmentService.setApiService('parametro');
    return this._http.post(url, userData)
      .map(res => res)
      .catch(this.handleError);
  }

  getById($id) {
    let url = this.environmentService.setApiServiceById('parametro', $id);
    return this._http.get(url)
      .map(res => res)
      .catch(this.handleError);
  }

  update(userData) {
    let url = this.environmentService.setApiServiceById('parametro', userData._id);
    return this._http.put(url, userData)
      .map(res => res)
      .catch(this.handleError);
  }

  updatecomponent(userData) {
    userData.logicalerasure = false;
    let url = this.environmentService.setApiServiceById('parametro', userData._id);

    return this._http.post(url, userData)
      .map(res => res)
      .catch(this.handleError);
  }
  delete($id, userData) {
    let url = this.environmentService.setApiServiceById('parametro', $id);
    userData.logicalerasure = true;
    return this._http.put(url, userData)
      .map(res => res)
      .catch(this.handleError);
  }

  getBuscarParametros(busqueda) {
    let url = this.environmentService.setApiServiceById('parametro_busqueda', busqueda);
    return this._http.get(url)
      .map(res => res)
      .catch(this.handleError);
  }

  getConfigParametros(page){
    let url = this.environmentService.setApiServiceWithPage('configparametros', page);
    return this._http.get(url)
      .map(res => res)
      .catch(this.handleError);
  }
  createConfigParametros(userData){
    let url = this.environmentService.setApiService('configparametros');
    return this._http.post(url, userData)
      .map(res => res)
      .catch(this.handleError);
  }
  editarConfigParametros(userData, $id) {
    let url = this.environmentService.setApiServiceById('configparametros', $id);
    userData.logicalerasure = true;
    return this._http.put(url, userData)
      .map(res => res)
      .catch(this.handleError);
  }
  editarConfigParametrosMuestras(userData, $id) {
    let url = this.environmentService.setApiServiceById('configparametros-muestras', $id);
    userData.logicalerasure = true;
    return this._http.put(url, userData)
      .map(res => res)
      .catch(this.handleError);
  }
  private handleError(error: HttpErrorResponse | any) {
    let errMsg: string;
    errMsg = error.error;
    return Observable.throw(errMsg);

  }

}
