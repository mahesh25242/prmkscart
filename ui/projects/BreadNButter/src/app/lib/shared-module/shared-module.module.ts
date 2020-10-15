import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeHtmlPipe } from '../pipes/safe-html.pipe';
import { NgSelectModule } from '@ng-select/ng-select';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {  RouterModule } from '@angular/router';
import { NgxCaptchaModule } from 'ngx-captcha';
import Notiflix from "notiflix";
// import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

Notiflix.Confirm.Init({ borderRadius:"5px",titleColor:"#204486",okButtonBackground:"#204486",cancelButtonBackground:"#e2e2e2",cancelButtonColor:"#393939", });
Notiflix.Notify.Init({ width:"390px", success: {background:"#d4edda",textColor:"#155724",}, failure: {background:"#f8d7da",textColor:"#721c24",}, warning: {background:"#fff3cd",textColor:"#856404",}, info: {background:"#cce5ff",textColor:"#004085",}, });
Notiflix.Report.Init({ svgSize:"80px",borderRadius:"5px",width:"390px", success: {svgColor:"#45c489",buttonBackground:"#204486",}, });
Notiflix.Loading.Init({ svgColor:"#204486", });
Notiflix.Block.Init({ svgColor:"#204486", });

@NgModule({
  declarations: [
    SafeHtmlPipe,
  ],
  imports: [
    CommonModule,
    // NgbModule,
    NgSelectModule,
    RouterModule,
    FontAwesomeModule,
    FormsModule,
    ReactiveFormsModule,
    NgxCaptchaModule
  ],
  exports:[
    NgSelectModule,
    // NgbModule,
    SafeHtmlPipe,
    FontAwesomeModule,
    FormsModule,
    ReactiveFormsModule,
    NgxCaptchaModule,
  ]
})
export class SharedModuleModule { }
