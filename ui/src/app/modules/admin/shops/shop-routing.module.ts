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
