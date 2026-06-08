import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { Auth } from '../services/auth';

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(Auth);
  const router = inject(Router);

  if (authService.isLoggedIn() && authService.getRole() === 'admin') {
    return true;
  }
  
  router.navigate(['/login']);
  return false;
};

export const customerGuard: CanActivateFn = (route, state) => {
  const authService = inject(Auth);
  const router = inject(Router);

  if (authService.isLoggedIn() && authService.getRole() === 'customer') {
    return true;
  }
  
  router.navigate(['/login']);
  return false;
};
