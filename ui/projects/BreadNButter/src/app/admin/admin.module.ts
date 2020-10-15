import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModuleModule } from '../lib/shared-module/shared-module.module';

import {  AdminRoutingModule } from './admin-routing.module';
import { SignInComponent } from './sign-in/sign-in.component';

@NgModule({
  declarations: [  SignInComponent],
  imports: [
    CommonModule,
    AdminRoutingModule,
    SharedModuleModule,
  ],
  providers:[

  ]
})
export class AdminModule { }
