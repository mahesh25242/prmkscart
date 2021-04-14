import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AboutUsComponent } from './about-us/about-us.component';
import { CartDetailsComponent } from './cart-details/cart-details.component';
import { ProductResolver } from './components/product/product-resolver';
import { ProductComponent } from './components/product/product.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { HomeComponent } from './home/home.component';
import { LayoutComponent } from './layout/layout.component';
import { OrderDeatilResolver } from './order-deatil/order-deatil-resolver';
import { OrderDeatilComponent } from './order-deatil/order-deatil.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { ProductDetailsResolver } from './product-details/product-details-resolver';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { SearchResultComponent } from './search-result/search-result.component';

const routes: Routes = [
  {
    path: 'about-us',
    component: AboutUsComponent
  },
  {
    path: 'contact-us',
    component: ContactUsComponent
  },
  {
    path: 'bag',
    component: CartDetailsComponent
  },
  {
    path: 'order/:id',
    component: OrderDeatilComponent,
    resolve:{
      order: OrderDeatilResolver
    }
  },
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule)
  },
  {
    path: '',
    component: LayoutComponent,
    children:[
      {
        path: '',
        component: HomeComponent,
        resolve:{
          product: ProductResolver
        }
      },
      {
        path: 'search/:q',
        component: SearchResultComponent,
      },
      {
        path: ':catUrl/varities',
        component: HomeComponent,
        resolve:{
          product: ProductResolver
        }
      },
      {
        path: ':catUrl/:productUrl',
        component: ProductDetailsComponent,
        resolve:{
          product: ProductDetailsResolver
        }
      },
    ]
  },


  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
