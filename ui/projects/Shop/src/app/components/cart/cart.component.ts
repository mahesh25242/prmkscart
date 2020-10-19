import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map, mergeMap, tap } from 'rxjs/operators';
import { Cart, ShopProduct } from 'src/app/lib/interfaces';
import { CartService } from 'src/app/lib/services';
import { environment } from '../../../environments/environment';

declare var $: any;

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  cart$: Observable<Cart[]>;
  total:number = 0;
  cartDetails: boolean = false;
  constructor(private cartService: CartService) {
    cartService.shopKey = environment.shopKey;
  }

  updateCart(cart: Cart, action: string='+'){
    const itm =Object.assign({}, cart);
    itm.qty = 1;
    this.cartService.updateCart(itm, action).subscribe();
  }

  showDetails(){
    $('#cartDetails').modal('show')
    this.cartDetails = !this.cartDetails;
  }

  ngOnInit(): void {
    this.cart$ = this.cartService.cart().pipe(tap(res=>{
      this.total = 0;
      res.map(itm=>{
        this.total +=itm.price;
      });
    }));
  }

}
