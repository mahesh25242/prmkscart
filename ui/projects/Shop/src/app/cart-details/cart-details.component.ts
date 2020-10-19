import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Observable,pipe } from 'rxjs';
import { tap, } from 'rxjs/operators';
import { Cart } from 'src/app/lib/interfaces';
import { CartService } from 'src/app/lib/services';
import { environment } from '../../environments/environment';

declare var $: any;

@Component({
  selector: 'app-cart-details',
  templateUrl: './cart-details.component.html',
  styleUrls: ['./cart-details.component.scss']
})
export class CartDetailsComponent implements OnInit {
  @Output() public showDetails = new EventEmitter();
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

  closeWindow(){
    this.showDetails.emit();
    $('#cartDetails').modal('hide')
  }
  ngOnInit(): void {
    this.cart$ = this.cartService.cart().pipe(tap(res=>{
      this.total = 0;
      res.map(itm=>{
        this.total +=itm.price;
      });
      if(!this.total){
        this.closeWindow();
      }
    }));


  }


}
