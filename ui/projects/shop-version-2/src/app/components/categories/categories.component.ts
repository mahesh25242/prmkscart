import { Component, OnInit } from '@angular/core';
import { empty, Observable, of } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { ShopProductCategory } from 'src/app/lib/interfaces';
import { ShopProductCategoryService, ShopProductService } from 'src/app/lib/services';
import { environment } from '../../../environments/environment';
import * as _ from 'lodash';
import { ActivatedRoute } from '@angular/router';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit {
  environment = environment;
  categories$: Observable<ShopProductCategory[]>;
  selectedCategory$: Observable<ShopProductCategory>;
  hideTopCat$: Observable<boolean>;
  constructor(private shopProductCategoryService: ShopProductCategoryService,
    private shopProductService: ShopProductService,
    private route: ActivatedRoute,) { }

  ngOnInit(): void {
    this.hideTopCat$ = this.shopProductCategoryService.hideTopCat;
    this.selectedCategory$ = this.shopProductCategoryService.selectedCategory;
    this.categories$ = this.shopProductCategoryService.categories;
  }

}
