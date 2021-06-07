import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { EnvironmentService } from '../../shared/environment';

@Injectable({
  providedIn: 'root'
})
export class VariableService {

  constructor(private _http: HttpClient,
    private environmentService: EnvironmentService) { }

  public get(page) {
    let url = this.environmentService.setApiServiceWithPage('variable', page);
    return this._http.get(url)
      .map(res => res)
      .catch(this.handleError);
  }


  add(userData) {
    let url = this.environmentService.setApiService('variable');
    return this._http.post(url, userData)
      .map(res => res)
      .catch(this.handleError);
  }

  getById($id) {
    let url = this.environmentService.setApiServiceById('variable', $id);
    return this._http.get(url)
      .map(res => res)
      .catch(this.handleError);
  }

  update(userData) {
    let url = this.environmentService.setApiServiceById('variable', userData._id);
    return this._http.put(url, userData)
      .map(res => res)
      .catch(this.handleError);
  }

  updatecomponent(userData) {
    userData.logicalerasure = false;
    let url = this.environmentService.setApiServiceById('variable', userData._id);

    return this._http.post(url, userData)
      .map(res => res)
      .catch(this.handleError);
  }
  delete($id, userData) {
    let url = this.environmentService.setApiServiceById('variable', $id);
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
