import { ChangeDetectorRef, Component } from '@angular/core';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatProgressSpinnerModule, } from '@angular/material/progress-spinner';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { CommonModule, NgIf } from '@angular/common';
import { HttpClient,} from '@angular/common/http';
import { MatIconModule } from '@angular/material/icon'; // Import MatIconModule
import { ApiService } from '../api-service.service';
import { Title } from '@angular/platform-browser';
import { AuthService } from '../authFiles/auth.service';



@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, MatInputModule, MatProgressSpinnerModule,
    ReactiveFormsModule, CommonModule, NgIf, MatIconModule,],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
@Injectable({providedIn: 'root'})

export class LoginComponent {
  hide: boolean = true
  loginForm: FormGroup
  usernameError: any
  emailError: any
  passwordError: any
  mismatchPasswordsError: any
  generalError: string = ''
  isLoading: boolean = false
  isLoggingIn: boolean = false

  constructor(private authService: AuthService,private titleService: Title,private cdr: ChangeDetectorRef,private router: Router,private apiService: ApiService, private http: HttpClient){
    titleService.setTitle('User Registeration App |Login')
    this.loginForm = new FormGroup({email: new FormControl('',[Validators.required, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)]),password: new FormControl('',[Validators.required,Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,}$/
)])}) 
    }


  
  onSubmit(): void{
   const formData ={
      email: this.loginForm.get('email')?.value,
      password: this.loginForm.get('password')?.value
    }
   
    if (this.loginForm.valid) {
      this.toggleSpinner()
      
         this.isLoggingIn =true
      this.apiService.loginUser(formData).subscribe({next: (data) => {
        this.authService.saveToken(data.token, data.user)
        console.log(data.token, data.user);
        
      this.router.navigate(['/dashboard']);
      this.isLoggingIn = false
      
    }, error: (error) => {
      
    
      if (error.status===400 && error.error) {
        this.handleError(error.error)}
        this.toggleSpinner()
        this.isLoadingFn()
        this.isLoggingInFn()


      
        if (error.status===500) {
          this.generalErrorFn(error.error)
          this.toggleSpinner()
          this.isLoadingFn()
          this.isLoggingInFn()
          
        
        }
      
      
    }
    })}}
   
      
    handleError(errorMessage:any){

      Object.keys(errorMessage).forEach((error:any) => {
       

         
    if (error === 'email') {
      this.emailError = errorMessage.email
      this.loginForm.get('email')?.setErrors({emailErr: this.emailError})
    }

    if (error === 'password') {
      this.passwordError = errorMessage.password
      this.loginForm.get('password')?.setErrors({passwordErr: this.passwordError})
    }
    if (error ==='noUserExist') {
      this.emailError = errorMessage.noUserExist
      this.loginForm.get('email')?.setErrors({emailErr: this.emailError})
      
    }

      
      });
    

      }
      generalErrorFn(error:any){
        this.generalError = error.message
      
      }
  
      passwordsMisMatchValidator():any{
        const password = this.loginForm.get('password')?.value
        const confirmPassword =this.loginForm.get('confirmPassword')?.value
        this.mismatchPasswordsError = 'password do not match'
        return confirmPassword !== password? this.loginForm.get('confirmPassword')?.setErrors({mismatchPasswordsError: this.mismatchPasswordsError}): false
      }
  
       togglePasswordVisibility(): boolean{
      return this.hide= !this.hide
      }
      toggleSpinner(){
       this.isLoading = !this.isLoading
         
    

    }

    isLoadingFn(){
      this.isLoading = !this.isLoading
    }
    isLoggingInFn(){
      this.isLoggingIn = !this.isLoggingIn
    }
    
  }
  
