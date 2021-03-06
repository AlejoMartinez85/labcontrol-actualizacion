import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { AuthService } from 'ngx-auth';
import 'rxjs/add/operator/do';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { TokenStorage } from './token-storage.service';
import { EnvironmentService } from '../environment/environment.service';
import { Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';

interface AccessData {
  token: string;
  refresh_token: string;
}

@Injectable()
export class AuthenticationService implements AuthService {

  constructor(
    private http: HttpClient,
    private tokenStorage: TokenStorage,
    private environmentService: EnvironmentService,
    private router: Router,

  ) { }

  /**
   * Check, if user already authorized.
   * @description Should return Observable with true or false values
   * @returns {Observable<boolean>}
   * @memberOf AuthService
   */
  public isAuthorized(): Observable<boolean> {
    return this.tokenStorage
      .getAccessToken()
      .map(token => !!token);
  }

  /**
   * Get access token
   * @description Should return access token in Observable from e.g.
   * localStorage
   * @returns {Observable<string>}
   */
  public getAccessToken(): Observable<string> {
    return this.tokenStorage.getAccessToken();
  }

  /**
   * Function, that should perform refresh token verifyTokenRequest
   * @description Should be successfully completed so interceptor
   * can execute pending requests or retry original one
   * @returns {Observable<any>}
   */
  public refreshToken(): Observable<any> {
    var service = this.environmentService.setAuthService('oauth/token/refresh');
    return this.tokenStorage
      .getRefreshToken()
      .pipe(
        switchMap((refreshToken: string) => {
          return this.http.post(service, { refreshToken });
        })
      )
      .do(this.saveAccessData.bind(this))
      .catch(err => {
        this.logout();
        return Observable.throw(err);
      });
  }

  /**
   * Function, checks response of failed request to determine,
   * whether token be refreshed or not.
   * @description Essentialy checks status
   * @param {Response} response
   * @returns {boolean}
   */
  public refreshShouldHappen(response: HttpErrorResponse): boolean {
    return false
  }

  /**
   * Verify that outgoing request is refresh-token,
   * so interceptor won't intercept this request
   * @param {string} url
   * @returns {boolean}
   */
  public verifyTokenRequest(url: string): boolean {
    return url.endsWith('/refresh');
  }

  /**
   * EXTRA AUTH METHODS
   */

  public login(loginData): Observable<any> {
    let service = this.environmentService.setAuthService('auth/login');
    let loginFormData = this.environmentService.setLoginJson(loginData);
    return this.http.post(service, loginFormData)
      .do((tokens: AccessData) => this.saveAccessData(tokens));
  }

  /**
   * EXTRA AUTH METHODS
   */

  public registrar(loginData): Observable<any> {
    loginData.email = loginData.email != undefined ? loginData.email : loginData.email_contacto;
    let service = this.environmentService.setAuthService('auth/signup');
    let loginFormData = this.environmentService.setLoginJson(loginData);
    return this.http.post(service, loginFormData)
      .do((tokens: AccessData) => { })
      .catch(this.handleError);
  }

  /**
   * Logout
   */
  public logout(): void {
    this.tokenStorage.clear();
    this.router.navigateByUrl('/auth/login/simple');
  }

  /**
   * Save access data in the storage
   *
   * @private
   * @param {AccessData} data
   */
  private saveAccessData({ token, refresh_token }: AccessData) {
    this.tokenStorage
      .setAccessToken(token)
      .setRefreshToken(refresh_token);
  }

  private handleError(error: HttpErrorResponse | any) {
    let errMsg: string;
    errMsg = error.error;
    return Observable.throw(errMsg);

  }

}
