import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot  } from '@angular/router';
import { empty, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CartService } from '../../../../../lib/services';

@Injectable()
export class OrdersResolver implements Resolve<any> {

  constructor(
    private CartService: CartService) { }

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    return this.CartService.getAllOrders(1, {
      'shop_key': route.parent.params.id
    });
  }
}
