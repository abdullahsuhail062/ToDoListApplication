import { Component, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { AuthService } from './authFiles/auth.service';
import { AuthStore } from './authFiles/auth-store';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('ToDoListApplication');


  constructor(private router: Router, private authStore: AuthStore) {}

  ngOnInit(): void {
    // Check on app initialization/resume
    if (!this.authStore.isLoggedIn()) {
      // If not logged in (token expired or not present), logout and navigate to login
      this.authStore.clear() // logout now handles navigation to /login
    } else {
      // If logged in, navigate to dashboard
      this.router.navigate(['/dashboard']);
    }
  }
}
