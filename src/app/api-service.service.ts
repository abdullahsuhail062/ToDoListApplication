import { Injectable } from '@angular/core';
import { catchError, Observable, switchMap, throwError } from 'rxjs';
import { environmentProd } from './environments/environment.prod'; 
import { weatherForecastEnvironment, weatherApiBaseUrl } from './environments/environment.prod';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './authFiles/auth.service';





@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private apiUrl = environmentProd.apiUrl
  private weatherApiUrl = weatherApiBaseUrl
  private apikey = weatherForecastEnvironment.apiKey
  constructor(private http: HttpClient, private authService: AuthService) {}

   logError(error: any) {
    // You can customize what to send
    const payload = {
      message: error?.message || error.toString(),
      stack: error?.stack || null,
      time: new Date().toISOString()
    };

    // Send to backend API
    return this.http.post(this.apiUrl, payload).subscribe({
      next: () => console.log('Error logged successfully'),
      error: (err) => console.error('Failed to log error', err)
    });
  }
    

  registerUser(formData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/users/registerUser`,formData,{responseType: 'json'})
}
  loginUser(formData: any): Observable<any>{
    return this.http.post(`${this.apiUrl}/users/loginUser`, formData,{responseType: 'json'})
  }

  fetchUserProfile(): Observable<any>{
    return this.http.get(`${this.apiUrl}/api/fetchUserProfile`)}
  deleteAccount(): Observable<any> {
    return this.http.delete(`${this.apiUrl}/api/deleteAccount`);
  }

  addTask(title:any,description: any,token: any,date:string | null,time:string | null): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/tasks`,  {title,description,date,time});
}
    
saveTask(title:any,description: any,taskId:any): Observable<any>{
  return this.http.put(`${this.apiUrl}/api/updateTask`, { description,title,taskId});

}
deleteTask(taskTitle: any): Observable<any> {
  return this.http.delete(`${this.apiUrl}/api/deleteTask`,{params:{title:taskTitle}} 
  );
}

taskCompeletion(completed:boolean,taskTitle:string | null): Observable<any> {
  return this.http.put(`${this.apiUrl}/api/taskCompeletion`,{completed,taskTitle})
}

getTasks(token:any): Observable<any> {
  return this.http.get(`${this.apiUrl}/api/fetchTasks`,{headers:{'authorization': `Bearer ${token}` }})
}

getCompletion(body: string): Observable<any> {
  return this.http.post(`${this.apiUrl}/ask`,{body})
}

taskTitleCheck(title: string): Observable<any> {
  return this.http.get(`${this.apiUrl}/api/checkTitle`, { 
    params: { title } 
  });
}

onFocusTitleChecking(title: string): Observable<any> {
  return this.http.get(`${this.apiUrl}/api/onFocusTitleChecking`,{params:{title}})
}

toggleFavoriteIconState(isFavorite: boolean): Observable<any> {
  

  return this.http.post(`${this.apiUrl}/api/toggleFavoriteIconState`, 
    { isFavorite }
  );
}


fetchFavoriteIconState(): Observable<any>{
  return this.http.get(`${this.apiUrl}/api/fetchfavoriteIconState`)
  
}

fetchWeatherForecast(location: { latitude: number, longitude: number }): Observable<any> {
  // Correct the URL with proper query parameters for location (lat, lon) and API key
  return this.http.get(`https://api.weatherapi.com/v1/current.json?key=${this.apikey}&q=${location.latitude},${location.longitude}&units=metric`);
}


fetchWeatherForecastBySearch(city: string): Observable<any> {
  return this.http.get(`https://api.weatherapi.com/v1/current.json?key=${this.apikey}&q=${city}`);  
  
}
shareTaskList(title: string, email: string): Observable<any> {
  return this.http.post(`${this.apiUrl}/api/shareTaskList`, { title, email });
}

  deleteCompletedTasks(taskTitles: string[]): Observable<any> {
    
    return this.http.delete(`${this.apiUrl}/api/deleteCompletedTasks`,{
      body: { titles: taskTitles } 
    });
  }
}
  


  




 


  