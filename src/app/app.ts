import { Component, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { AuthService } from './authFiles/auth.service';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('ToDoListApplication');


  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    // Check on app initialization/resume
    if (!this.authService.isLoggedIn()) {
      // If not logged in (token expired or not present), logout and navigate to login
      this.authService.logout(); // logout now handles navigation to /login
    } else {
      // If logged in, navigate to dashboard
      this.router.navigate(['/dashboard']);
    }
  }
}
