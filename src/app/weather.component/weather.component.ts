import { Component, Inject, NgModule, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { ApiService } from '../api-service.service.js';
import { isPlatformBrowser } from '@angular/common';
import { platform } from 'os';
import { Observable, Subscriber, Subscription } from 'rxjs';
import { FormsModule } from '@angular/forms';



@Component({
  selector: 'app-weather.apiservice',
  imports: [FormsModule],
  templateUrl: './weather.component.html',
  styleUrl: './weather.component.css',
})
export class WeatherComponent implements OnInit, OnDestroy{


  /* ---------------------------------- */
  /* Weather                            */
  /* ---------------------------------- */
  city = '';
  region = '';
  country = '';
  temp = '';
  cloud = '';
  update = '';
  weatherCondition = '';
  weatherIcon = '';
  inputValue = '';
  error = '';
  location: any;
   isUpdateLoading = false;
  hasDataFetched = false;
  isCityNameCorrect = false;
private refreshInterval: any;
private isBrowser: boolean;
private sub?: Subscription



  constructor(private apiService: ApiService,  @Inject(PLATFORM_ID) platformId: Object ) {
     this.isBrowser = isPlatformBrowser(platformId)
  }

  ngOnInit(): void {
    this.initWeather()
    this.isUpdateLoading = true
  }

  initWeather() {
      if (!this.isBrowser) return;
  
      this.getLocationObservable().subscribe({
        next: (loc:any) => {
          this.location = loc;
          this.fetchWeather(loc);
          this.refreshInterval = setInterval(() => {
            this.fetchWeather(loc);
          }, 900000);
        },
        error: () => (this.isUpdateLoading = false)
      });
    }
  
    fetchWeather(location: { latitude: number; longitude: number }) {
      this.sub = this.apiService.fetchWeatherForecast(location).subscribe({
        next: (data) => {
          this.hasDataFetched = true;
          this.isUpdateLoading = false;
          this.city = data.location.name;
          this.region = data.location.region;
          this.country = data.location.country;
          this.temp = data.current.temp_c;
          this.cloud = data.current.cloud;
          this.weatherCondition = data.current.condition.text;
          this.weatherIcon = data.current.condition.icon;
          this.update = data.current.last_updated.replace(' ', ': ');
        },
        error: () => (this.isUpdateLoading = false)
      });
    }

    ngOnDestroy(): void {
    if (this.refreshInterval) clearInterval(this.refreshInterval);
    this.sub?.unsubscribe();
  }

  
    getLocationObservable(): Observable<any> {
      return new Observable((subscriber) => {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            subscriber.next({
              latitude: pos.coords.latitude,
              longitude: pos.coords.longitude
            });
            subscriber.complete();
          },
          (err) => subscriber.error(err)
        );
      });
    }
  
    search() {
      this.fetchWeatherBySearch();
      this.inputValue = '';
    }
  
    fetchWeatherBySearch() {
      if (this.inputValue.trim().length > 0) {
        this.apiService.fetchWeatherForecastBySearch(this.inputValue).subscribe({
          next: (data) => {
            this.hasDataFetched = true;
            this.isCityNameCorrect = false;
            this.city = data.location.name;
            this.region = data.location.region;
            this.country = data.location.country;
            this.temp = data.current.temp_c;
            this.cloud = data.current.cloud;
            this.weatherCondition = data.current.condition.text;
            this.weatherIcon = data.current.condition.icon;
            this.update = data.current.last_updated.replace(' ', ': ');
          },
          error: (error) => {
            this.error = 'City not found, check spelling';
            this.isCityNameCorrect = true;
          }
        });
      }
    }

}
