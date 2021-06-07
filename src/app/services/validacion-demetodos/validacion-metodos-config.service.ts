import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { EnvironmentService } from '../../shared/environment';

@Injectable({
  providedIn: 'root'
})
export class ValidacionMetodosConfigService {

  private endPoint: string = 'validaciondemotedo';
  constructor(private _http: HttpClient,
    private environmentService: EnvironmentService) { }

  public get() {
    const url = this.environmentService.setApiService('validaciondemotedoforuser');
    return this._http.get(url)
      .map(res => res)
      .catch(this.handleError);
  }
  public getId($id) {
    const url = this.environmentService.setApiServiceById(this.endPoint, $id);
    return this._http.get(url)
      .map(res => res)
      .catch(this.handleError);
  }
  public create(validacion) {
    const url = this.environmentService.setApiService(this.endPoint);
    return this._http.post(url, validacion)
      .map(res => res)
      .catch(this.handleError);
  }

  public delete($id) {
    const url = this.environmentService.setApiServiceById(this.endPoint, $id);
    return this._http.delete(url).map(res => res).catch(this.handleError);
  }

  public edit(validacion) {
    const url = this.environmentService.setApiServiceById(this.endPoint, validacion._id);
    return this._http.put(url, validacion).map(resp => resp).catch(this.handleError);
  }
  public editPdf(validacion) {
    const url = this.environmentService.setApiServiceById('validaciondemotedo-pdf', validacion._id);
    return this._http.put(url, validacion).map(resp => resp).catch(this.handleError);
  }

  private handleError(error: HttpErrorResponse | any) {
    let errMsg: string;
    errMsg = error.error;
    return Observable.throw(errMsg);

  }

  public async patchValidation(id: string, key: string, value: boolean): Promise<any> {
    const body = { key, value }
    const url = this.environmentService.setApiService(`validaciondemotedoforuser/${id}/validation`);
    return this._http.patch(url, body).toPromise();
  }
}
