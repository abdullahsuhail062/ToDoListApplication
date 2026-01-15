import { Injectable } from "@angular/core";
import { ApiService } from "./api-service.service";


@Injectable({ providedIn: 'root' })
export class WeatherService {
  constructor(private api: ApiService) {}

  fetchByLocation(loc: { latitude: number; longitude: number }) {
    return this.api.fetchWeatherForecast(loc);
  }

  fetchByCity(city: string) {
    return this.api.fetchWeatherForecastBySearch(city);
  }
}
