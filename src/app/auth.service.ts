import { Injectable, signal, computed } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly TOKEN_KEY = 'authToken';
  private readonly TASK_ID = 'taskId';

  // Signals for reactive state
  private tokenSignal = signal<string | null>(localStorage.getItem(this.TOKEN_KEY));
  private taskIdSignal = signal<string | null>(localStorage.getItem(this.TASK_ID));

  // Computed signal to check login status
  readonly isLoggedIn = computed(() => {
    const token = this.tokenSignal();
    return token != null && !this.isTokenExpired(token);
  });

  constructor(private router: Router) {}

  /** Save JWT token and update signal */
  saveToken(token: string) {
    localStorage.setItem(this.TOKEN_KEY, token);
    this.tokenSignal.set(token); // update reactive signal
  }

  /** Get token value */
  getToken(): string | null {
    return this.tokenSignal();
  }

  /** Delete token */
  deleteToken() {
    localStorage.removeItem(this.TOKEN_KEY);
    this.tokenSignal.set(null);
  }

  /** Logout user */
  logout() {
    this.deleteToken();
    this.router.navigate(['/login']);
  }

  /** Decode JWT and check expiration */
  private isTokenExpired(token: string): boolean {
    if (!token || typeof token !== 'string') return true;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const exp = payload.exp * 1000; // milliseconds
      return Date.now() >= exp;
    } catch (error) {
      console.error('Failed to parse token:', error);
      return true;
    }
  }

  /** Task ID reactive methods */
  storeTaskId(taskId: string) {
    localStorage.setItem(this.TASK_ID, taskId);
    this.taskIdSignal.set(taskId);
  }

  deleteTask() {
    localStorage.removeItem(this.TASK_ID);
    this.taskIdSignal.set(null);
  }

  getTaskId(): string | null {
    return this.taskIdSignal();
  }

  /** Expose signals for components to subscribe */
  get token() {
    return this.tokenSignal.asReadonly();
  }

  get taskId() {
    return this.taskIdSignal.asReadonly();
  }
}
