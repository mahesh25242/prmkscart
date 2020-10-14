import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { UserService } from 'src/app/lib/services';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.scss']
})
export class CreateUserComponent implements OnInit, OnDestroy {
  @Input() nosave:boolean;
  createUserFrm: FormGroup;

  saveUserSubScr: Subscription;
  constructor(private formBuilder: FormBuilder,
    private userService: UserService) { }

  get f(){ return this.createUserFrm.controls }

  saveUser(){
    const postData = {
      fname: this.f.fname.value,
      mname: this.f.mname.value,
      lname: this.f.lname.value,
      email: this.f.email.value,
      password: this.f.password.value,
      password_confirmation: this.f.password_confirmation.value,
      phone: this.f.phone.value,
      status: this.f.status.value,
      shop_id: this.f.shop_id.value,
    }
    const saveUserService = this.userService.signUp(postData);

    if(this.nosave){
      return saveUserService;
    }else{
      this.saveUserSubScr = saveUserService.subscribe();
    }

  }

  ngOnInit(): void {
    this.createUserFrm = this.formBuilder.group({
      fname: [null, []],
      mname: [null, []],
      lname: [null, []],
      email: [null, []],
      password: [null, []],
      password_confirmation: [null, []],
      phone: [null, []],
      status: [null, []],
      shop_id:[null, []]
    });


  }

  ngOnDestroy(){
    if(this.saveUserSubScr){
      this.saveUserSubScr.unsubscribe();
    }
  }

}
