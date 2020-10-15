import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { State } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class StateService {

  constructor(private http: HttpClient) { }

  states(country_id: number=0){
    return this.http.get<State[]>(`/states?country_id=${country_id}`);
  }
}
