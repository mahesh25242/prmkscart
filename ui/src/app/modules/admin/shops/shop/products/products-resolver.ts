import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot  } from '@angular/router';
import { empty, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ShopProductService } from '../../../../../lib/services';

@Injectable()
export class ProductsResolver implements Resolve<any> {

  constructor(
    private shopProductService: ShopProductService) { }

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    return this.shopProductService.listproducts(1, {
      'shop_key': route.parent.params.id
    });
  }
}
