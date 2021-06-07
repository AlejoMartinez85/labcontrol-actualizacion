import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

/* Models */
import { Accuracy } from '../../models/Accuracy';

/* Services */
import { EnvironmentService } from '../../shared/environment';

@Injectable({
  providedIn: 'root'
})
export class AccuracyService {

  private endpoint = 'accuracy';

  constructor(
    private _http: HttpClient,
    private environmentService: EnvironmentService
  ) {}

  public async getByValidationMethod(validationMethodId: string): Promise<any> {
    const url = this.environmentService.setApiService(`${this.endpoint}/${validationMethodId}`);
    return this._http.get(url).toPromise();
  }

  public async save(accuracy: Accuracy): Promise<any> {
    const body = { accuracy }
    const url = this.environmentService.setApiService(`${this.endpoint}/`);
    return this._http.put(url, body).toPromise();
  }

}
