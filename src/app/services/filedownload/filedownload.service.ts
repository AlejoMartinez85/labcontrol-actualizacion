import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { EnvironmentService } from '../../shared/environment';

@Injectable({
  providedIn: 'root'
})
export class FiledownloadService {

  constructor(private _http: HttpClient,
              private environmentService: EnvironmentService) { }

  download(id_ensayo) {
    let aut = "Bearer " + localStorage.getItem('access_token');
    let headers = new HttpHeaders();
    headers.append('Authorization', aut);
    let url = this.environmentService.setApiService('pdf/ensayo/' + id_ensayo);
    return this._http
      .get(url, {
        headers: headers,
        responseType: "arraybuffer"
      })
      .map((response) => new Blob([response], { type: 'application/pdf' }))
      .catch(this.handleError);
  }
  private handleError(error: HttpErrorResponse | any) {
    let errMsg: string;
    errMsg = error.error;
    console.error(errMsg);
    return Observable.throw(errMsg);
  }

}
