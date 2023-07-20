import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

/*
  Generated class for the LocationProvider provider.
  
*/
@Injectable()
export class LocationProvider {



  constructor(public http: HttpClient) {
    console.log('Hello LocationProvider Provider');
    
  }

  // Function requests country data from internet source
  requestLocation(location:string): Observable<any> {
    return this.http.get("https://restcountries.com/v3.1/capital/" + location);
  }
  
  // Function requests weather data from internet source
  requestWeather(unitTemp:string, lat:string, lon:string): Observable<any> {
    return this.http.get("https://api.weatherbit.io/v2.0/current?lat=" + lat + "&lon=" + lon + "&units=" + unitTemp + "&key=1b32ced6fbd04527a5273c5012dcfb7e");
  }

  // Function requests news data from internet source
  requestNews(location:string): Observable<any> {
    return this.http.get("https://newsapi.org/v2/top-headlines?country=" + location + "&pageSize=5&apiKey=0587e5206bb8464c80c79e6e96f313fc");
  }

  // Function requests time/date data from internet source
  requestTime(lat:string, lon:string): Observable<any> {
    return this.http.get("http://api.timezonedb.com/v2.1/get-time-zone?key=XE7JNI6TB7HZ&format=json&by=position&lat=" + lat + "&lng=" + lon);
  }
}


