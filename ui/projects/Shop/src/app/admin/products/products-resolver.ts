import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot  } from '@angular/router';
import { empty, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { ShopProductService } from '../../../../../../src/app/lib/services';

@Injectable()
export class ProductsResolver implements Resolve<any> {

  constructor(
    private shopProductService: ShopProductService) { }

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    const page = parseInt(route.params.page ,0);
    console.log(route.params)
    return this.shopProductService.listproducts((page+1), {
      pageSize : ((route.params?.pageSize) ? route.params?.pageSize : 20)
    });
  }
}
