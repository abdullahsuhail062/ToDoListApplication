
import { ApplicationConfig,  ErrorHandler } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import {  provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { ApiService } from './api-service.service';
import { GlobalErrorHandler } from './global-error-handler';
import { authInterceptor } from './authFiles/auth-Interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideClientHydration(),
    provideHttpClient(withFetch(),withInterceptors([authInterceptor])),
    provideAnimationsAsync(),
   
    {
      provide: ErrorHandler,
      useClass: GlobalErrorHandler
    },
    ApiService
  ]
};
