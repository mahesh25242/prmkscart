import { Component, OnInit } from '@angular/core';

import { FormGroup, FormArray, FormBuilder,
  Validators,ReactiveFormsModule  } from '@angular/forms';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit {
  signInFrm:FormGroup;
  invalidlogin:boolean = false;
  constructor(private formBuilder: FormBuilder) { }
  signIn(){
    alert("as")
  }
  get f(){ return this.signInFrm.controls}
  ngOnInit(): void {
    this.signInFrm = this.formBuilder.group({
      mobile: [null, [Validators.required]],
      password: [null, [Validators.required]]
    });
  }

}
