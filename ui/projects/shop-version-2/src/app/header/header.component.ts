import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import * as _ from 'lodash';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { BC } from 'src/app/lib/interfaces';
import {  ShopService } from 'src/app/lib/services';
import { mergeMap, map, delay } from 'rxjs/operators';
import { GeneralService as LocalGeneralService } from '../lib/services/index';
import { GeneralService } from 'src/app/lib/services';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  bc$: Observable<BC>;
  title : string = environment.siteName;
  @Output() public sidenavToggle = new EventEmitter();

  layOutXSmall$:Observable<BreakpointState>;



  constructor(
    private breakpointObserver: BreakpointObserver,
    private shopService: ShopService,
    public generalService: GeneralService,
    public localGeneralService: LocalGeneralService,
    ) {

    }


  ngOnInit(): void {


    this.layOutXSmall$ = this.breakpointObserver.observe([
      Breakpoints.XSmall
    ])




    // this.bc$ = this.generalService.bc.pipe(mergeMap(res=>{
    //   return this.shopService.shopDetail().pipe(map(()=>res))
    // }));

    this.bc$ = this.shopService.shopDetail().pipe(delay(1000),mergeMap(res=>{
      return this.generalService.bc
    }));
  }

  onToggleSidenav = () => {
    this.sidenavToggle.emit();
  }


  ngOnDestroy(){


  }
}
