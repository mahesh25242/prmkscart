import { Injectable } from '@angular/core';
import { HttpClient, HttpBackend } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { tap } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class GeneralService {
  shopDisabled$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);
  isAdmin$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);
  private httpClient: HttpClient;

  constructor(private http: HttpClient,
    handler: HttpBackend
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
    return this.httpClient.get<[{image: string}]>('/assets/json/home-banner.json');
  }



}
