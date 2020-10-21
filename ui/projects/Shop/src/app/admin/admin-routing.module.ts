import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SignInComponent } from './sign-in/sign-in.component';
import { AdminAuthGuard, NegateAuthGuard } from '../lib/guard';
import { HomeComponent } from './home/home.component';
import { CategoriesComponent } from './categories/categories.component';
import { ProductsComponent } from './products/products.component';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { CategoriesResolver } from './categories/categories-resolver';
import { ProductsResolver } from './products/products-resolver';
import { ShopDeliveryResolver } from './shop-delivery/shop-delivery-resolver';
import { ShopDeliveryComponent } from './shop-delivery/shop-delivery.component';
import { ShopDetailsComponent } from './shop-details/shop-details.component';
import { OrdersComponent } from './orders/orders.component';
import { OrdersResolver } from './orders/orders-resolver';



const routes: Routes = [
  {
    path: '',
    component: SignInComponent,
    canActivate: [NegateAuthGuard],
  },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [AdminAuthGuard],
  },
  {
    path: 'categories',
    component: CategoriesComponent,
    canActivate: [AdminAuthGuard],
    resolve:{
      cats: CategoriesResolver
    }
  },
  {
    path: 'products',
    component: ProductsComponent,
    canActivate: [AdminAuthGuard],
    resolve:{
      products: ProductsResolver
    }
  },
  {
    path: 'deliveries',
    component: ShopDeliveryComponent,
    canActivate: [AdminAuthGuard],
    resolve:{
      deliveries: ShopDeliveryResolver
    }
  },
  {
    path: 'details',
    component: ShopDetailsComponent,
    canActivate: [AdminAuthGuard],
  },
  {
    path: 'orders',
    component: OrdersComponent,
    canActivate: [AdminAuthGuard],
    resolve:{
      orders: OrdersResolver
    }
  },
  {
    path: 'edit-profile',
    component: EditProfileComponent,
    canActivate: [AdminAuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
