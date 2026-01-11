import { Injectable, signal, computed } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthStore {
  private tokenSignal = signal<string | null>(null);

  readonly token = this.tokenSignal.asReadonly();

  readonly isLoggedIn = computed(() => {
    const token = this.tokenSignal();
    return !!token;
  });

  setToken(token: string | null) {
    this.tokenSignal.set(token);
  }

  clear() {
    this.tokenSignal.set(null);
  }
}
