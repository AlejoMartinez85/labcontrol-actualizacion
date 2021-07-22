import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { Http, Response, RequestOptions, ResponseContentType, Headers } from '@angular/http';
import { EnvironmentService } from '../../shared/environment';

@Injectable({
  providedIn: 'root'
})
export class FiledownloadService {

  constructor(private _http: HttpClient,
              private environmentService: EnvironmentService,
              private httpd: Http) { }

  download(id_ensayo) {
    let aut = "Bearer " + localStorage.getItem('access_token');
    let headers = new Headers();
    headers.append('Authorization', aut);
    let options = new RequestOptions({
      headers: headers,
      responseType: ResponseContentType.Blob
    });
    let url = this.environmentService.setApiService('pdf/ensayo/' + id_ensayo);
    return this._http
      .get(url, options)
      .map((response: Response) => <Blob>response.blob())
      .catch(this.handleError);
  }
  private handleError(error: HttpErrorResponse | any) {
    let errMsg: string;
    errMsg = error.error;
    console.error(errMsg);
    return Observable.throw(errMsg);
  }

}
