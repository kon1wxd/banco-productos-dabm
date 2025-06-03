import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class HttpContentTypeInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!req.headers.has('Content-Type') && req.body) {
      const cloned = req.clone({
        setHeaders: { 'Content-Type': 'application/json' }
      });
      return next.handle(cloned);
    }
    return next.handle(req);
  }
}