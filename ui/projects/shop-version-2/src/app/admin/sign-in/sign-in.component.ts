import { Component, OnInit } from '@angular/core';

import { FormGroup, FormArray, FormBuilder,
  Validators,ReactiveFormsModule  } from '@angular/forms';
import { Subscription } from 'rxjs';
import { GeneralService, UserService } from 'src/app/lib/services';
import Notiflix from "notiflix";
import { environment } from '../../../environments/environment';
import { map, mergeMap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit {
  signInFrm:FormGroup;
  invalidlogin:boolean = false;
  signInSubscription: Subscription;

  constructor(private formBuilder: FormBuilder,
    private userService: UserService,
    private router: Router,
    private generalService: GeneralService ) { }
  signIn(){
    Notiflix.Loading.Pulse(`please wait`);
    this.invalidlogin = false;

    const postData = {
      "grant_type": environment.grant_type,
      "client_id": environment.client_id,
      "client_secret": environment.lumenSecret,
      "password": this.f.password.value,
      "username": this.f.mobile.value,
      "scope": "",
      "recaptcha": null
    };

    this.signInSubscription = this.userService.signIn(postData).pipe(mergeMap(()=>{

      return this.userService.authUser().pipe(mergeMap(user=>{
        return this.userService.setUserLogin({action:'SignIn'}).pipe(map(()=>{
          return user
        }))
      }));
    })).subscribe(()=>{
      this.router.navigate(['/admin/home']);
      Notiflix.Loading.Remove();
    }, ()=>{
      Notiflix.Loading.Remove();
        this.invalidlogin = true;
        this.f.password.setValue(null);



    });
  }
  get f(){ return this.signInFrm.controls}
  ngOnInit(): void {
    this.generalService.bc$.next({
      siteName: environment.siteName,
      title: 'Admin Login',
      url:'',
      backUrl: null
    });


    this.signInFrm = this.formBuilder.group({
      mobile: [null, [Validators.required]],
      password: [null, [Validators.required]]
    });
  }

}
