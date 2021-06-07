import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { EnvironmentService } from '../../shared/environment';

@Injectable({
  providedIn: 'root'
})
export class SensibilidadService {

  endPoint: string = 'sensibilidad';
  constructor(private _http: HttpClient,
    private environmentService: EnvironmentService) { }
  create(Sensibilidad) {
    const url = this.environmentService.setApiService(this.endPoint);
    return this._http.post(url, Sensibilidad)
      .map(res => res)
      .catch(this.handleError);
  }

  get($id) {
    const url = this.environmentService.setApiServiceById(this.endPoint, $id);
    return this._http.get(url)
      .map(res => res)
      .catch(this.handleError);
  }

  edit(Sensibilidad) {
    const url = this.environmentService.setApiServiceById(this.endPoint, Sensibilidad._id);
    return this._http.put(url, Sensibilidad).map(resp => resp).catch(this.handleError);
  }

  delete($id) {
    const url = this.environmentService.setApiServiceById(this.endPoint, $id);
    return this._http.delete(url).map(resp => resp).catch(this.handleError);
  }

  private handleError(error: HttpErrorResponse | any) {
    let errMsg: string;
    errMsg = error.error;
    return Observable.throw(errMsg);

  }
}
