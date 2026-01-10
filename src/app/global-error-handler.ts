import { ErrorHandler, inject } from "@angular/core";
import { ApiService } from "./api-service.service"; 

export class GlobalErrorHandler implements ErrorHandler {
    private apiService = inject(ApiService);
    private isServer = typeof window === 'undefined';
    handleError(error: any): void {
      if (this.isServer) return;
      this.apiService.logError(error);
    }
  }