import { BrowserModule, HammerModule, HammerGestureConfig, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import { Injectable, NgModule } from '@angular/core';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HttpClientXsrfModule } from '@angular/common/http';

import { httpInterceptorProviders } from './lib/interceptor'

import { SharedModuleModule } from './lib/shared-module/shared-module.module';

import * as Hammer from 'hammerjs';

import {MatToolbarModule} from '@angular/material/toolbar';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { HomeComponent } from './home/home.component';
import { AboutUsComponent } from './about-us/about-us.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { CategoriesComponent } from './components/categories/categories.component';
import { ProductComponent } from './components/product/product.component';
import { ProductResolver } from './components/product/product-resolver';
import { CartComponent } from './components/cart/cart.component';
import { CartDetailsComponent } from './cart-details/cart-details.component';
import { SideNavListComponent } from './header/side-nav-list/side-nav-list.component';
import { AddToCartComponent } from './components/add-to-cart/add-to-cart.component';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { ProductDetailsResolver } from './product-details/product-details-resolver';
import { EditMessageComponent } from './cart-details/edit-message/edit-message.component';
import { SearchComponent } from './components/search/search.component';
import { SearchResultComponent } from './search-result/search-result.component';


@Injectable()
export class MyHammerConfig extends HammerGestureConfig {
  overrides = <any> {
    swipe: { direction: Hammer.DIRECTION_ALL },
  };
}

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HeaderComponent,
    FooterComponent,
    AboutUsComponent,
    ContactUsComponent,
    PageNotFoundComponent,
    CategoriesComponent,
    ProductComponent,
    CartComponent,
    CartDetailsComponent,
    SideNavListComponent,
    AddToCartComponent,
    ProductDetailsComponent,
    EditMessageComponent,
    SearchComponent,
    SearchResultComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    SharedModuleModule,
    HammerModule,

    MatToolbarModule,

    HttpClientModule,
    HttpClientXsrfModule.disable(),
  ],
  providers: [
    httpInterceptorProviders,
    ProductResolver,
    ProductDetailsResolver,
    {
      provide: HAMMER_GESTURE_CONFIG,
      useClass: MyHammerConfig,
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
