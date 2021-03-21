import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot  } from '@angular/router';
import { empty, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CartService } from '../../../../../../src/app/lib/services';

@Injectable()
export class OrdersResolver implements Resolve<any> {

  constructor(
    private cartService: CartService) { }

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    return this.cartService.getAllOrders();
  }
}
