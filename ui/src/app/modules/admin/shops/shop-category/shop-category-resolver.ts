import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot  } from '@angular/router';
import { empty, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ShopCategoryService } from '../../../../lib/services';

@Injectable()
export class ShopCategoryResolver implements Resolve<any> {

  constructor(
    private shopCategoryService: ShopCategoryService) { }

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    return this.shopCategoryService.getCategories();
  }
}
