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
  styleUrls: ['./categories.component.scss'],
  animations: [
    trigger(
      'enterAnimation', [
        transition(':enter', [
          style({ opacity: 0}),
          animate('500ms ease-in-out', style({ 'opacity': 1, 'max-height': '*'}))
        ]),
        transition(':leave', [
          style({ opacity: 1}),
          animate('20ms', style({ 'opacity': 0, 'max-height': '0px'}))
        ])
      ]
    )
  ]
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
