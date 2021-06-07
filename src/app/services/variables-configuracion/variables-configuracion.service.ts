import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { EnvironmentService } from '../../shared/environment';

@Injectable({
  providedIn: 'root'
})
export class VariablesConfiguracionService {

  constructor(private _http: HttpClient,
    private environmentService: EnvironmentService) { }
    
    public get($id) {
      let url = this.environmentService.setApiServiceById('confivariableid', $id);
      return this._http.get(url)
        .map(res => res['configuraciones'])
        .catch(this.handleError);
    }
    public getId($id) {
      let url = this.environmentService.setApiServiceById('confivariable', $id);
      return this._http.get(url)
        .map(res => res['configuracion'])
        .catch(this.handleError);
    }
    updateValor($id, data) {
      let url = this.environmentService.setApiServiceById('confivariablevalor', $id);
      return this._http.put(url, data)
        .map(res => res['configuracion'])
        .catch(this.handleError);
    }
    private handleError(error: HttpErrorResponse | any) {
      let errMsg: string;
      errMsg = error.error;
      return Observable.throw(errMsg);
  
    }
}
