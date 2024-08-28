import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from './auth.service'; // Adjust import path as necessary

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const currentUrl = state.url;

  if (authService.isLoggedIn()) {
    // If user is logged in and trying to access login or register, redirect to home
    if (currentUrl === '/login' || currentUrl === '/register') {
      router.navigate(['/home']);
      return false;
    }
    // Allow access to other routes if logged in
    return true;
  } else {
    // If user is not logged in and trying to access protected routes, redirect to login
    if (currentUrl !== '/login' && currentUrl !== '/register') {
      router.navigate(['/login']);
      return false;
    }
    // Allow access to login and register for unauthenticated users
    return true;
  }
};
