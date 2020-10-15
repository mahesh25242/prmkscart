import { Component, OnInit, OnDestroy } from '@angular/core';
import * as _ from 'lodash';
import { Router } from '@angular/router';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {


  constructor(
    private router: Router) { }

  ngOnInit(): void {

  }

  signIn(){

    //activeModal.componentInstance.isEdit = false;
  }

  signOut(){

  }

  ngOnDestroy(){

  }
}
