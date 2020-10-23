import { Component, OnInit } from '@angular/core';
import { empty, Observable, of } from 'rxjs';
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
  isCatExistsInAddressBar$: Observable<boolean>;
  categories$: Observable<ShopProductCategory[]>;
  constructor(private shopProductCategoryService: ShopProductCategoryService,
    private shopProductService: ShopProductService,
    private route: ActivatedRoute,) { }

  ngOnInit(): void {
    this.isCatExistsInAddressBar$ = this.shopProductCategoryService.isCatExistsInAddressBar;

    this.categories$ = this.shopProductCategoryService.showCategories().pipe(mergeMap(cats=>{
      return this.route.parent.params.pipe(mergeMap(parm=>{
          if(!parm?.catUrl){
            const cat:ShopProductCategory = _.first(cats);
            if(cat){
              return this.shopProductService.showProducts({
                shop_product_category_id: cat.id
              }).pipe(map(products=> cats));
            }else{
              return empty();
            }
          }

      }))

    }));
  }

}
