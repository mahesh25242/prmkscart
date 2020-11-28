import { AfterContentChecked, AfterContentInit, AfterViewChecked, AfterViewInit, Component, DoCheck, Input, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { ShopProduct, Cart, ShopProductWithPagination } from 'src/app/lib/interfaces';
import { ShopProductService, CartService, GeneralService, ShopProductCategoryService } from 'src/app/lib/services';
import { environment } from '../../../environments/environment';
import Notiflix from "notiflix";
import { ActivatedRoute } from '@angular/router';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { AddToCartComponent } from '../add-to-cart/add-to-cart.component';
import { first } from 'lodash';
import { mergeMap, tap } from 'rxjs/operators';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit, OnDestroy {
  @Input() isSearch: boolean;
  products$: Observable<ShopProductWithPagination>;
  allProduct: ShopProduct[];

  environment = environment;
  current_page: number = 0;

  productFetchUnsbscr: Subscription;
  constructor(private shopProductService: ShopProductService,
    private cartService: CartService,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private generalService: GeneralService,
    private shopProductCategoryService: ShopProductCategoryService) {
      cartService.shopKey = environment.shopKey;
    }






    loadMore(){

      if(this.isSearch && this.current_page){

        Notiflix.Loading.Arrows();
        ++this.current_page;
        if(this.productFetchUnsbscr) this.productFetchUnsbscr.unsubscribe();
        this.productFetchUnsbscr = this.route.params.pipe(mergeMap(res=>{
          const postData = {
            q: res?.q,
            pageSize : environment.productListPerPage
          }
          return this.shopProductService.showProducts(this.current_page, postData);
        })).subscribe(res=> Notiflix.Loading.Remove(), error => Notiflix.Loading.Remove());

      }else if(this.current_page){
        Notiflix.Loading.Arrows();
        const product:ShopProduct = first(this.route.snapshot.data["product"]?.data);

        ++this.current_page;
        if(this.productFetchUnsbscr) this.productFetchUnsbscr.unsubscribe();
        this.productFetchUnsbscr = this.shopProductService.showProducts(this.current_page, {
          shop_product_category_id: product.shop_product_category_id,
          pageSize : environment.productListPerPage
        }).subscribe(res=> Notiflix.Loading.Remove(), error => Notiflix.Loading.Remove());

      }
    }

  ngOnInit(): void {
    this.shopProductService.allProduct = [];
    this.products$ = this.shopProductService.products.pipe(tap(res=>{
      this.current_page = (res.current_page && res.next_page_url) ? res.current_page : 0;
      const product:ShopProduct = first(res.data);
      if(!this.isSearch){
        this.shopProductCategoryService.selectedCategory$.next(product?.shop_product_category);
      }else{
        this.shopProductCategoryService.selectedCategory$.next(null);
      }

      if(res.data){
        res.data.map(itm =>{
          this.shopProductService.allProduct.push(itm);
        });
      }

      this.generalService.bc$.next({
        siteName: environment.siteName,
        title: `${product?.shop_product_category?.name}`,
        url:'',
        backUrl: ''
      });
      this.allProduct = this.shopProductService.allProduct;
    }));
  }


  ngOnDestroy(){
    if(this.productFetchUnsbscr){
      this.productFetchUnsbscr.unsubscribe();
    }
  }
}
