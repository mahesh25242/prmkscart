import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { ShopProductCategory } from 'src/app/lib/interfaces';
import { ShopProductCategoryService, ShopProductService } from 'src/app/lib/services';
import { environment } from '../../../environments/environment';
import * as _ from 'lodash';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit {
  environment = environment;

  categories$: Observable<ShopProductCategory[]>;
  constructor(private shopProductCategoryService: ShopProductCategoryService,
    private shopProductService: ShopProductService,
    private route: ActivatedRoute,) { }

  ngOnInit(): void {
    this.categories$ = this.shopProductCategoryService.showCategories().pipe(mergeMap(cats=>{
      return this.route.params.pipe(mergeMap(parm=>{
          if(parm?.catUrl){
            return this.shopProductService.showProducts({
              cat_url: parm?.catUrl
            }).pipe(map(products=> cats));
          }else{
            const cat:ShopProductCategory = _.first(cats);

            return this.shopProductService.showProducts({
              shop_product_category_id: cat.id
            }).pipe(map(products=> cats));
          }

      }))

    }));
  }

}
