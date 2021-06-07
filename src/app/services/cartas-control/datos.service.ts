import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { EnvironmentService } from '../../shared/environment';
@Injectable({
  providedIn: 'root'
})
export class DatosService {

  constructor(private _http: HttpClient,
    private environmentService: EnvironmentService) { }
  public getAll(id) {
    let url = this.environmentService.setApiServiceById('datos', id);
    return this._http.get(url)
      .map(res => res['datos'])
      .catch(this.handleError);
  }
  public getOne(id) {
    let url = this.environmentService.setApiServiceById('dato', id);
    return this._http.get(url)
      .map(res => res['dato'])
      .catch(this.handleError);
  }
  public update($id, dato) {
    let url = this.environmentService.setApiServiceById('dato', $id);
    return this._http.put(url, dato)
      .map(res => res)
      .catch(this.handleError);
  }
  public create(dato) {
    let url = this.environmentService.setApiService('dato');
    return this._http.post(url, dato)
      .map(res => res)
      .catch(this.handleError);
  }
  public delete($id) {
    let url = this.environmentService.setApiServiceById('dato', $id);
    return this._http.delete(url)
      .map(res => res)
      .catch(this.handleError);
  }
  public updateDatosValor(dato) {
    const url = this.environmentService.setApiServiceById('dato-valores', dato._id);
    return this._http.put(url, dato).map( res => res).catch(this.handleError);
  }
  private handleError(error: HttpErrorResponse | any) {
    let errMsg: string;
    errMsg = error.error;
    return Observable.throw(errMsg);
  }

}
