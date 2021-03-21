import { Injectable } from '@angular/core';
import { HttpClient, HttpBackend } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { tap } from 'rxjs/operators';
import {PlatformLocation } from '@angular/common';


@Injectable({
  providedIn: 'root'
})
export class GeneralService {
  shopDisabled$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);
  isAdmin$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);
  private httpClient: HttpClient;

  constructor(private http: HttpClient,
    private handler: HttpBackend,
    private platformLocation: PlatformLocation
    ) {
      this.httpClient = new HttpClient(handler);

    }

    get shopDisabled(){
      return this.shopDisabled$.asObservable();
    }


  sentContact(postData: any = null){
    return this.http.post("/sentContact", postData);
  }

  getAllBanners(): Observable<[{image: string}]>{
    const baseUrl = document.querySelector("base").getAttribute("href");//(this.platformLocation as any).location.origin;
    return this.httpClient.get<[{image: string}]>(`${baseUrl}assets/json/home-banner.json`);
  }



}
