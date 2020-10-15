import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HttpClientXsrfModule } from '@angular/common/http';

import { AngularFireModule } from "@angular/fire";
import { AngularFireAuthModule } from "@angular/fire/auth";

import { httpInterceptorProviders } from './lib/interceptor'
import {  SharedModuleModule } from './shared-module/shared-module.module';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { HomeComponent } from './home/home.component';
import { AboutUsComponent } from './about-us/about-us.component';
import { HowItWorksComponent } from './how-it-works/how-it-works.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';



var config = {
  apiKey: "AIzaSyBbf4J9nchYp2WSNePGZcRoYOUCYdCUiI0",
  authDomain: "mayatutor-f5748.firebaseapp.com",
  databaseURL: "https://mayatutor-f5748.firebaseio.com",
  projectId: "mayatutor-f5748",
  storageBucket: "mayatutor-f5748.appspot.com",
  messagingSenderId: "552545840820"
};



@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    SignInComponent,
    HomeComponent,
    AboutUsComponent,
    HowItWorksComponent,
    ContactUsComponent,
    PageNotFoundComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    SharedModuleModule,
    HttpClientModule,
    HttpClientXsrfModule.disable(),
    AngularFireModule.initializeApp(config),
    AngularFireAuthModule
  ],
  providers: [
    httpInterceptorProviders
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
