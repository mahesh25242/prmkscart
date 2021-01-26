import { Injectable } from '@angular/core';
import { AngularFireMessaging } from '@angular/fire/messaging';
import { BehaviorSubject, of } from 'rxjs'
import { catchError, mergeMap, tap } from 'rxjs/operators';
import { AngularFireFunctions } from '@angular/fire/functions';


@Injectable()
export class MessagingService {

currentMessage = new BehaviorSubject(null);

constructor(private angularFireMessaging: AngularFireMessaging,
  private afns: AngularFireFunctions,
  ) {

     this.angularFireMessaging.messages.subscribe(
     (msgings: AngularFireMessaging) => {
        if(msgings.onMessage)
          msgings.onMessage = msgings.onMessage.bind(msgings);
        if(msgings.onTokenRefresh)
          msgings.onTokenRefresh=msgings.onTokenRefresh.bind(msgings);
    })
  }

  requestPermission() {
    return this.angularFireMessaging.requestToken;
  }

  getToken(){
    return this.angularFireMessaging.getToken.pipe(catchError(err=>{
      return of(null);
    }));
  }

  receiveMessage() {
    return this.angularFireMessaging.messages.pipe(tap(msg=> this.currentMessage.next(msg)))
  }

  deleteToken() {
    this.angularFireMessaging.getToken
      .pipe(mergeMap(token => this.angularFireMessaging.deleteToken(token)));
      // .subscribe(
      //   (token) => { console.log('Token deleted!'); },
      // );
  }
}
