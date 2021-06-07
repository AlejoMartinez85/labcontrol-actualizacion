import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { EnvironmentService } from '../../shared/environment';

@Injectable({
  providedIn: 'root'
})
export class EstructuraServiceService {

  constructor(private _http: HttpClient,
    private environmentService: EnvironmentService) { }

  /**
   * Get Leyouts - Estructuras
   */

  public get(desde) {
    let url = this.environmentService.setApiService('layout');
    url += '?desde=' + desde;
    return this._http
      .get(url)
      .map(res => res)
      .catch(this.handleError);
  }

  public getId($id) {
    const url = this.environmentService.setApiServiceById('layout', $id);
    return this._http
      .get(url)
      .map(res => res)
      .catch(this.handleError);
  }

  public busqueda(busqueda) {
    const url = this.environmentService.setApiServiceById('busqueda-layout', busqueda);
    return this._http
      .get(url)
      .map(res => res)
      .catch(this.handleError);
  }

  /**
   * Post Crear Layout
   */

  public create(layout) {
    const url = this.environmentService.setApiService('layout');
    return this._http
      .post(url, layout)
      .map(res => res)
      .catch(this.handleError);
  }

  /**
   * Put Editar Layout - Estructura
   */

  public edit(layout) {
    const url = this.environmentService.setApiServiceById('layout', layout._id);
    return this._http.put(url, layout)
      .map(res => res)
      .catch(this.handleError);
  }

  /**
   * Delete Elimina una Estructura - Layout
   */

  public delete($id) {
    const url = this.environmentService.setApiServiceById('layout', $id);
    return this._http.delete(url)
      .map(res => res)
      .catch(this.handleError);
  }

  /**
   * @param error
   */


  private handleError(error: HttpErrorResponse | any) {
    let errMsg: string;
    errMsg = error.error;
    return Observable.throw(errMsg);

  }
}
