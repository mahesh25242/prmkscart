import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot  } from '@angular/router';
import { first } from 'lodash';
import { empty, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ShopProductCategory } from 'src/app/lib/interfaces';
import { ShopProductCategoryService, ShopProductService } from 'src/app/lib/services';

@Injectable()
export class ProductResolver implements Resolve<any> {

  constructor(
    private shopProductService: ShopProductService,
    private shopProductCategoryService: ShopProductCategoryService) { }

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    if(route.params?.catUrl){
      this.shopProductCategoryService.isCatExistsInAddressBar$.next(false);
      return this.shopProductService.showProducts({
        cat_url: route.params?.catUrl
      });
    }else{
      this.shopProductCategoryService.isCatExistsInAddressBar$.next(true);
      this.shopProductCategoryService.categories.pipe(map(res=>{
        const cat:ShopProductCategory = first(res);
        if(cat){
          return this.shopProductService.showProducts({
            shop_product_category_id: cat.id
          });
        }else{
          return empty();
        }
      }));

    }

  }
}
