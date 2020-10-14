import { Component, OnInit } from '@angular/core';
import {faUserGraduate,faUser,faClock,faStar,faStarHalfAlt,faSearch } from '@fortawesome/free-solid-svg-icons';
import { UserService } from '../lib/services';
import { Observable } from 'rxjs';
import { User } from '../lib/interfaces';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  faUserGraduate = faUserGraduate;
  faUser = faUser;
  faClock = faClock;
  faStar = faStar;
  faStarHalfAlt = faStarHalfAlt;
  faSearch = faSearch;



  loggedUser$: Observable<User>;
  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.loggedUser$ = this.userService.getloggedUser;



  }

}
