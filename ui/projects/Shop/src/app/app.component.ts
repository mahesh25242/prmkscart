import { Component, OnInit } from '@angular/core';
import {
  Event,
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  Router
} from '@angular/router';
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
  constructor(public router: Router, private generalService: GeneralService) {
    this.router.events.subscribe((event: Event) => {
      switch (true) {
        case event instanceof NavigationStart: {
          Notiflix.Loading.Arrows();
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
}
