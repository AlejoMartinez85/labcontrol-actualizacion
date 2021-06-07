import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { EnvironmentService } from '../../shared/environment';

@Injectable({
  providedIn: 'root'
})
export class LinealidadService {

  endPoint: string = 'linealidad';
  constructor(private _http: HttpClient,
    private environmentService: EnvironmentService) { }

  create(linealidad) {
    const url = this.environmentService.setApiService(this.endPoint);
    return this._http.post(url, linealidad)
      .map(res => res)
      .catch(this.handleError);
  }

  get($id) {
    const url = this.environmentService.setApiServiceById(this.endPoint, $id);
    return this._http.get(url)
      .map(res => res)
      .catch(this.handleError);
  }

  edit(linealidad) {
    const url = this.environmentService.setApiServiceById(this.endPoint, linealidad._id);
    return this._http.put(url, linealidad).map( resp => resp ).catch(this.handleError);
  }

  delete($id) {
    const url = this.environmentService.setApiServiceById(this.endPoint, $id);
    return this._http.delete(url).map( resp => resp ).catch(this.handleError);
  }
  
  private handleError(error: HttpErrorResponse | any) {
    let errMsg: string;
    errMsg = error.error;
    return Observable.throw(errMsg);

  }

}
