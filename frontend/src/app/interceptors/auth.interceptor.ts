import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';

import { environment } from '../../environments/environment';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const token = this.authService.getToken();

    if (!token || !request.url.startsWith(environment.apiUrl)) {
      return next.handle(request).pipe(
        catchError((error) => throwError(() => error))
      );
    }

    const requestWithToken = request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });

    return next.handle(requestWithToken).pipe(
      catchError((error) => {
        if (error.status === 401) {
          this.authService.clearSession();
        }

        return throwError(() => error);
      })
    );
  }
}
