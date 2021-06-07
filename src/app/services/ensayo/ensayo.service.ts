import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { EnvironmentService } from '../../shared/environment';

@Injectable({
  providedIn: 'root'
})
export class EnsayoService {

  constructor(private _http: HttpClient,
    private environmentService: EnvironmentService) { }

    public getAllEnsayos(page){
      let url = this.environmentService.setApiServiceWithPage('Allensayo', page);
      return this._http.get(url)
        .map(res => res)
        .catch(this.handleError);
    }
  
  public get(page) {
    let url = this.environmentService.setApiServiceWithPage('ensayo', page);
    return this._http.get(url)
      .map(res => res)
      .catch(this.handleError);
  }
  public getpasos(page) {
    let url = this.environmentService.setApiServiceWithPage('ensayoPasos', page);
    return this._http.get(url)
      .map(res => res)
      .catch(this.handleError);
  }
  public getEstado(page, estado) {
    let url = this.environmentService.setApiServiceWithPage('ensayo', page);
    url += '&estado=' + estado;
    return this._http.get(url)
      .map(res => res)
      .catch(this.handleError);
  }
  public getClienteCLi(cliente, page, estado) {
    let url = this.environmentService.setApiServiceWithPage('ensayo/ensayocli/' + cliente, page);
    url += '&estado=' + estado;
    return this._http.get(url)
      .map(res => res)
      .catch(this.handleError);
  }
  public getClienteLab(cliente, page, estado) {
    let url = this.environmentService.setApiServiceWithPage('ensayo/ensayolab/' + cliente, page);
    url += '&estado=' + estado;
    return this._http.get(url)
      .map(res => res)
      .catch(this.handleError);
  }



  add(userData) {
    let url = this.environmentService.setApiService('ensayo');
    return this._http.post(url, userData)
      .map(res => res)
      .catch(this.handleError);
  }


  getById($id) {
    let url = this.environmentService.setApiServiceById('ensayo', $id);
    return this._http.get(url)
      .map(res => res)
      .catch(this.handleError);
  }
  getReporte($id) {
    let url = this.environmentService.setApiServiceById('ensayo/getreporte', $id);
    return this._http.get(url)
      .map(res => res)
      .catch(this.handleError);
  }

  update(userData) {
    let url = this.environmentService.setApiServiceById('ensayo', userData._id);
    return this._http.put(url, userData)
      .map(res => res)
      .catch(this.handleError);
  }
  updatePaso(userData) {
    let url = this.environmentService.setApiServiceById('ensayoPaso', userData._id);
    return this._http.put(url, userData)
      .map(res => res)
      .catch(this.handleError);
  }

  cargarArchivo(userData, $id) {
    let url = this.environmentService.setApiServiceById('uploads', $id);
    return this._http.put(url, userData)
      .map(res => res)
      .catch(this.handleError);
  }

  updatecomponent(userData) {
    let url = this.environmentService.setApiService('ensayo');
    return this._http.post(url, userData)
      .map(res => res)
      .catch(this.handleError);
  }
  delete($id) {
    let url = this.environmentService.setApiServiceById('ensayo', $id);
    return this._http.delete(url)
      .map(res => res)
      .catch(this.handleError);
  }

  subePDF(archivo:File, $id) {
    try {
      const formData = new FormData();
      formData.append('pdf', archivo);
      let url = this.environmentService.setApiServiceById('uploads', $id);
      return this._http.put(url, formData)
      .map(res => res)
      .catch(this.handleError);
    } catch (error) {
      console.log(error);
      return;
    }
  }
  private handleError(error: HttpErrorResponse | any) {
    let errMsg: string;
    errMsg = error.error;
    return Observable.throw(errMsg);

  }

}
