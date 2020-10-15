import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Shop } from 'src/app/lib/interfaces';
import { UserService } from 'src/app/lib/services';
import Notiflix from "notiflix";

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.scss']
})
export class CreateUserComponent implements OnInit, OnDestroy {
  @Input() nosave:boolean;
  @Input() shop: Shop;
  createUserFrm: FormGroup;

  saveUserSubScr: Subscription;
  constructor(private formBuilder: FormBuilder,
    private userService: UserService) { }

  get f(){ return this.createUserFrm.controls }

  saveUser(){
    const postData = {
      id: this.f.id.value,
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
    const saveUserService = this.userService.createAdmin(postData);

    if(this.nosave){
      return saveUserService;
    }else{
      Notiflix.Loading.Arrows();
      this.saveUserSubScr = saveUserService.subscribe(res=>{
        Notiflix.Loading.Remove();
        Notiflix.Notify.Success(`Successfully saved user `);
      }, error=>{
        Notiflix.Loading.Remove();
        if(error.status == 422){
          for(let result in this.createUserFrm.controls){
            if(error.error.errors[result]){
              this.createUserFrm.controls[result].setErrors({ error: error.error.errors[result] });
            }else{
              this.createUserFrm.controls[result].setErrors(null);
            }
          }
        }
      });
    }

  }

  ngOnInit(): void {
    this.createUserFrm = this.formBuilder.group({
      id: [null, []],
      fname: [null, []],
      mname: [null, []],
      lname: [null, []],
      email: [null, []],
      password: [null, []],
      password_confirmation: [null, []],
      phone: [null, []],
      status: [1, []],
      shop_id:[((this.shop && this.shop.id) ? this.shop.id : 0), []]
    });

    if(this.shop?.user_role?.user){
      this.createUserFrm.patchValue({
        id: this.shop?.user_role?.user.id,
        fname: this.shop?.user_role?.user.fname,
        lname: this.shop?.user_role?.user.lname,
        email: this.shop?.user_role?.user.email,
        phone: this.shop?.user_role?.user.phone,
        status: this.shop?.user_role?.user.status,
      });
    }

  }

  ngOnDestroy(){
    if(this.saveUserSubScr){
      this.saveUserSubScr.unsubscribe();
    }
  }

}
