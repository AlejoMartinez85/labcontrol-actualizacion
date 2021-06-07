import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { EnvironmentService } from '../../shared/environment';

@Injectable({
  providedIn: 'root'
})
export class AlertasService {

  constructor(private _http: HttpClient,
    private environmentService: EnvironmentService) { }

    public get($id) {
      let url = this.environmentService.setApiServiceById('alertaid', $id);
      return this._http.get(url)
        .map(res => res['Alertas'])
        .catch(this.handleError);
    }
    delete($id, userData) {
      let url = this.environmentService.setApiServiceById('alerta', $id);
      userData.logicalerasure = true;
      return this._http.delete(url, userData)
        .map(res => res['alertaDeleted'])
        .catch(this.handleError);
    }
    update($id, userData) {
      let url = this.environmentService.setApiServiceById('alerta', $id);
      return this._http.put(url, userData)
        .map(res => res['Alerta'])
        .catch(this.handleError);
    }
    add(userData) {
      let url = this.environmentService.setApiService('alerta');
      return this._http.post(url, userData)
        .map(res => res['alerta'])
        .catch(this.handleError);
    }
    editAlertaValor(valores){
      let url = this.environmentService.setApiService('alertaidvalor');
      return this._http.put(url, valores)
        .map(res => res)
        .catch(this.handleError);
    }
    private handleError(error: HttpErrorResponse | any) {
      let errMsg: string;
      errMsg = error.error;
      return Observable.throw(errMsg);
  
    }

}
