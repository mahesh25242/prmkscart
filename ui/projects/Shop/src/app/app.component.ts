import { Component, OnInit } from '@angular/core';
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
import { Observable } from 'rxjs';
import { GeneralService } from './lib/services';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = '';
  isAdmin$: Observable<boolean>;
  constructor(public router: Router, private generalService: GeneralService,
    private swUpdate: SwUpdate) {

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
  }

  updateApp(){
    document.location.reload();
    console.log("The app is updating right now");

   }
}
