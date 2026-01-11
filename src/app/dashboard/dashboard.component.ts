import { Component, ElementRef, HostListener, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { UserProfileComponent } from '../user-profile/user-profile.component';
import { MatDialog, MatDialogConfig, MatDialogModule } from '@angular/material/dialog';
import { ApiService } from '../api-service.service';
import { MatToolbarModule } from '@angular/material/toolbar';
import { CommonModule, NgIf } from '@angular/common';
import { DeleteAccountDialogComponent } from '../delete-account-dialog/delete-account-dialog.component';
import { SharedService } from '../shared.service';
import { FormsModule } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { MatIconModule } from '@angular/material/icon'; // Changed MatIcon to MatIconModule
import { Clipboard } from '@angular/cdk/clipboard';
import { Observable, Subscription } from 'rxjs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [MatToolbarModule, NgIf, FormsModule, CommonModule, MatProgressSpinnerModule, MatIconModule, MatButtonModule, MatInputModule, MatDialogModule], // Cleaned up imports
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit, OnDestroy {
  profileInitial: string = ''
  userPrompt: string = ''
  email: string | null = null
  isUpdateLoading:boolean = false
  hasDataFetched:boolean = false
  weatherCondition: string = ''
  weatherIcon:string = ''
  name: string = ''
  inputValue: string = ''
  showShareMenu: boolean = false
  modifiedDateFormate: string = ''
  update: string = ''
  city: string = ''
  temp: string = ''
  cloud: string = ''
  region: string = ''
  refreshInterval: any
  error: string = ''
  isCityNameCorrect: boolean = false
  country: string = ''
  closeOutsideClick: any
  isFavorite: boolean = false
  location:any
  showWelcomeMessage: boolean = false;
  isOnline = navigator.onLine
  currentUrl = window.location.href; // Gets the current page URL
  private weatherSubscription!: Subscription
  url = encodeURIComponent('https://user-registeration-web-app-j6zm.vercel.app/dashboard');
  constructor(private cdr: ChangeDetectorRef, private elementRef: ElementRef, private clipboard: Clipboard, private titleService: Title, private sharedService: SharedService, private router: Router, private authservice: AuthService, private dialog: MatDialog, private apiService: ApiService) {
    titleService.setTitle('User Registeration App | Dashbord')
  }
  ngOnInit(): void {
    window.addEventListener('online', () => {this.isOnline = true; location.reload();});
    window.addEventListener('offline', () =>{ this.isOnline = false; this.isUpdateLoading = false});
    this.isUpdateLoading = true
    this.fetchFavoriteIconState()
    this.fetchTaskFn()
    this.greetUser()
  this.getLocationObservable().subscribe({
    next: (location) => {
      this.location = location; // Assign location here
      this.fetchWeaterUpdate(location);
      this.isUpdateLoading = false;

      this.refreshInterval = setInterval(() => {
        this.fetchWeaterUpdate(this.location); // Now this.location is guaranteed to be set
      }, 900000);
    },
    error: (error) => {
      console.error('Geolocation error:', error);
      this.isUpdateLoading = false;
      // Optionally handle error for refreshInterval here too, or prevent it from starting
    }
  });

     

     
   
  }

  search(){
    this.fetchWeatherBySearch()    
    this.inputValue = ''
    

  }

  toggleShareMenu(event: Event) {
    event.stopPropagation()
    this.showShareMenu = !this.showShareMenu

  }
  shareVia(platform: string) {
    let shareUrl = '';
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${this.currentUrl}`;
        break;
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${this.url}`;
        break;
    }
    window.open(shareUrl, '_blank');
    this.showShareMenu = false; // Close menu after clicking
  }

  copyLink() {
    this.clipboard.copy(this.currentUrl)
    alert('Link copied to clipboard!');
    this.showShareMenu = false;

  }
  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {


    const shareMenuElement = this.elementRef.nativeElement.querySelector('.share-menu');

    const isInside = shareMenuElement ? shareMenuElement.contains(event.target) : false;

    if (this.showShareMenu && !isInside) {
      this.showShareMenu = false;

      // Force UI update
      this.cdr.detectChanges();
    }

  }





  fetchFavoriteIconState() {
    this.apiService.fetchFavoriteIconState().subscribe({
      next: (data) => {
        if (data) {
          this.isFavorite = data.isFavorite

        }
      }, error: (error) => {
        console.error(error.error.error);
      }
    })
  }

  toggleFavoriteState() {
    this.apiService.toggleFavoriteIconState(this.iconState()).subscribe({
      next: (data) => {
        if (data.isFavorite) {
          this.isFavorite = data.isFavorite

        }
      }, error: (error) => {
        console.error(error.error);
      }
    })

  }
  iconState(): boolean {
    return this.isFavorite = !this.isFavorite
  }


  logout() {
    this.authservice.logout()
    this.router.navigate(['/login'])
    this.dialog.closeAll()
  }

  dashboard() {
    this.router.navigate(['/dashboard'])
    this.dialog.closeAll()


  }
  confirmDelete() {
    this.apiService.deleteAccount().subscribe({
      next:
        (response) => {
          this.authservice.deleteToken()
          this.router.navigate(['/login'])
          this.dialog.closeAll()
          // Perform any necessary clean-up or redirect
        },
      error: (error) => {
        this.handleError(error)
      }
    }
    );
  }



  closeAllDialog() {
    this.dialog.closeAll()
  }


  openDeleteAccountDialog() {
    const dialogRef = this.dialog.open(DeleteAccountDialogComponent, { position: { right: '0px' }, width: '400px', data: { onConfirmDelete: () => this.confirmDelete(), onCloseAll: () => this.closeAllDialog() } })
    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'confirm') {
        this.confirmDelete()




      }
    })


  }
  onAddAnotherAccount() {
    this.dialog.closeAll()
    this.authservice.logout()
    this.router.navigate(['/login'])
  }


  openProfileDialog(): void {
    const dialogConfig = new MatDialogConfig
    dialogConfig.height = '400px'
    this.apiService.fetchUserProfile().subscribe({
      next: (userdata) => {
        this.dialog.open(UserProfileComponent, { position: { top: '55px', right: '0px' }, width: '180px', panelClass: 'custom-dialog', data: { username: userdata.username, email: userdata.email, onLogout: () => this.logout(), onNavigateToDashboard: () => this.dashboard(), onOpenDeleteAccountDialog: () => this.openDeleteAccountDialog(), onAddingAnotherAccount: () => this.onAddAnotherAccount() } })
        this.email = userdata.email
      }, error: (error) => {
        this.handleError(error)
      }
    })

  }
  greetUser() {
    const isWelcomed = localStorage.getItem('isWelcomed');

    if (isWelcomed === null || isWelcomed === 'false') {
      this.showWelcomeMessage = true; // Show the welcome message
      // Update the flag to avoid showing it again
      localStorage.setItem('isWelcomed', 'true');
    }
  }
  navigateToDoList() {
    this.router.navigate(['/ToDoList'])
  }

  handleError(error: any) {
    console.log(error.error);

  }

  navigateToCalculator() {
    this.router.navigate(['/calculator'])
  }

  backToHome() {
    this.router.navigate(['/dashboard'])
  }
  sendRequest() {
    this.apiService.getCompletion(this.userPrompt).subscribe({
      next: (response) => { response }
    })


  }
  fetchTaskFn() {
    this.apiService.fetchUserProfile().subscribe({
      next: (data) => {
        this.profileInitial = data.email ? data.email.charAt(0).toUpperCase() : '';
      }, error: (error) => { this.handleError(error) }
    })
    this.sharedService.taskTriggered$.subscribe(() => { this.openDeleteAccountDialog() })
  }
 
 
  fetchWeaterUpdate(location:{latitude: number, longitude: number}){
  
    
    this.weatherSubscription =  this.apiService.fetchWeatherForecast(location).subscribe({
      next: (data) => {this.isDataFetched(); this.city=`${data.location.name}`,this.region=`${data.location.region}`,this.country =`${data.location.country}`;
       this.modifiedDateFormate =`${data.current.last_updated}`; this.temp = `${data.current.temp_c}`, this.cloud = `${data.current.cloud}`
       let updatedFormate= this.modifiedDateFormate.split('')
       updatedFormate[9] = this.modifiedDateFormate[9] + ':'
       this.update = updatedFormate.join('');
       this.weatherCondition = `${data.current.condition.text}`, this.weatherIcon = `${data.current.condition.icon}`

       
        
      }, error: (error) => {console.error(error.error.error);
       this.isUpdateLoading = false; // Reset loading on error
      }
    })
  }

     getLocationObservable():Observable<any> {
       return new Observable((subscriber) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            // Emit the location (latitude and longitude)
            subscriber.next({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude
            });
            subscriber.complete();
          },
          (error) => {
            // Handle error, e.g., permission denied
            subscriber.error(error);
            this.isUpdateLoading = false // Reset loading on error
          }
        );
      } else {
        subscriber.error('Geolocation is not supported by this browser.');
      }
    });
    
    

  }

  fetchWeatherBySearch(){
    if (this.inputValue.trim().length>0) {
      
    
    this.apiService.fetchWeatherForecastBySearch(this.inputValue).subscribe({
      next: (data) => { this.isCityNameCorrect = false; this.city=`${data.location.name}`,this.region=`${data.location.region}`,this.country =`${data.location.country}`;
       this.modifiedDateFormate =`${data.current.last_updated}`; this.temp = `${data.current.temp_c}`, this.cloud = `${data.current.cloud}`
       let updatedFormate= this.modifiedDateFormate.split('')
       updatedFormate[9] = this.modifiedDateFormate[9] + ':'
       this.update = updatedFormate.join('');
       this.weatherCondition = `${data.current.condition.text}`, this.weatherIcon = `${data.current.condition.icon}`
  }, error: (error) => {console.log(error,'this is error!');
    this.error = 'City not found, check spelling'
    this.isCityNameCorrect = true
    
  
    }})
  }
}
ngOnDestroy() {
  // Clean up the interval when the component is destroyed
  if (this.refreshInterval) {
    clearInterval(this.refreshInterval);
  }
  if (this.weatherSubscription) {
    this.weatherSubscription.unsubscribe();
  }
}

isDataFetched(){
  this.hasDataFetched = true
}

  
}












