import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

/* Models */
import { WorkInterval } from '../../models/WorkInterval';

/* Services */
import { EnvironmentService } from '../../shared/environment';

@Injectable({
  providedIn: 'root'
})
export class WorkIntervalService {

  private endpoint = 'workInterval';

  constructor(
    private _http: HttpClient,
    private environmentService: EnvironmentService
  ) {}

  public async getByValidationMethod(validationMethodId: string): Promise<any> {
    const url = this.environmentService.setApiService(`${this.endpoint}/${validationMethodId}`);
    return this._http.get(url).toPromise();
  }

  public async save(workInterval: WorkInterval): Promise<any> {
    const body = { workInterval }
    const url = this.environmentService.setApiService(`${this.endpoint}/`);
    return this._http.put(url, body).toPromise();
  }

}
