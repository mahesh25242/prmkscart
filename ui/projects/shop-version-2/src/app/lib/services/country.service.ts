import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Country } from 'src/app/lib/interfaces';

@Injectable({
  providedIn: 'root'
})
export class CountryService {

  constructor(private http: HttpClient) { }
  countries(){
    return this.http.get<Country[]>("/countries");
  }
}
