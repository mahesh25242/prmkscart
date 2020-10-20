import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot  } from '@angular/router';
import { empty, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ShopService } from '../../../../../../src/app/lib/services';

@Injectable()
export class ShopDeliveryResolver implements Resolve<any> {

  constructor(
    private shopService: ShopService) { }

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    return this.shopService.shopDeliveries();
  }
}
