import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { EnvironmentService } from '../../shared/environment';

@Injectable({
  providedIn: 'root'
})
export class CartasControlService {

  constructor(private _http: HttpClient,
    private environmentService: EnvironmentService) { }

    // Trae todas las cartas

    public getAll(desde) {
      let url = this.environmentService.setApiService('cartas');
      url += '?desde=' + desde;
      return this._http.get(url)
        .map(res => res['cartas'])
        .catch(this.handleError);
    }
    getBuscarCartasControl(busqueda) {
      let url = this.environmentService.setApiServiceById('cartas_busqueda', busqueda);
      return this._http.get(url)
        .map(res => res)
        .catch(this.handleError);
    }
    // trae una carta por el id
    public getId($id) {
      let url = this.environmentService.setApiServiceById('cartasid', $id);
      return this._http.get(url)
        .map(res => res['carta'])
        .catch(this.handleError);
    }


    public add(carta) {
      let url = this.environmentService.setApiService('carta');
      return this._http.post(url, carta)
        .map(res => res['carta'])
        .catch(this.handleError);
    }

    // Edita una carta
    public update($id, carta) {
      let url = this.environmentService.setApiServiceById('carta', $id);
      return this._http.put(url, carta)
        .map(res => res['cartaEdit'])
        .catch(this.handleError);
    }
    public updateTable($id, carta) {
      let url = this.environmentService.setApiServiceById('carta-table', $id);
      return this._http.put(url, carta)
        .map(res => res['cartaEdit'])
        .catch(this.handleError);
    }

    // Edita valores de la carta carta
    public updateValores($id, carta) {
      let url = this.environmentService.setApiServiceById('cartaid', $id);
      return this._http.put(url, carta)
        .map(res => res)
        .catch(this.handleError);
    }
    // Edita la cantidad de datos.
    public updateNuneroDatos($id, carta) {
      let url = this.environmentService.setApiServiceById('cartaNdatos', $id);
      return this._http.put(url, carta)
        .map(res => res)
        .catch(this.handleError);
    }
    // Edita valores de la carta carta
    public updateModalAjustes($id, carta) {
      let url = this.environmentService.setApiServiceById('cartaModalAjustes', $id);
      return this._http.put(url, carta)
        .map(res => res)
        .catch(this.handleError);
    }

    // Elimina una carta
    public delete($id) {
      let url = this.environmentService.setApiServiceById('carta', $id);
      return this._http.delete(url)
        .map(res => res['carta'])
        .catch(this.handleError);
    }

    private handleError(error: HttpErrorResponse | any) {
      let errMsg: string;
      errMsg = error.error;
      return Observable.throw(errMsg);
    }

  }
