import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { EnvironmentService } from '../../shared/environment';

@Injectable({
  providedIn: 'root'
})
export class DerivaIstrumentalService {

  constructor(private _http: HttpClient,
    private environmentService: EnvironmentService) { }

  public addDerivadaInstrumental(derivada) {
    let url = this.environmentService.setApiService('estimacionpuntoscalibracion');
    return this._http.post(url, derivada)
      .map(res => res)
      .catch(this.handleError);
  }
  public addPuntoDerivadaInstrumental(punto) {
    let url = this.environmentService.setApiService('puntocalibracion');
    return this._http.post(url, punto)
      .map(res => res)
      .catch(this.handleError);
  }
  public addAnnoPuntoDerivadaInstrumental(anno) {
    let url = this.environmentService.setApiService('annocalibracion');
    return this._http.post(url, anno)
      .map(res => res)
      .catch(this.handleError);
  }
  public addAnnoValorPuntoDerivadaInstrumental(valor) {
    let url = this.environmentService.setApiService('annovalorescalibracion');
    return this._http.post(url, valor)
      .map(res => res)
      .catch(this.handleError);
  }
  public addexactitudPuntoDerivadaInstrumental(valor) {
    let url = this.environmentService.setApiService('exactitudcalibracion');
    return this._http.post(url, valor)
      .map(res => res)
      .catch(this.handleError);
  }
  public getAllAnnoPuntoDerivadaInstrumentalID($id) {
    let url = this.environmentService.setApiServiceById('annocalibracion', $id);
    return this._http.get(url)
      .map(res => res)
      .catch(this.handleError);
  }
  public getAllexactitudPuntoDerivadaInstrumentalID($id) {
    let url = this.environmentService.setApiServiceById('exactitudcalibracion', $id);
    return this._http.get(url)
      .map(res => res)
      .catch(this.handleError);
  }
  public getAllEstimacionPuntoDerivadaInstrumentalID($id) {
    let url = this.environmentService.setApiServiceById('estimacionpuntoscalibracion', $id);
    return this._http.get(url)
      .map(res => res)
      .catch(this.handleError);
  }
  public getAllPuntoDerivadaInstrumentalID($id) {
    let url = this.environmentService.setApiServiceById('puntocalibracion', $id);
    return this._http.get(url)
      .map(res => res)
      .catch(this.handleError);
  }
  public getAllAnioValorPuntoDerivadaInstrumentalID($id) {
    let url = this.environmentService.setApiServiceById('annovalorescalibracion', $id);
    return this._http.get(url)
      .map(res => res)
      .catch(this.handleError);
  }
  public getAllExactitudes() {
    let url = this.environmentService.setApiService('estimacionpuntoscalibracion');
    return this._http.get(url)
      .map(res => res)
      .catch(this.handleError);
  }

  public deleteAnnioPuntoDerivadaInstrumental($id) {
    let url = this.environmentService.setApiServiceById('annocalibracion', $id);
    return this._http.delete(url)
      .map(res => res)
      .catch(this.handleError);
  }

  public deleteAnnioValorPuntoDerivadaInstrumental($id) {
    let url = this.environmentService.setApiServiceById('annovalorescalibracion', $id);
    return this._http.delete(url)
      .map(res => res)
      .catch(this.handleError);
  }
  public deleteExactutudPuntoDerivadaInstrumental($id) {
    let url = this.environmentService.setApiServiceById('exactitudcalibracion', $id);
    return this._http.delete(url)
      .map(res => res)
      .catch(this.handleError);
  }
  public deletedPuntoDerivadaInstrumental($id) {
    let url = this.environmentService.setApiServiceById('puntocalibracion', $id);
    return this._http.delete(url)
      .map(res => res)
      .catch(this.handleError);
  }
  public editAnnioValorPuntoDerivadaInstrumental($id, valor) {
    let url = this.environmentService.setApiServiceById('annovalorescalibracion', $id);
    return this._http.put(url, valor)
      .map(res => res)
      .catch(this.handleError);
  }
  public editPuntoDerivadaInstrumental($id, valor) {
    let url = this.environmentService.setApiServiceById('puntocalibracion', $id);
    return this._http.put(url, valor)
      .map(res => res)
      .catch(this.handleError);
  }
  public editExactitudPuntoDerivadaInstrumental($id, valor) {
    let url = this.environmentService.setApiServiceById('exactitudcalibracion', $id);
    return this._http.put(url, valor)
      .map(res => res)
      .catch(this.handleError);
  }
  /**
   * Función de manejo de errores
   */

  private handleError(error: HttpErrorResponse | any) {
    let errMsg: string;
    errMsg = error.error;
    return Observable.throw(errMsg);
  }
}
