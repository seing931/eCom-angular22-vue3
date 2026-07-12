import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../core/services/auth.service';
import { CookieService } from 'ngx-cookie-service';

export const authGuard: CanActivateFn = async (route, state) => {
  const authService = inject(AuthService);
  const cookieService = inject(CookieService);
  const router = inject(Router);

  // 1. Wait for localforage memory setup to finalize
  await authService.isReady;

  // 2. Double-check memory state OR verify the raw cookie directly
  const hasMemoryToken = authService.isLoggedIn();
  const hasRawCookie = cookieService.check('auth_token');

  if (hasMemoryToken || hasRawCookie) {
    return true; // Pass through to allow the dashboard component to make its API calls
  }

  // 3. Fallback: Block navigation and send back to login
  return router.createUrlTree(['/login']);
};