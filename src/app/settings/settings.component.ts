import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DeleteAccountDialogComponent } from '../delete-account-dialog/delete-account-dialog.component';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DeleteAccountDialogComponent
  ],
})
export class SettingsComponent {
  showDeleteAccountDialog: boolean = false;

  constructor() {}

  openDeleteAccountDialog(): void {
    this.showDeleteAccountDialog = true;
  }

  handleDeleteConfirmed(): void {
    // Logic to actually delete the account
    console.log('Account deletion confirmed!');
    this.showDeleteAccountDialog = false;
  }

  handleDeletionCancelled(): void {
    console.log('Account deletion cancelled.');
    this.showDeleteAccountDialog = false;
  }
}
