 import { CanActivateFn, Router } from '@angular/router';
import { inject, PLATFORM_ID } from '@angular/core';
import { AuthService } from './auth.service';
import { isPlatformBrowser } from '@angular/common';


export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router)
  const isBrowser = isPlatformBrowser(inject(PLATFORM_ID))
  if (isBrowser) {
      const token = localStorage.getItem('authToken'); // Check for token in local storage
  } 
  const authService = inject(AuthService)
  if (authService.isLoggedIn()) {    
    return true; // Allow access if token exists
  } else {
    router.navigate(['/login']); // Redirect to login if no token
    return false;
}
}

export const loginGuard: CanActivateFn = (route, state) => {
  const router = inject(Router)
  const authService = inject(AuthService)
  if (authService.isLoggedIn()) {
    router.navigate(['/dashboard']) // redirect to dashboard
    return false; 
  }
  return true
  
}

