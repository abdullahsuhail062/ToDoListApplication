import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-share-dialog',
  templateUrl: './share-dialog.component.html',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
  ],
})
export class ShareDialogComponent {
  email: string = '';

  @Output() emailShared = new EventEmitter<string>();
  @Output() cancelled = new EventEmitter<void>();

  constructor() {}

  onNoClick(): void {
    this.cancelled.emit();
  }

  shareList(): void {
    this.emailShared.emit(this.email);
  }
}
