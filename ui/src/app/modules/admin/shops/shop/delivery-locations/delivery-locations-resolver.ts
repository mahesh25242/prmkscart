import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot  } from '@angular/router';
import { empty, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ShopService  } from '../../../../../lib/services';

@Injectable()
export class DeliveryLocationsResolver implements Resolve<any> {

  constructor(
    private shopService: ShopService) { }

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    return this.shopService.shopDeliveries( {
      'shop_key': route.parent.params.id
    });
  }
}
