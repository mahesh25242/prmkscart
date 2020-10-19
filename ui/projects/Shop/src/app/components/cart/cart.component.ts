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
  cart$: Observable<Cart[]>;
  total:number = 0;

  constructor(private cartService: CartService) {
    cartService.shopKey = environment.shopKey;
  }

  updateCart(cart: Cart, action: string='+'){
    const itm =Object.assign({}, cart);
    itm.qty = 1;
    this.cartService.updateCart(itm, action).subscribe();
  }

  sendToShop(){
    let txt = `%0a‎ New Order`;
    txt += `%0a‎ Order Number: ${encodeURIComponent(`#45`)}`;
    txt += `%0a‎ Product: Cake `;
    txt += `%0a‎ Quantity: 1Kg `;
    txt += `%0a‎ Price: 200 `;
    txt += `%0a‎ ============== `;


    txt += `%0a‎ Product: Cake `;
    txt += `%0a‎ Quantity: 1Kg `;
    txt += `%0a‎ Price: 200 `;
    txt += `%0a‎ ============== `;


    txt += `%0a‎ Product: Cake `;
    txt += `%0a‎ Quantity: 1Kg `;
    txt += `%0a‎ Price: 200 `;
    txt += `%0a‎ ============== `;



    txt += `%0a‎ Product: Cake `;
    txt += `%0a‎ Quantity: 1Kg `;
    txt += `%0a‎ Price: 200 `;
    txt += `%0a‎ ============== `;



    txt += `%0a‎ Product: Cake `;
    txt += `%0a‎ Quantity: 1Kg `;
    txt += `%0a‎ Price: 200 `;
    txt += `%0a‎ ============== `;


    txt += `%0a‎ Product: Cake `;
    txt += `%0a‎ Quantity: 1Kg `;
    txt += `%0a‎ Price: 200 `;
    txt += `%0a‎ ============== `;


    txt += `%0a‎ Total: 20000 %0a`;
    window.location.href = `https://wa.me/919995453566?text=${txt}`;

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
