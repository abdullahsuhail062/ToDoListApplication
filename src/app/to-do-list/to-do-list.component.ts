import { NgClass, NgFor, NgIf } from '@angular/common';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialog, MatDialogContent, MatDialogModule } from '@angular/material/dialog';
 import{MatToolbarModule} from '@angular/material/toolbar'
import { ApiService } from '../api-service.service';
import { MatList, MatListItem} from '@angular/material/list';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { ShareDialogComponent } from './share-dialog.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'app-to-do-list',
  standalone: true,
  imports: [
    NgIf,
    MatToolbarModule,
    MatDialogContent,
    FormsModule,
    NgClass,
    NgFor,
    MatListItem,
    MatList,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatInputModule,
    MatCheckboxModule
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
dialogRef: any
listItem:any
taskId: any
data:any
time:string = ''
variable: any
error:any
isLoading: boolean =true
isTaskExist: boolean= false
  constructor(private titleService: Title,private router: Router,private authService: AuthService,private dialog: MatDialog, private apiService: ApiService ){
    titleService.setTitle('User Registeration App | ToDoList')
  }
 
 
  ngOnInit(): void {
  const token =this.authService.getToken()
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

  openDialog(templateRef: TemplateRef<any>): void{
    this.dialogRef = this.dialog.open(templateRef,{position:{top:'4%', left: '11%'},height: '250px',disableClose: false})

     
  
     this.detectOutsideClick()
  }
  detectOutsideClick() {
    if (!this.dialogRef) return;

    this.dialogRef.backdropClick().subscribe(() => {
      this.performActionOnOutsideClick();
      this.checkingTitleAvailability = false
    });
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
    const token = this.authService.getToken()
    const capitaliseFirstTitleLetter = this.taskTitleInput.charAt(0).toUpperCase() + this.taskTitleInput.slice(1).toLowerCase()
    const capitaliseFirstDescriptionLetter = this.taskDescriptionInput.charAt(0).toUpperCase() + this.taskDescriptionInput.slice(1).toLowerCase()
    
    this.apiService.addTask( capitaliseFirstTitleLetter,capitaliseFirstDescriptionLetter,token,this.date,this.time).subscribe({next: (item)=>{
    
      this.items.push({ title: item.title,description: item.description, isEditing: false, completed: item.completed,date: item.date,time: item.time});this.isTaskExistStatus();       
      localStorage.setItem('taskId',item.id);
      
      
    },error: (error)=>{console.error(error)
    }})
    this.dialogRef.close()
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
     const dialogReferrence = this.dialog.open(dialogRef,{position:{top:'10%', left: '50%'},height: '250px'})
      

    }
     

     saveItem(index: number,title: any, description:any){
      this.items[index].isEditing = false;
      const taskId =this.authService.getTaskId()
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
      this.dialog.closeAll();
      
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
      this.dialog.closeAll()
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
      this.dialogRef.close()
      
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
    const dialogRef = this.dialog.open(ShareDialogComponent, {
      width: '350px',
      data: { title: title }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.shareList(title, result);
      }
    });
  }

  shareList(title: string, email: string) {
    this.apiService.shareTaskList(title, email).subscribe({
      next: (response) => {
        console.log('List shared successfully');
      },
      error: (error) => {
        console.error('Error sharing list', error);
      }
    });
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
