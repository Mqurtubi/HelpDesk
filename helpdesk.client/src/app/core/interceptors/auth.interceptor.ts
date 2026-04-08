import { HttpInterceptorFn } from '@angular/common/http';
import { Observable } from 'rxjs'
import { AuthService } from '../services/auth.service'
import { inject } from '@angular/core';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService)
  const token = authService.getToken();
    if (!token) {
      next(req)
    }
    const clonedRequest = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    })
    return next(clonedRequest);
};
