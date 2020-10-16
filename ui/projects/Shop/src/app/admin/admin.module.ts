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

@NgModule({
  declarations: [  SignInComponent, HomeComponent, CategoriesComponent, ProductsComponent, EditProfileComponent, CreateCategoryComponent, CreateProductComponent],
  imports: [
    CommonModule,
    AdminRoutingModule,
    SharedModuleModule,
  ],
  providers:[
    CategoriesResolver,
    ProductsResolver
  ]
})
export class AdminModule { }
