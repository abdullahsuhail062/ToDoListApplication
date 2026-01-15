import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  OnDestroy,
  ChangeDetectorRef,
  Inject, 
  inject,
  PLATFORM_ID
} from '@angular/core';
import { isPlatformBrowser, CommonModule, NgIf } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Title } from '@angular/platform-browser';




import { MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';

import { Clipboard } from '@angular/cdk/clipboard';
import { Observable, Subscription } from 'rxjs';

import { AuthService } from '../authFiles/auth.service';
import { ApiService } from '../api-service.service';
import { SharedService } from '../shared.service';
import { UserProfileComponent } from '../user-profile/user-profile.component';
import { DeleteAccountDialogComponent } from '../delete-account-dialog/delete-account-dialog.component';
import { AuthStore } from '../authFiles/auth-store';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    NgIf,
    FormsModule,
    MatToolbarModule,
    MatDialogModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatInputModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {

  /* ---------------------------------- */
  /* Platform / SSR                     */
  /* ---------------------------------- */
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  /* ---------------------------------- */
  /* Auth Store                         */
  /* ---------------------------------- */
  readonly store = inject(AuthStore)
  readonly isLoggedIn = this.store.isLoggedIn();
  readonly token = this.store.token;
  readonly user = this.store.user()

  /* ---------------------------------- */
  /* UI State                           */
  /* ---------------------------------- */
  profileInitial = '';
  showWelcomeMessage = false;
  showShareMenu = false;
  isFavorite = false;
  hasDataFetched = false;

  /* ---------------------------------- */
  /* Network / Browser                  */
  /* ---------------------------------- */
  isOnline = this.isBrowser ? navigator.onLine : true;
  currentUrl = this.isBrowser ? window.location.href : '';
  url = encodeURIComponent('https://user-registeration-web-app-j6zm.vercel.app/dashboard');

  /* ---------------------------------- */
  /* Misc                               */
  /* ---------------------------------- */
  userPrompt = '';
  email: string | null = null;
  dialogRef!: MatDialogRef<UserProfileComponent>
 
  constructor(private authStore: AuthStore,
    private readonly router: Router,
    private readonly authService: AuthService,
    private readonly apiService: ApiService,
    private readonly sharedService: SharedService,
    private readonly dialog: MatDialog,
    private readonly clipboard: Clipboard,
    private readonly elementRef: ElementRef,
    private readonly cdr: ChangeDetectorRef,
    title: Title,

  ) {
    title.setTitle('User Registration App | Dashboard');
  }

  /* ---------------------------------- */
  /* Lifecycle                          */
  /* ---------------------------------- */

  ngOnInit(): void {
    if (this.isBrowser) {
      window.addEventListener('online', () => (this.isOnline = true));
      window.addEventListener('offline', () => (this.isOnline = false));
    }

    this.fetchFavoriteIconState();
    this.fetchTaskFn();
    this.greetUser();
  }

  
  /* ---------------------------------- */
  /* Auth Actions (STORE ONLY)           */
  /* ---------------------------------- */

  logout(): void {
    this.dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
            this.authService.logout();
            this.router.navigate(['/login'])

        
      }
    })
  }

  /* ---------------------------------- */
  /* Navigation                         */
  /* ---------------------------------- */

  navigateToDoList() {
    this.router.navigate(['/toDoList']);
  }

  backToHome() {
    this.router.navigate(['/dashboard']);
  }

  /* ---------------------------------- */
  /* Share                              */
  /* ---------------------------------- */

  toggleShareMenu(event: Event) {
    event.stopPropagation();
    this.showShareMenu = !this.showShareMenu;
  }

  copyLink() {
    this.clipboard.copy(this.currentUrl);
    alert('Link copied!');
    this.showShareMenu = false;
  }

  shareVia(platform: string) {
    const shareUrl =
      platform === 'facebook'
        ? `https://www.facebook.com/sharer/sharer.php?u=${this.currentUrl}`
        : `https://wa.me/?text=${this.url}`;

    if (this.isBrowser) window.open(shareUrl, '_blank');
    this.showShareMenu = false;
  }

  @HostListener('document:click', ['$event'])
  closeShareMenu(event: Event) {
    const menu = this.elementRef.nativeElement.querySelector('.share-menu');
    if (this.showShareMenu && menu && !menu.contains(event.target)) {
      this.showShareMenu = false;
      this.cdr.detectChanges();
    }
  }

  /* ---------------------------------- */
  /* Profile / Dialog                   */
  /* ---------------------------------- */

  openProfileDialog() {
      this.dialogRef =  this.dialog.open(UserProfileComponent, {
          position: { top: '55px', right: '0px' },
          width: '180px',
          data: {
            username: this.authStore.user()?.username,
            email: this.authStore.user()?.email,
            onLogout: () => this.logout()
          
          
      }
    });
    this.email = this.authStore.user()?.email ?? null
  }

  openDeleteAccountDialog() {
    this.dialog.open(DeleteAccountDialogComponent, {
      width: '400px',
      data: {
        onConfirmDelete: () => this.confirmDelete()
      }
    });
  }

  confirmDelete() {
    this.apiService.deleteAccount().subscribe({
      next: () => {
        this.authStore.clear()
        this.router.navigate(['/login']);
      }
    });
  }

  toggleFavoriteState() {
        if (this.authStore.user()?.isFavorite) {
          this.isFavorite = this.authStore.user()?.isFavorite ?? false
        }
     
  }

  iconState(): boolean {
    return (this.isFavorite = !this.isFavorite);
  }
  
  /* ---------------------------------- */
  /* Misc                               */
  /* ---------------------------------- */

  greetUser() {
   this.authService.greetUser()
   this.showWelcomeMessage = true
  }

  fetchFavoriteIconState() {
  this.isFavorite = this.authStore.user()?.isFavorite ?? false
    
  }

  fetchTaskFn() {
    
  this.profileInitial = this.authStore.user()?.email?.charAt(0).toUpperCase() ?? ''
    

    this.sharedService.taskTriggered$.subscribe(() =>
      this.openDeleteAccountDialog()
    );
  }
}
