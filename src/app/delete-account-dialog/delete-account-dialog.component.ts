import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-delete-account-dialog',
  standalone: true,
  imports: [], // No Material modules
  templateUrl: './delete-account-dialog.component.html',
  styleUrl: './delete-account-dialog.component.scss' // This will be empty or removed later
})
export class DeleteAccountDialogComponent {
  @Output() deleteConfirmed = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  confirmDelete(): void {
    this.deleteConfirmed.emit();
  }

  closeAll(): void {
    this.cancelled.emit();
  }
}
