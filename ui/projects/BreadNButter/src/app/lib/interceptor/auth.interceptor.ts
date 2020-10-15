import { Injectable } from '@angular/core';

import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { environment } from  '../../../environments/environment';
import { catchError, switchMap, filter, take } from 'rxjs/operators';
import { UserService, SettingService } from '../services';
import Notiflix from "notiflix";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(private userService: UserService,
    private settingService:SettingService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    let  authReq = request;

    let token = localStorage.getItem('token');
    if (token) {
      token = JSON.parse(token);
      request = this.addToken(request, token);
    }

    // if(request.url.includes(environment.baseUrl)){
    //   let headers = request.headers
    //   .set('Authorization', `bearer ${token}`)
    //  // .set('Content-Type', 'application/json; charset=utf-8');
    //   request = request.clone({ headers });
    // }
    return next.handle(request).pipe(
      catchError(error => {

        if (error instanceof HttpErrorResponse && error.status === 401 ) {
          if(!request.url.includes("oauth/token")){
            return this.handle401Error(request, next);
          }

          return next.handle(request);
        } else if(error instanceof HttpErrorResponse && error.status === 410){
          this.settingService.isMaintanance$.next(true);
          return throwError(error);
        }else{
          return throwError(error);
        }
      })
    );
  }


  private handle401Error(request: HttpRequest<any>, next: HttpHandler) {

    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      return this.userService.refreshToken().pipe(
        switchMap((token: any) => {
          this.isRefreshing = false;
          if(token.token){
            this.refreshTokenSubject.next(token);
            return next.handle(this.addToken(request, token));
          }else{
            this.isRefreshing = false;
            return next.handle(request);
          }


        }), catchError(er=> {
          this.isRefreshing = false;
          return throwError(er);
          //return next.handle(request);
        }));

    } else {

      return this.refreshTokenSubject.pipe(
        filter(token => token != null),
        take(1),
        switchMap(token => {
          return next.handle(this.addToken(request, token));
        }));
    }
  }

  private addToken(request: HttpRequest<any>, token: any) {
    if(request.url.includes(environment.baseUrl)){
      return request.clone({
        setHeaders: {
          'Authorization': `${token.token_type} ${token.access_token}`
        }
      });
    } else{
      return request;
    }
  }

}
