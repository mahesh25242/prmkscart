import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { City } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class CityService {

  constructor(private http: HttpClient) { }

  cities(state_id:number = 0){
    return this.http.get<City[]>(`/cities?state_id=${state_id}`);
  }
}
