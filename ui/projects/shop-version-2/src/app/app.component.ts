import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  Event,
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  Router
} from '@angular/router';
import { SwUpdate } from '@angular/service-worker';
import Notiflix from 'notiflix';
import { empty, Observable, of, Subscription } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { GeneralService, MessagingService } from './lib/services';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy{
  title = '';
  showPushNoti: Subscription;
  receiveMessageSubScr: Subscription;
  isAdmin$: Observable<boolean>;
  constructor(public router: Router, private generalService: GeneralService,
    private swUpdate: SwUpdate,
    private messagingService: MessagingService,
    private matSnackBar: MatSnackBar,) {

      swUpdate.available.subscribe(event => {
        console.log('current version is', event.current);
        console.log('available version is', event.available);
      });
      swUpdate.activated.subscribe(event => {
        console.log('old version was', event.previous);
        console.log('new version is', event.current);
      });

      swUpdate.available.subscribe(event => {
          swUpdate.activateUpdate().then(() => this.updateApp());
      });

    this.router.events.subscribe((event: Event) => {
      switch (true) {
        case event instanceof NavigationStart: {
          Notiflix.Loading.Pulse();
          break;
        }
        case event instanceof NavigationEnd:
        case event instanceof NavigationCancel:
        case event instanceof NavigationError: {
          Notiflix.Loading.Remove();
          break;
        }
        default: {
          break;
        }
      }
    });
  }
  ngOnInit(): void {




    this.isAdmin$ = this.generalService.isAdmin$.asObservable();


  	this.receiveMessageSubScr = this.messagingService.requestPermission().pipe(mergeMap(res=>{
      //console.log(res)
      if(res)
        return this.messagingService.receiveMessage()
      else
        of(false);
    })).subscribe(res=>{

    }, error =>{
      console.error('You are disabled notification');
      //this.matSnackBar.open(`You are disabled notification`, 'close');
    });
  	this.showPushNoti = this.messagingService.currentMessage.asObservable().subscribe(msg=>{
      //console.log(msg)
      if(msg)
        this.matSnackBar.open(`${msg.notification?.title} - ${msg.notification?.body}`, 'close');
    })
  }

  updateApp(){
    document.location.reload();
    console.log("The app is updating right now");

   }

   ngOnDestroy(){
     if(this.showPushNoti){
       this.showPushNoti.unsubscribe();
     }
     if(this.receiveMessageSubScr){
      this.receiveMessageSubScr.unsubscribe();
     }
   }
}
