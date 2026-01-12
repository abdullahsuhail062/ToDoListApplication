import { CanActivateFn, Router } from '@angular/router';
import { AuthStore } from './auth-store';
import { inject } from '@angular/core';


export const loginGuardGuard: CanActivateFn = (route, state) => {
    const store = inject(AuthStore);
    const router = inject(Router);
  
    if (!store.isLoggedIn()) {
      router.navigate(['/dashboard']);
      return false;
    }
  
    return true;
  
    
  
};
