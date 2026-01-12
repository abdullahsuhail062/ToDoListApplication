import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { ToDoListComponent } from './to-do-list.component';
import { ApiService } from '../api-service.service';
import { AuthService } from '../authFiles/auth.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

// Mock ApiService
class MockApiService {
  getTasks() {
    return of([]);
  }
  addTask() {
    return of({ title: 'New Task', description: 'Description', completed: false, date: '2023-01-01', time: '12:00' });
  }
  shareTaskList() {
    return of({});
  }
  taskTitleCheck() {
    return of({ title: 'someTitle' });
  }
  onFocusTitleChecking() {
    return of({});
  }
  deleteCompletedTasks() {
    return of({});
  }
}

// Mock AuthService
class MockAuthService {
  getToken() {
    return 'fake-token';
  }
  getTaskId() {
    return 'fake-taskId';
  }
}

// Mock Router
class MockRouter {
  navigate = jasmine.createSpy('navigate');
}

describe('ToDoListComponent', () => {
  let component: ToDoListComponent;
  let fixture: ComponentFixture<ToDoListComponent>;
  let apiService: ApiService;
  let authService: AuthService;
  let router: Router;
  let httpTestingController: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ToDoListComponent,
        HttpClientTestingModule,
        FormsModule
      ],
      providers: [
        Title,
        { provide: ApiService, useClass: MockApiService },
        { provide: AuthService, useClass: MockAuthService },
        { provide: Router, useClass: MockRouter }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ToDoListComponent);
    component = fixture.componentInstance;
    apiService = TestBed.inject(ApiService);
    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
    httpTestingController = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  afterEach(() => {
    httpTestingController.verify(); // Ensure that there are no outstanding requests
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should open the share dialog and set the current share title', () => {
    const testTitle = 'Test Task Title';
    component.openShareDialog(testTitle);
    expect(component.showShareDialog).toBeTrue();
    expect(component.currentShareTitle).toBe(testTitle);
  });

  it('should call apiService.shareTaskList and close the share dialog on handleEmailShared', () => {
    const shareTitle = 'Task to Share';
    const email = 'test@example.com';
    component.currentShareTitle = shareTitle;
    component.showShareDialog = true;

    spyOn(apiService, 'shareTaskList').and.returnValue(of({}));

    component.handleEmailShared(email);

    expect(apiService.shareTaskList).toHaveBeenCalledWith(shareTitle, email);
    expect(component.showShareDialog).toBeFalse();
  });

  it('should close the share dialog on handleShareCancelled', () => {
    component.showShareDialog = true;
    expect(component.showShareDialog).toBeFalse();
  });

  it('should open the create list dialog on openDialog', () => {
    component.showCreateListDialog = false; // Ensure it's closed initially
    component.openDialog();
    expect(component.showCreateListDialog).toBeTrue();
  });

  it('should create a new list item on onCreateList', () => {
    spyOn(component, 'getDate').and.returnValue('2023-01-01');
    spyOn(component, 'getTime').and.returnValue('10:30');
    spyOn(authService, 'getToken').and.returnValue('test-token');
    spyOn(apiService, 'addTask').and.returnValue(of({
      title: 'New Task',
      description: 'New Description',
      completed: false,
      date: '2023-01-01',
      time: '10:30',
      id: 'task-123'
    }));
    spyOn(localStorage, 'setItem');


    component.taskTitleInput = 'new task';
    component.taskDescriptionInput = 'new description';
    component.items = []; // Start with empty items

    component.onCreateList();

    expect(component.getDate).toHaveBeenCalled();
    expect(component.getTime).toHaveBeenCalled();
    expect(authService.getToken).toHaveBeenCalled();
    expect(apiService.addTask).toHaveBeenCalledWith('New task', 'New description', 'test-token', '2023-01-01', '10:30');
    expect(component.items.length).toBe(1);
    expect(component.items[0].title).toBe('New Task');
    expect(localStorage.setItem).toHaveBeenCalledWith('taskId', 'task-123');
    expect(component.showCreateListDialog).toBeFalse();
    expect(component.taskTitleInput).toBe('');
    expect(component.taskDescriptionInput).toBe('');
    // And other assertions for reset properties
  });

  // New tests will go here
