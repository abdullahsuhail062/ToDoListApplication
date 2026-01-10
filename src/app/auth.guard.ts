 import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';


export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router)
  const token = localStorage.getItem('authToken'); // Check for token in local storage
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

