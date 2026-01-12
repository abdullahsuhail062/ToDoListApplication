import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { AuthStore } from './auth-store';
import { User } from './user-Interface';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly TOKEN_KEY = 'authToken';
    private readonly USER_KEY = 'authUser';
  private readonly isBrowser: boolean;

  constructor(
    private router: Router,
    private store: AuthStore,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);

    if (this.isBrowser) {
      const userString =localStorage.getItem(this.USER_KEY)
      const user = userString ? JSON.parse(userString) : null;
      const token = localStorage.getItem(this.TOKEN_KEY);
      if (token && !this.isTokenExpired(token)) {
        this.store.setSession({token: token, user: user})
      } else {
        this.clearToken();
      }
    }
  }

  saveToken(token: string, user: User) {
    if (this.isBrowser) {
      localStorage.setItem(this.TOKEN_KEY, token);
      localStorage.setItem(this.USER_KEY,  JSON.stringify(user))
    }
    this.store.setSession({token, user})
  }

  logout() {
    this.clearToken();
    this.router.navigate(['/login']);
  }

  private clearToken() {
    if (this.isBrowser) {
      localStorage.removeItem(this.TOKEN_KEY);
    }
    this.store.clear();
  }

  private isTokenExpired(token: string): boolean {
    if (!this.isBrowser) return true;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return Date.now() >= payload.exp * 1000;
    } catch {
      return true;
    }
  }
}
