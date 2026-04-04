import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { Toaster } from '@/src/app/core/notification/toaster.service';
import { AuthStore } from '@/src/app/domains/auth/data-access/auth.store';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const toaster = inject(Toaster);
  const authStore = inject(AuthStore);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      // If we receive a 401 Unauthorized response
      if (error.status === 401) {
        const hasUser = localStorage.getItem('user');
        const hasSession = localStorage.getItem('authSession');

        if (hasUser || hasSession) {
          // Clear local storage
          localStorage.removeItem('user');
          localStorage.removeItem('authSession');
          
          // Clear the user from the store so the Header/UI updates immediately
          authStore.setUser(undefined);
          
          toaster.error('Your session has expired. Please sign in again.');
          router.navigate(['/']); // Redirect them to home
        }
      }
      
      return throwError(() => error);
    })
  );
};