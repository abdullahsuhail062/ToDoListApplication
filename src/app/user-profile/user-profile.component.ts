import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common'; // Needed for ngIf, etc.
import { DeleteAccountDialogComponent } from '../delete-account-dialog/delete-account-dialog.component';
import { SharedService } from '../shared.service'; // Keep SharedService for now

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, DeleteAccountDialogComponent],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss'
})
export class UserProfileComponent implements OnInit {

  @Input() username: string = '';
  @Input() email: string = '';
  @Input() profilePhoto: string = '';

  @Output() logoutClicked = new EventEmitter<void>();
  @Output() dashboardClicked = new EventEmitter<void>();
  @Output() addAnotherAccountClicked = new EventEmitter<void>();
  @Output() closeProfile = new EventEmitter<void>(); // To close this profile component

  showDeleteAccountDialog: boolean = false;

  constructor(private sharedService: SharedService) {} // Keep SharedService if it's used elsewhere

  ngOnInit(): void {
    // No longer relying on MAT_DIALOG_DATA for initial values
  }

  logout(): void {
    this.logoutClicked.emit();
  }

  dashboard(): void {
    this.dashboardClicked.emit();
  }

  openDeleteAccountDialog(): void {
    this.showDeleteAccountDialog = true;
  }

  addAnOtherAccount(): void {
    this.addAnotherAccountClicked.emit();
  }

  handleDeleteConfirmed(): void {
    console.log('User profile: Account deletion confirmed!');
    // Emit an event or call a service method to handle actual deletion
    this.showDeleteAccountDialog = false;
    this.closeProfile.emit(); // Optionally close profile after deletion
  }

  handleDeletionCancelled(): void {
    console.log('User profile: Account deletion cancelled.');
    this.showDeleteAccountDialog = false;
  }
}