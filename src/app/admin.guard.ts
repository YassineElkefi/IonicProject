// admin.guard.ts
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { AuthService } from './services/auth.service';

export const adminGuard: CanActivateFn = async () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  const user = await firstValueFrom(authService.getCurrentUser());
  
  if (!user?.isAdmin) {
    router.navigate(['/home']);
    return false;
  }
  return true;
};
