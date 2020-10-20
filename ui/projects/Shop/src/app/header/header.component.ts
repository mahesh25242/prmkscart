import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import * as _ from 'lodash';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { Observable, Subscription } from 'rxjs';
import { Shop, User } from 'src/app/lib/interfaces';
import {  UserService, ShopService } from 'src/app/lib/services';
import { mergeMap, map } from 'rxjs/operators';
import { GeneralService } from '../lib/services/index';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  title : string = environment.siteName;
  loggedUser$: Observable<User>;
  @Output() public sidenavToggle = new EventEmitter();

  layOutXSmall$:Observable<BreakpointState>;
  loggedSubScrioption: Subscription;
  signOutSubscription: Subscription;

  constructor(
    private router: Router,
    private userService: UserService,
    private breakpointObserver: BreakpointObserver,
    private shopService: ShopService) {

    }

  ngOnInit(): void {
    this.layOutXSmall$ = this.breakpointObserver.observe([
      Breakpoints.XSmall
    ])



    this.loggedUser$ = this.userService.getloggedUser.pipe(mergeMap(user=>{
      return this.shopService.shopDetail().pipe(map(res=>{
        return user;
      }))
    }));
    this.loggedSubScrioption = this.userService.authUser().subscribe();

  }

  onToggleSidenav = () => {
    this.sidenavToggle.emit();
  }

  signOut(){
    this.signOutSubscription = this.userService.setUserLogin({action:'SignOut'}).pipe(mergeMap(sRes=>{
      return this.userService.signOut().pipe(mergeMap(res=>{
        localStorage.removeItem('token');
        return this.userService.authUser();
      }))
    })).subscribe(res=>{

    }, err=>{
      this.router.navigate(['/']);
    });
  }
  ngOnDestroy(){
    if(this.loggedSubScrioption){
      this.loggedSubScrioption.unsubscribe();
    }
    if(this.signOutSubscription){
      this.signOutSubscription.unsubscribe();
    }

  }
}
