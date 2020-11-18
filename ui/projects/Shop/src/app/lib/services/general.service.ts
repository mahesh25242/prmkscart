import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { tap } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class GeneralService {
  shopDisabled$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);
  isAdmin$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);

  constructor(private http: HttpClient,
    ) { }

    get shopDisabled(){
      return this.shopDisabled$.asObservable();
    }


  sentContact(postData: any = null){
    return this.http.post("/sentContact", postData);
  }



}
