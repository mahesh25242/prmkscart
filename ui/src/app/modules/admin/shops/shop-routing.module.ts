import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminAuthGuard, NegateAuthGuard } from '../../../lib/guard';
import { UsersComponent } from './users/users.component';
import { UsersResolver } from './users/users-resolver';
import { ShopsComponent } from './shops.component';
import { ShopsResolver } from './shops-resolver';
import { CreateComponent } from './create/create.component';
import { ListComponent } from './list/list.component';
import { ShopCategoryComponent } from './shop-category/shop-category.component';
import { ShopCategoryResolver } from './shop-category/shop-category-resolver';
import { EditShopResolver } from './create/edit-shop-resolver';
import { ShopComponent } from './shop/shop.component';
import { ShopResolver } from './shop/shop-resolver';
import { CategoriesComponent } from './shop/categories/categories.component';
import { CategoriesResolver } from './shop/categories/categories-resolver';
import { ProductsComponent } from './shop/products/products.component';
import { ProductsResolver } from './shop/products/products-resolver';
import { OrdersComponent } from './shop/orders/orders.component';
import { OrdersResolver } from './shop/orders/orders-resolver';
import { DeliveryLocationsComponent } from './shop/delivery-locations/delivery-locations.component';
import { DeliveryLocationsResolver } from './shop/delivery-locations/delivery-locations-resolver';


const routes: Routes = [
  {
    path: '',
    component: ShopsComponent,
    children:[
      {
        path: '',
        component: ListComponent,
        resolve:{
          shops: ShopsResolver
        },
      },
      {
        path: 'create',
        component: CreateComponent,
      },
      {
        path: 'edit/:id',
        component: CreateComponent,
        resolve:{
          shop: EditShopResolver
        },
      },
      {
        path: 'categories',
        component: ShopCategoryComponent,
        resolve:{
          shops: ShopCategoryResolver
        },
      },
      {
        path: 'shop/:id',
        component: ShopComponent,
        resolve:{
          shop : ShopResolver
        },
        children:[
          {
            path: 'categories',
            component: CategoriesComponent,
            resolve:{
              shops: CategoriesResolver
            },
          },
          {
            path: 'products',
            component: ProductsComponent,
            resolve:{
              products: ProductsResolver
            },
          },
          {
            path: 'delivery-locations',
            component: DeliveryLocationsComponent,
            resolve:{
              delivaries: DeliveryLocationsResolver
            },
          },
          {
            path: 'orders',
            component: OrdersComponent,
            resolve:{
              orders: OrdersResolver
            },
          },
        ]
      },
      {
        path: 'customers',
        component: UsersComponent,
        resolve:{
          users: UsersResolver
        }
      },

    ]
  },




];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ShopRoutingModule { }
