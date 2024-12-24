// auth.guard.ts
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './services/auth.service';

export const authGuard: CanActivateFn = async () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  const isLoggedIn = await authService.isLoggedIn();
  if (!isLoggedIn) {
    router.navigate(['/login']);
    return false;
  }
  return true;
};