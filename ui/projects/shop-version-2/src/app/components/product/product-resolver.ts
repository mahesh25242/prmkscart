import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot  } from '@angular/router';
import { first } from 'lodash';
import { empty, Observable } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { ShopProductCategory } from 'src/app/lib/interfaces';
import { ShopProductCategoryService, ShopProductService } from 'src/app/lib/services';
import { environment } from '../../../environments/environment';

@Injectable()
export class ProductResolver implements Resolve<any> {

  constructor(
    private shopProductService: ShopProductService,
    private shopProductCategoryService: ShopProductCategoryService) { }

  resolve(route: ActivatedRouteSnapshot): Observable<any> {

    if(route.params?.catUrl){
      this.shopProductService.allProduct = [];
      return  this.shopProductCategoryService.showCategories().pipe(mergeMap(res=>{
        return this.shopProductService.showProducts(1, {
          cat_url: route.params?.catUrl,
          pageSize : environment.productListPerPage
        });
      }))
    }else{
      this.shopProductService.allProduct = [];
      return this.shopProductCategoryService.showCategories().pipe(mergeMap(res=>{
        const cat:ShopProductCategory = first(res);

        if(cat){

          return this.shopProductService.showProducts(1, {
            shop_product_category_id: cat.id,
            pageSize : environment.productListPerPage
          });
        }else{
          return empty();
        }
      }));

    }

  }
}
