import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  private taskTrigger = new Subject<void>();

  // Observable to subscribe to
  taskTriggered$ = this.taskTrigger.asObservable();

  // Method to trigger the task
  triggerTask() {
    console.log('service triggering emission');
    
    this.taskTrigger.next();
  }
}