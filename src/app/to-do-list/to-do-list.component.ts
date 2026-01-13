import { NgClass, NgFor, NgIf } from '@angular/common';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../api-service.service';
import { AuthService } from '../authFiles/auth.service';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { ShareDialogComponent } from './share-dialog.component';
import { AuthStore } from '../authFiles/auth-store';

@Component({
  selector: 'app-to-do-list',
  standalone: true,
  imports: [
    NgIf,
    FormsModule,
    NgClass,
    NgFor,
    ShareDialogComponent // Import the standalone ShareDialogComponent
  ],
  templateUrl: './to-do-list.component.html',
  styleUrl: './to-do-list.component.scss',
})
export class ToDoListComponent implements OnInit{
titleErrorChecking: boolean=false
titleToBeCreated: boolean = false
titleError: string = ''
isDisabled: boolean = true 
isEditing: boolean = false
updatedDateFormate:any
checkingTitleAvailability:boolean = false
title:any
isChecked:boolean= false
description:any
date:string = ''
taskTitleInput: string = ''
taskDescriptionInput: string = ''
isDeactive: boolean = true
isActive: boolean = false
items: { date:string,time: string, title: string; description: string, isEditing: boolean, completed: boolean }[] =[]
listItem:any
taskId: any
data:any
time:string = ''
variable: any
error:any
isLoading: boolean =true
isTaskExist: boolean= false

showShareDialog: boolean = false;
currentShareTitle: string = '';
showCreateListDialog: boolean = false; // New property for Create List dialog

  constructor(private authStore: AuthStore,private titleService: Title,private router: Router,private authService: AuthService, private apiService: ApiService ){
    titleService.setTitle('User Registeration App | ToDoList')
  }
 
 
  ngOnInit(): void {
  const token =this.authStore.token()
    this.apiService.getTasks(token).subscribe({next:(tasks)=>{
    
    
      if (tasks) { 
      this.items = tasks
       
      this.isLoadingStatus()
        this.isTaskExistStatus()
      } if (!tasks){
        this.items = [];
        this.isLoadingStatus()
        this.isTaskExistStatus()
      }
    },
    error:(
      error)=>{this.handleTaskFetchingError(error)}})
  
 }
 handleTaskFetchingError(error: any){
  console.error(error.error.error);
  
  
 }

  openDialog(): void{ // Modified signature
    this.showCreateListDialog = true;
  }
  
  onFocus(){
    this.checkingTitleAvailability =false
    this.apiService.onFocusTitleChecking(this.taskTitleInput).subscribe({next: (data)=> {

    },error:(error) => {
      this.titleErrorChecking = true
      this.titleToBeCreated = false
    }})}



  onBlur(){
    if (this.taskTitleInput.trim().length>0) {
      this.checkingTitleAvailability =true
    }
    this.apiService.taskTitleCheck(this.taskTitleInput).subscribe({next: (data)=>{ if (this.taskTitleInput.length>0) {
      this.titleToBeCreatedFn();
      this.checkingTitleAvailability = false
      this.data = data.title

    } 
    },error: (error) => {
      this.checkingTitleAvailability = false
      this.titleErrorCheckingFn(error.error);
      this.titleToBeCreated =false
      this.error = error.error
    }
  })}
  createTaskTittle(){
 if (this.taskTitleInput.trim().length>0 &&this.taskDescriptionInput.trim().length>0) {    
      this.isDisabled = false
      this.isActive = true
}else {this.isDeactive =true
        this.isActive = false
        
  }}

  createTaskDescription(){
    if (this.taskDescriptionInput.trim().length>0 && this.taskTitleInput.trim().length>0 ) {
      this.isDisabled = false
      this.isActive = true

  }else {this.isDeactive =true
        this.isActive = false
  }
  }

  onCreateList(){
    this.date = this.getDate()
    this.time = this.getTime()
    
    
    this.checkingTitleAvailability = false
    const token = this.authStore.token()
    const capitaliseFirstTitleLetter = this.taskTitleInput.charAt(0).toUpperCase() + this.taskTitleInput.slice(1).toLowerCase()
    const capitaliseFirstDescriptionLetter = this.taskDescriptionInput.charAt(0).toUpperCase() + this.taskDescriptionInput.slice(1).toLowerCase()
    
    this.apiService.addTask( capitaliseFirstTitleLetter,capitaliseFirstDescriptionLetter,token,this.date,this.time).subscribe({next: (item)=>{
    
      this.items.push({ title: item.title,description: item.description, isEditing: false, completed: item.completed,date: item.date,time: item.time});this.isTaskExistStatus();       
      localStorage.setItem('taskId',item.id);
      
      
    },error: (error)=>{console.error(error)
    }})
    this.showCreateListDialog = false; // Close dialog
    this.taskTitleInput = ''
    this.taskDescriptionInput = ''
    this.titleToBeCreated = false
    this.titleError = ''
    this.titleErrorChecking = false
    this.isDisabled = true
    this.isActive = false

     }


     editItem(index: number) {
      this.items[index].isEditing = true
     }

     deleteItem(dialogRef:TemplateRef<any>){
     

    }
     

     saveItem(index: number,title: any, description:any){
      this.items[index].isEditing = false;
      const taskId =this.authStore.user()?.id
      this.apiService.saveTask(title,description,taskId
      ).subscribe({next:(update)=>{
      },error:(error)=>{this.handleError(error)}})

     }

     cancelEdit(index: number){
      this.items[index].isEditing = false;


     }
     onTaskChange(event:Event,title: string,item:any){
      const checked = (event.target as HTMLInputElement).checked;
      item.completed = checked;
      const taskTitle = title      
      this.apiService.taskCompeletion(item.completed,taskTitle).subscribe({next:(data)=>{
      
      },error:(error)=>{this.handleError(error)}})
     }

          
     isLoadingStatus(){
      this.isLoading = !this.isLoading
     }
     isTaskExistStatus() {
      this.isTaskExist = this.items.length === 0;
    }
    

     navigateToHome(){
      this.router.navigate(['/dashboard'])
      
     }
     deleteAccount(index: number, title: string, dialogRef: TemplateRef<any>): void {
      const taskTitle = title
      
      
      // Close the dialog immediately
      
      // Proceed with the delete task request
      this.apiService.deleteTask(taskTitle).subscribe({
        next: (task) => {
          this.items.splice(index, 1);
          this.isTaskExistStatus();
          
        },
        error: (error) => {this.handleError(error)},
      });
    }
    handleError(error:any){
      console.error(error.error.error);
      
    }

        cancelDeletion(dialogRef: TemplateRef<any>){

          

        }
    titleErrorCheckingFn(error:any){
      if (error.error) {
        this.titleErrorChecking = true
        this.titleError = error.error
        
      }
      

    }
     
    titleToBeCreatedFn(){
      this.titleErrorChecking = !this.titleErrorChecking
      this.titleToBeCreated = !this.titleToBeCreated
    }
    performActionOnOutsideClick() {
      this.checkingTitleAvailability = false
      this.taskTitleInput = ''
      this.taskDescriptionInput = ''
      this.titleToBeCreated = false
      this.titleError = ''
      this.titleErrorChecking = false
      this.isDisabled = true
      this.isActive = false
      this.showCreateListDialog = false; // Close dialog
    }
    getDate(): string{
      const currentDate = new Date();        
      let formattedDate = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${currentDate.getDate().toString().padStart(2, '0')}`;
      return formattedDate
     
    }
    getTime(): string {
       let date = new Date()
     return `${date.getHours()}:${date.getMinutes()}`
    }
    
  openShareDialog(title: string): void {
    this.currentShareTitle = title;
    this.showShareDialog = true;
  }

  handleEmailShared(email: string): void {
    this.apiService.shareTaskList(this.currentShareTitle, email).subscribe({
      next: (response) => {
        console.log('List shared successfully', response);
      },
      error: (error) => {
        console.error('Error sharing list', error);
      }
    });
    this.showShareDialog = false;
  }

  handleShareCancelled(): void {
    this.showShareDialog = false;
  }

  clearCompletedTasks(): void {
    const completedTaskTitles = this.items.filter(item => item.completed).map(item => item.title);
    if (completedTaskTitles.length === 0) {
      return;
    }

    this.apiService.deleteCompletedTasks(completedTaskTitles).subscribe({
      next: () => {
        this.items = this.items.filter(item => !item.completed);
        this.isTaskExistStatus();
      },
      error: (error) => this.handleError(error)
    });
  }
}
