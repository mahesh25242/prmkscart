import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Cart } from 'src/app/lib/interfaces';
import { CartService } from 'src/app/lib/services';
import { environment } from '../../../environments/environment';
@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  cart$: Observable<Cart[]>;
  constructor(private cartService: CartService) { }

  ngOnInit(): void {

    this.cartService.cart$.asObservable().subscribe(crt =>{

      const cart = localStorage.getItem(`${environment.shopKey}-cart`);
      let isFound: boolean = false;
      if(cart){
        const cartArr: Cart[] = JSON.parse(cart);

        cartArr.map(item =>{
          if(item && crt && item?.product?.id == crt?.product?.id){
            isFound = true;
            item.qty += crt.qty;
          }
        });
        if(!isFound){
          const cartArr: Cart[] = [crt];
        }
        localStorage.removeItem(`${environment.shopKey}-cart`);
        localStorage.setItem(`${environment.shopKey}-cart`,JSON.stringify(cartArr));
      }else if(crt){
        const cartArr: Cart[] = [crt];
        localStorage.setItem(`${environment.shopKey}-cart`,JSON.stringify(cartArr));
      }


    })
  }

}
