import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, Router  } from '@angular/router';
import { first } from 'lodash';
import { empty, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ShopProductCategory } from '../../../../../src/app/lib/interfaces';
import { ShopProductCategoryService, ShopProductService } from '../../../../../src/app/lib/services';

@Injectable()
export class ProductDetailsResolver implements Resolve<any> {

  constructor(
    private shopProductService: ShopProductService,
    private shopProductCategoryService: ShopProductCategoryService,
    private router: Router) { }

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    return this.shopProductService.showProductDetails({
      url: route.params?.productUrl
    }).pipe(tap(res=>{
      if(!res){
        this.router.navigate([`/404`]);
      }
    }));

  }
}
