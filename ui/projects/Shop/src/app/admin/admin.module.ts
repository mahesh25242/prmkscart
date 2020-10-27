import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModuleModule } from '../lib/shared-module/shared-module.module';

import {  AdminRoutingModule } from './admin-routing.module';
import { SignInComponent } from './sign-in/sign-in.component';
import { HomeComponent } from './home/home.component';
import { CategoriesComponent } from './categories/categories.component';
import { CategoriesResolver } from './categories/categories-resolver';
import { ProductsComponent } from './products/products.component';
import { ProductsResolver } from './products/products-resolver';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { CreateCategoryComponent } from './categories/create-category/create-category.component';
import { CreateProductComponent } from './products/create-product/create-product.component';
import { ShopDeliveryComponent } from './shop-delivery/shop-delivery.component';
import { ShopDeliveryResolver } from './shop-delivery/shop-delivery-resolver';
import { CreateShopDeliveryComponent } from './shop-delivery/create-shop-delivery/create-shop-delivery.component';
import { ShopDetailsComponent } from './shop-details/shop-details.component';
import { OrdersComponent } from './orders/orders.component';
import { OrdersResolver } from './orders/orders-resolver';
import { OrderDetailsComponent } from './orders/order-details/order-details.component';
import { OrderSearchComponent } from './orders/order-search/order-search.component';

@NgModule({
  declarations: [  SignInComponent, HomeComponent, CategoriesComponent, ProductsComponent, EditProfileComponent, CreateCategoryComponent, CreateProductComponent, ShopDeliveryComponent, CreateShopDeliveryComponent, ShopDetailsComponent, OrdersComponent, OrderDetailsComponent, OrderSearchComponent],
  imports: [
    CommonModule,
    AdminRoutingModule,
    SharedModuleModule,
  ],
  providers:[
    CategoriesResolver,
    ProductsResolver,
    ShopDeliveryResolver,
    OrdersResolver
  ]
})
export class AdminModule { }
