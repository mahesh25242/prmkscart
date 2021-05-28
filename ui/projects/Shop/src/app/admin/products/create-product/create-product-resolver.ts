import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot  } from '@angular/router';
import { empty, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { ShopProductService } from '../../../../../../../src/app/lib/services';

@Injectable()
export class CreateProductResolver implements Resolve<any> {

  constructor(
    private shopProductService: ShopProductService) { }

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    const id = parseInt(route.params.id ,0);
    return this.shopProductService.showProductDetails({id});
  }
}
