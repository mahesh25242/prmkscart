import { Component, OnInit, Input } from '@angular/core';
import {faUserGraduate,faUser } from '@fortawesome/free-solid-svg-icons';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SignInComponent } from 'src/app/sign-in/sign-in.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  @Input() type:string;
  faUserGraduate = faUserGraduate;
  faUser = faUser;
  constructor(private _modalService: NgbModal,) { }

  signIn(){
    const activeModal = this._modalService.open(SignInComponent);
    //activeModal.componentInstance.isEdit = false;
  }
  ngOnInit(): void {
  }

}
