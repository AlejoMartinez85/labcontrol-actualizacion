import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { EnvironmentService } from '../../shared/environment';

@Injectable({
  providedIn: 'root'
})
export class PrecisionService {

  endPoint: string = 'presicion';
  constructor(private _http: HttpClient,
    private environmentService: EnvironmentService) { }

  public create(presicion) {
    const url = this.environmentService.setApiService(this.endPoint);
    return this._http.post(url, presicion)
      .map(res => res)
      .catch(this.handleError);
  }

  public get($id) {
    const url = this.environmentService.setApiServiceById(this.endPoint, $id);
    return this._http.get(url)
      .map(res => res)
      .catch(this.handleError);
  }
  public getMatrices($id) {
    const url = this.environmentService.setApiServiceById('presicion-matices', $id);
    return this._http.get(url)
      .map(res => res)
      .catch(this.handleError);
  }

  public delete($id) {
    const url = this.environmentService.setApiServiceById(this.endPoint, $id);
    return this._http.delete(url)
      .map(res => res)
      .catch(this.handleError);
  }

  public edit(presicion) {
    const url = this.environmentService.setApiServiceById(this.endPoint, presicion._id);
    return this._http.put(url, presicion)
      .map(res => res)
      .catch(this.handleError);
  }

  private handleError(error: HttpErrorResponse | any) {
    let errMsg: string;
    errMsg = error.error;
    return Observable.throw(errMsg);

  }

}
