import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { ShopProductCategory } from 'src/app/lib/interfaces';
import { ShopProductCategoryService } from 'src/app/lib/services';
import { environment } from '../../../environments/environment';
import * as _ from 'lodash';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit {
  environment = environment;

  categories$: Observable<ShopProductCategory[]>;
  constructor(private shopProductCategoryService: ShopProductCategoryService) { }

  ngOnInit(): void {
    this.categories$ = this.shopProductCategoryService.showCategories().pipe(mergeMap(cats=>{
      const cat:ShopProductCategory = _.first(cats);
      console.log(cat)
      return of(cats);
    }));
  }

}
