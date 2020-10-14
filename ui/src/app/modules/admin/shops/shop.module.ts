import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModuleModule } from '../../../shared-module/shared-module.module';
import {  ShopRoutingModule } from './shop-routing.module';
import { UsersComponent } from './users/users.component';
import { UsersResolver } from './users/users-resolver';
import { DetailsComponent } from './users/details/details.component';
import { ShopsComponent } from './shops.component';
import { ShopsResolver } from './shops-resolver';
import { ListComponent } from './list/list.component';
import { CreateComponent } from './create/create.component';
import { EditShopResolver } from './create/edit-shop-resolver';
import { CreateUserComponent } from './users/create-user/create-user.component';
import { ShopCategoryComponent } from './shop-category/shop-category.component';
import { ShopCategoryResolver } from './shop-category/shop-category-resolver';
import { CreateShopCategoryComponent } from './shop-category/create-shop-category/create-shop-category.component';


@NgModule({
  declarations: [  UsersComponent, DetailsComponent, ShopsComponent, ListComponent, CreateComponent, CreateUserComponent, ShopCategoryComponent, CreateShopCategoryComponent],
  imports: [
    CommonModule,
    SharedModuleModule,
    ShopRoutingModule,

  ],
  providers:[
    UsersResolver,
    ShopsResolver,
    ShopCategoryResolver,
    EditShopResolver
  ]
})
export class ShopModule { }
