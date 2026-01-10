import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ApiService } from './api-service.service';

@Injectable({ providedIn: 'root' })
export class LoggerService {

  private isBrowser: boolean;

  constructor(
    private apiService: ApiService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

 logError(error: any): void {
    if (this.isBrowser) {
      this.apiService.logError(error);  // ✅ Works now
    } else {
      console.error('Server-side error:', error);
    }
  }
}
