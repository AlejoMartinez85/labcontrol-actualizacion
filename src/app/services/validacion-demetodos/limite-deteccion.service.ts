import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { EnvironmentService } from '../../shared/environment';

@Injectable({
  providedIn: 'root'
})
export class LimiteDeteccionService {

  endPoint: string = 'limite-de-tencion';
  constructor(private _http: HttpClient,
    private environmentService: EnvironmentService) { }

  public create(LOD_LOQ) {
    console.log(LOD_LOQ)
    const url = this.environmentService.setApiService(this.endPoint);
    console.log(this._http.post(url, LOD_LOQ))
    return this._http.post(url, LOD_LOQ)
      .map(res => res)
      .catch(this.handleError);
  }

  public get($id) {
    const url = this.environmentService.setApiServiceById(this.endPoint, $id);
    return this._http.get(url).map( res => res ).catch(this.handleError);
  }

  public delete($id) {
    const url = this.environmentService.setApiServiceById(this.endPoint, $id);
    return this._http.delete(url).map( res => res ).catch(this.handleError);
  }
  public edit(LOD_LOQ) {
    console.log(LOD_LOQ)
    const url = this.environmentService.setApiServiceById(this.endPoint, LOD_LOQ._id);
    return this._http.put(url, LOD_LOQ)
      .map(res => res)
      .catch(this.handleError);
  }
  private handleError(error: HttpErrorResponse | any) {
    let errMsg: string;
    errMsg = error.error;
    return Observable.throw(errMsg);

  }

}
