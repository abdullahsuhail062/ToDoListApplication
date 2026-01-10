import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AuthService } from '../auth.service';
import { ApiService } from '../api-service.service';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { SharedService } from '../shared.service';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [MatCardModule],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss'
})
export class UserProfileComponent implements OnInit {
  
  username: any
  email: any
  profilePhoto: any
  

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private sharedService: SharedService){}

  ngOnInit(): void {
    this.username = this.data.username
    this.email = this.data.email
    

  }
  logout(){
    this.data.onLogout()
  }
  dashboard(){
    this.data.onNavigateToDashboard()
  }
  openDeleteAccountDialog(){
    this.sharedService.triggerTask()

  }
  addAnOtherAccount(){
    this.data.onAddingAnotherAccount()
    
  }


}