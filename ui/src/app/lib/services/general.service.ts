import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GeneralService {

  constructor(private http: HttpClient) { }

  sentContact(postData: any = null){
    return this.http.post("/sentContact", postData);
  }

  reverseLatLngAddress(pos: {lon: number, lat: number}= null){
    return this.http.get(`${environment.openstreetmap}/reverse?format=json&lon=${pos.lon}&lat=${pos.lat}`);
  }
}
