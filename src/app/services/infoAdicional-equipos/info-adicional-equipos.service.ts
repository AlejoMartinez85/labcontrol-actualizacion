import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { EnvironmentService } from '../../shared/environment';
@Injectable({
  providedIn: 'root'
})
export class InfoAdicionalEquiposService {
  metodo = '';

  constructor(
    private _http: HttpClient,
    private environmentService: EnvironmentService) {
      this.metodo = 'info-adicional';
    }

    public get() {
      let url = this.environmentService.setApiService(this.metodo);
      return this._http.get(url)
        .map(res => res)
        .catch(this.handleError);
    }

    public getId(infoAdicional) {
      let url = this.environmentService.setApiServiceById(this.metodo, infoAdicional._id);
      return this._http.get(url)
        .map(res => res)
        .catch(this.handleError);
    }

    add(infoAdicional) {
      let url = this.environmentService.setApiService(this.metodo);
      return this._http.post(url, infoAdicional)
        .map(res => res)
        .catch(this.handleError);
    }

    update(infoAdicional) {
      let url = this.environmentService.setApiServiceById(this.metodo, infoAdicional._id);
      return this._http.put(url, infoAdicional)
        .map(res => res)
        .catch(this.handleError);
    }

    delete($id) {
      let url = this.environmentService.setApiServiceById(this.metodo, $id);
      return this._http.delete(url)
        .map(res => res)
        .catch(this.handleError);
    }

    private handleError(error: HttpErrorResponse | any) {
      let errMsg: string;
      errMsg = error.error;
      return Observable.throw(errMsg);
  
    }
}
