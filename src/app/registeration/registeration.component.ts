import{Component} from '@angular/core'
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { CommonModule, NgIf } from '@angular/common';
import { HttpClient,} from '@angular/common/http';
import { MatIconModule } from '@angular/material/icon'; // Import MatIconModule
import { ApiService } from '../api-service.service';
import { AuthService } from '../auth.service';
import { Title } from '@angular/platform-browser';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-registeration',
  standalone: true,
  imports: [RouterLink,MatInputModule,
    MatInputModule,ReactiveFormsModule,CommonModule,NgIf,MatIconModule, MatProgressSpinnerModule],
  templateUrl: './registeration.component.html',
  styleUrl: './registeration.component.scss'
})
@Injectable({providedIn: 'root'})

export class RegisterationComponent  {

  hide: boolean = true
  signUpForm: FormGroup
  usernameError: any
  isSigningUp: boolean= false
  emailError: any
  passwordError: any
  mismatchPasswordsError: any
  generalError: any
  isLoading: boolean = false





  constructor(private titleService: Title,private authService: AuthService,private router: Router,private apiService: ApiService){
    titleService.setTitle('User Registeration App |Signin')

    this.signUpForm = new FormGroup({username: new FormControl('',[Validators.required,Validators.minLength(3),Validators.pattern('^[a-zA-Z0-9]*')])
      ,email: new FormControl('',[Validators.required, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)]),password: new FormControl('',[Validators.required,Validators.minLength(8),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,}$/
)]),confirmPassword: new FormControl('',[Validators.required,Validators.minLength(8),Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,}$/)])}) 
    }
      
  
    

  
  onSubmit(): void{
   const formData ={username: this.signUpForm.get('username')?.value,
      email: this.signUpForm.get('email')?.value,
      password: this.signUpForm.get('password')?.value
    }
   
    this.passwordsMisMatchValidator()
    if (this.signUpForm.valid) {
      this.toggleSpinner()
      this.signiUpStatus()
    this.apiService.registerUser(formData).subscribe({next: (data) => {localStorage.setItem('isWelcomed', 'false');
      if (data.token){console.log(data.token);
      
        this.authService.saveToken(data.token)
        this.router.navigate(['/dashboard'])};
    }, error: (error) => { 
      this.signiUpStatus()
      this.toggleSpinner()
      

      if (error.status===400 && error.error) {
        this.handleError(error.error)}
       


        if (error.status===401 && error.error) {
          this.handleDatabaseValidationError(error.error)
         
          
        }
        if (error.status===500) {
          this.generalErrorFn(error.error)
         
          
        }
      
      
    }
    })}}
      
    
    
    
    handleError(errorMessage:any){

      Object.keys(errorMessage).forEach((error:any) => {
        
        if (error ==="username") {
          this.usernameError = errorMessage.username
          this.signUpForm.get('username')?.setErrors({usernameErr: this.usernameError})
          
        }

         
    if (error === 'email') {
      this.emailError = errorMessage.email
      this.signUpForm.get('email')?.setErrors({emailErr: this.emailError})
    }

    if (error === 'password') {
      this.passwordError = errorMessage.password
      this.signUpForm.get('password')?.setErrors({passwordErr: this.passwordError})
    }

        
      });}

      handleDatabaseValidationError(dbErrorMessage:any){
        Object.keys(dbErrorMessage).forEach((dbError) => {
          if (dbError === 'usernameExist') {
            this.usernameError = dbErrorMessage.usernameExist
            this.signUpForm.get('username')?.setErrors({usernameErr: this.usernameError})
            }
            if (dbError === 'userEmailExist') {
              this.emailError = dbErrorMessage.userEmailExist
              this.signUpForm.get('email')?.setErrors({emailErr: this.emailError})
              
              }

        })

      }
      generalErrorFn(error:any){
        this.generalError = error.message
       

      }
  
      passwordsMisMatchValidator():any{
        const password = this.signUpForm.get('password')?.value
        const confirmPassword =this.signUpForm.get('confirmPassword')?.value
        this.mismatchPasswordsError = 'password do not match'
        return confirmPassword !== password? this.signUpForm.get('confirmPassword')?.setErrors({mismatchPasswordsError: this.mismatchPasswordsError}): false
      }
  
       togglePasswordVisibility(): boolean{
      return this.hide= !this.hide
      }

      toggleSpinner() {
        this.isLoading = !this.isLoading
      }

      signiUpStatus(){
      this.isSigningUp = !this.isSigningUp 

      }

    
    }
  

    





























    
      
 



