import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, pipe, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { GeneralService } from '../services';

@Injectable()
export class ShopInterceptor implements HttpInterceptor {

  constructor(private generalService :GeneralService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

    return next.handle(request).pipe(
      catchError(error => {
        if (error instanceof HttpErrorResponse && error.status === 402 ) {
          this.generalService.shopDisabled$.next(true);
        }
        return throwError(error);
      }));
  }
}
