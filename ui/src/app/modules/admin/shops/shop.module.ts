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
import { ShopComponent } from './shop/shop.component';
import { ShopResolver } from './shop/shop-resolver';
import { CreateAdminComponent } from './shop/create-admin/create-admin.component';
import { CategoriesComponent } from './shop/categories/categories.component';
import { CategoriesResolver } from './shop/categories/categories-resolver';
import { CreateCategoryComponent } from './shop/categories/create-category/create-category.component';
import { ProductsComponent } from './shop/products/products.component';
import { ProductsResolver } from './shop/products/products-resolver';
import { CreateProductComponent } from './shop/products/create-product/create-product.component';
import { OrdersComponent } from './shop/orders/orders.component';
import { OrdersResolver } from './shop/orders/orders-resolver';
import { OrderDetailsComponent } from './shop/orders/order-details/order-details.component';
import { DeliveryLocationsComponent } from './shop/delivery-locations/delivery-locations.component';
import { DeliveryLocationsResolver } from './shop/delivery-locations/delivery-locations-resolver';

@NgModule({
  declarations: [  UsersComponent, DetailsComponent, ShopsComponent, ListComponent, CreateComponent, CreateUserComponent, ShopCategoryComponent, CreateShopCategoryComponent, ShopComponent, CreateAdminComponent,
    CategoriesComponent, CreateCategoryComponent, ProductsComponent,
    CreateProductComponent,
    OrdersComponent,
    OrderDetailsComponent,
    DeliveryLocationsComponent],
  imports: [
    CommonModule,
    SharedModuleModule,
    ShopRoutingModule,

  ],
  providers:[
    UsersResolver,
    ShopsResolver,
    ShopCategoryResolver,
    EditShopResolver,
    ShopResolver,
    CategoriesResolver,
    ProductsResolver,
    OrdersResolver,
    DeliveryLocationsResolver
  ]
})
export class ShopModule { }
