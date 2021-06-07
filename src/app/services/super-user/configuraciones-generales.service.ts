import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { EnvironmentService } from '../../shared/environment';


@Injectable({
  providedIn: 'root'
})
export class ConfiguracionesGeneralesService {

  private endpoint = 'restriccion';

  constructor(private _http: HttpClient,
    private environmentService: EnvironmentService) { }

  public getAllUsers() {
    let url = this.environmentService.setApiService('restriccion-superUser');
    return this._http.get(url)
      .map(res => res)
      .catch(this.handleError);
  }

  public get() {
    let url = this.environmentService.setApiService(this.endpoint);
    return this._http.get(url)
      .map(res => res)
      .catch(this.handleError);
  }

  public getRestriccionForUser($tercero) {
    const url = this.environmentService.setApiServiceById('restriccion-user', $tercero);
    return this._http.get(url)
      .map(res => res)
      .catch(this.handleError);
  }

  public create(restriccion){
    const url = this.environmentService.setApiService(this.endpoint);
    return this._http.post(url, restriccion).map(res => res).catch(this.handleError);
  }
  public getId($id) {
    const url = this.environmentService.setApiServiceById(this.endpoint, $id);
    return this._http.get(url).map(res => res).catch(this.handleError);
  }
  public update(restriccion){
    const url = this.environmentService.setApiServiceById(this.endpoint, restriccion._id);
    return this._http.put(url, restriccion).map(res => res).catch(this.handleError);
  }
  public delete($id) {
    const url = this.environmentService.setApiServiceById(this.endpoint, $id);
    return this._http.delete(url).map(resp => resp).catch(this.handleError);
  }
  private handleError(error: HttpErrorResponse | any) {
    let errMsg: string;
    errMsg = error.error;
    return Observable.throw(errMsg);

  }

}
