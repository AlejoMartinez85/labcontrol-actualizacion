import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { EnvironmentService } from '../../shared/environment';

@Injectable({
  providedIn: 'root'
})
export class RolesPermisosService {

  private endpointRoles: string;
  private endpointPermisos: string;

  constructor(private _http: HttpClient,
    private environmentService: EnvironmentService) {
      this.endpointPermisos = 'permisos';
      this.endpointRoles = 'role';
    }

    /**
     * Servicios Roles
     */

  public getRole() {
    const url = this.environmentService.setApiService(this.endpointRoles);
    return this._http.get(url).map( resp => resp ).catch(this.handleError);
  }

  public getIdRole( $id ) {
    const url = this.environmentService.setApiServiceById(this.endpointRoles, $id);
    return this._http.get(url).map( resp => resp ).catch(this.handleError);
  }

  public createRole( rol ) {
    const url = this.environmentService.setApiService(this.endpointRoles);
    return this._http.post(url, rol).map( resp => resp ).catch(this.handleError);
  }

  public editRole( rol ) {
    const url = this.environmentService.setApiServiceById(this.endpointRoles, rol._id);
    return this._http.put(url, rol).map( resp => resp ).catch(this.handleError);
  }

  public deleteRole( $id ) {
    const url = this.environmentService.setApiServiceById(this.endpointRoles, $id);
    return this._http.delete( url ).map( resp => resp ).catch(this.handleError);
  }

  /**
   * Permisos
   */

  public getPermisos( $id ) {
    const url = this.environmentService.setApiServiceById(this.endpointPermisos, $id);
    return this._http.get( url ).map( resp => resp ).catch(this.handleError);
  }

  public editPermisos( permisos ) {
    const url = this.environmentService.setApiServiceById(this.endpointPermisos, permisos._id);
    return this._http.put(url, permisos).map( resp => resp ).catch(this.handleError);
  }

  public deletePermisos( $id ) {
    const url = this.environmentService.setApiServiceById(this.endpointPermisos, $id);
    return this._http.delete(url).map( resp => resp ).catch(this.handleError);
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
