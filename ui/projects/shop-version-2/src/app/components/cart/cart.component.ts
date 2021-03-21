import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map, mergeMap, tap } from 'rxjs/operators';
import { Cart, ShopProduct } from 'src/app/lib/interfaces';
import { CartService } from 'src/app/lib/services';
import { environment } from '../../../environments/environment';


@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  hideCartComponent$: Observable<boolean>;
  cart$: Observable<Cart[]>;
  total:number = 0;
  cartDetails: boolean = false;
  isChanged = true;

  constructor(private cartService: CartService) {
    cartService.shopKey = environment.shopKey;
  }




  updateCart(cart: Cart, action: string='+'){
    const itm =Object.assign({}, cart);
    itm.qty = 1;
    this.cartService.updateCart(itm, action).subscribe();
  }


  ngOnInit(): void {
    this.hideCartComponent$ = this.cartService.hideCartComponent$.asObservable();
    let anyChange = 0;
    this.cart$ = this.cartService.cart().pipe(tap(res=>{
      this.total = 0;

      res.map(itm=>{
        this.total +=itm.price;
      });


      if(anyChange != this.total){
        if(anyChange){
          this.isChanged = false;
          setTimeout(() => { this.isChanged = true}, 1000)
        }

        anyChange = this.total;

      }

    }));
  }

}
