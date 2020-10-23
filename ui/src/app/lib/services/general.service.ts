import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import {Title} from "@angular/platform-browser";
import { tap } from 'rxjs/operators';
import { BC } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class GeneralService {
  bc$: BehaviorSubject<BC> = new BehaviorSubject<BC>(null);
  constructor(private http: HttpClient,
    private titleService:Title) { }

  get bc(){
    return this.bc$.asObservable().pipe(tap(res=>{
      this.titleService.setTitle(`${res?.siteName} ${ (res?.siteName && res?.title) ? ':': '' } ${res?.title}`);
    }));
  }
  sentContact(postData: any = null){
    return this.http.post("/sentContact", postData);
  }

  reverseLatLngAddress(pos: {lon: number, lat: number}= null){
    return this.http.get(`${environment.openstreetmap}/reverse?format=json&lon=${pos.lon}&lat=${pos.lat}`);
  }

  getLocation(): Observable<any> {
    return new Observable(obs => {
      navigator.geolocation.getCurrentPosition(
        success => {
          obs.next(success);
          obs.complete();
        },
        error => {
          obs.error(error);
        }
      );
    });
  }

}
