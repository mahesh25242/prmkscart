import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { find } from 'lodash';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ShopProduct, ShopProductWithPagination } from 'src/app/lib/interfaces';
import { CartService } from 'src/app/lib/services';
import { AddToCartComponent } from '../../add-to-cart/add-to-cart.component';

@Component({
  selector: 'app-product-item',
  templateUrl: './product-item.component.html',
  styleUrls: ['./product-item.component.scss'],
  animations: [
    trigger('openClose', [
      // ...
      transition('false <=> true', [
        animate('1s', style({ opacity: 1}))
      ]),
    ]),
  ],
})
export class ProductItemComponent implements OnInit {
  @Input() shopProduct: ShopProduct;
  product$: Observable<ShopProduct>;
  constructor(public dialog: MatDialog,
    private cartService: CartService) { }

  addToCart(product: ShopProduct){
    let dialogRef = this.dialog.open(AddToCartComponent, {
      data: product,
    });
    /*  this.cartService.cart$.next(cart);*/
    }


  ngOnInit(): void {
    this.shopProduct.incart = false;
    this.product$ = this.cartService.cart().pipe(map(res=>{
      let prod = find(res, (pdt) => {
        if((pdt.product.id == this.shopProduct.id)){
          this.shopProduct.incart = true;
          return true;
        }
      })
      return this.shopProduct;
    }))
  }


}
