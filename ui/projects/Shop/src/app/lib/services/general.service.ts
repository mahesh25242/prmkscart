import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { tap } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class GeneralService {
  private layOut$: BehaviorSubject<BreakpointState> = new BehaviorSubject<BreakpointState>(null);

  constructor(private http: HttpClient,
    private breakpointObserver: BreakpointObserver) { }

  get layOut(){
    return this.layOut$.asObservable();
  }

  sentContact(postData: any = null){
    return this.http.post("/sentContact", postData);
  }

  responsive(){
     return this.breakpointObserver.observe([
      Breakpoints.XSmall,
      Breakpoints.Medium,
      Breakpoints.Large,
      Breakpoints.XLarge,
    ]).pipe(tap(res=>{
      this.layOut$.next(res);
    }))
  }
}
