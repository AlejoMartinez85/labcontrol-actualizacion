import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { EnvironmentService } from '../../shared/environment';
import { map } from 'rxjs/operator/map';

@Injectable({
  providedIn: 'root'
})
export class EquipoService {

  constructor(private _http: HttpClient,
    private environmentService: EnvironmentService) { }

  public get(page) {
    let url = this.environmentService.setApiServiceWithPage('equipo', page);
    return this._http.get(url)
      .map(res => res)
      .catch(this.handleError);
  }
  public getOption(page) {
    let url = this.environmentService.setApiServiceWithPage('equipo', page);
    url = url + `&option=1`;
    return this._http.get(url)
      .map(res => res)
      .catch(this.handleError);
  }

  add(userData) {
    let url = this.environmentService.setApiService('equipo');
    return this._http.post(url, userData)
      .map(res => res)
      .catch(this.handleError);
  }

  getById($id) {
    let url = this.environmentService.setApiServiceById('equipo', $id);
    return this._http.get(url)
      .map(res => res)
      .catch(this.handleError);
  }
  getByIdPublic($id) {
    let url = this.environmentService.setApiServiceById('public-equipo', $id);
    return this._http.get(url)
      .map(res => res)
      .catch(this.handleError);
  }

  update(userData) {
    let url = this.environmentService.setApiServiceById('equipo', userData._id);
    return this._http.put(url, userData)
      .map(res => res)
      .catch(this.handleError);
  }
  updateEstructuras (estructura) {
    const url = this.environmentService.setApiService('equipo-estructuras');
    return this._http.post(url, estructura)
    .map(res => res)
    .catch(this.handleError);
  }
  busquedaEquiupos(busqueda) {
    let url = this.environmentService.setApiServiceById('equipo_busqueda', busqueda);
    return this._http.get(url)
      .map(res => res)
      .catch(this.handleError);
  }
  updatecomponent(userData) {
    userData.logicalerasure = false;
    let url = this.environmentService.setApiServiceById('equipo', userData._id);

    return this._http.post(url, userData)
      .map(res => res)
      .catch(this.handleError);
  }
  delete($id, userData) {
    
    let url = this.environmentService.setApiServiceById('equipo', $id);
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
