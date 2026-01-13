import { Injectable, signal, computed } from '@angular/core';
import { User } from './user-Interface';


@Injectable({ providedIn: 'root' })
export class AuthStore {
    private tokenSignal = signal<string | null>(null);
  private userSignal = signal<User | null>(null);

  readonly token = this.tokenSignal.asReadonly();
    readonly user = this.userSignal.asReadonly();


  readonly isLoggedIn = computed(() => {
    const token = this.tokenSignal();
    return !!token;
  });

   setSession(data:{token: string | null, user: User | null}) {
    this.tokenSignal.set(data.token);
    this.userSignal.set(data.user);
  }


  clear() {
    this.tokenSignal.set(null);
    this.userSignal.set(null)
  }
}
