import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { EnvironmentService } from '../../shared/environment';

@Injectable({
  providedIn: 'root'
})
export class VariablesConfigValidacionService {

  private endPoint: string = 'variablesConfigValidacion';
  constructor(private _http: HttpClient,
    private environmentService: EnvironmentService) { }

  public create(variable) {
    const url = this.environmentService.setApiService(this.endPoint);
    return this._http.post(url, variable)
      .map(res => res)
      .catch(this.handleError);
  }

  private handleError(error: HttpErrorResponse | any) {
    let errMsg: string;
    errMsg = error.error;
    return Observable.throw(errMsg);

  }
}
