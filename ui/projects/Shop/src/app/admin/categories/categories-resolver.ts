import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot  } from '@angular/router';
import { empty, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ShopProductCategoryService } from '../../../../../../src/app/lib/services';

@Injectable()
export class CategoriesResolver implements Resolve<any> {

  constructor(
    private shopProductCategoryService: ShopProductCategoryService) { }

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    return this.shopProductCategoryService.listCategories();
  }
}
