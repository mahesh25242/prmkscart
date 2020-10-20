import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Observable,pipe } from 'rxjs';
import { tap, } from 'rxjs/operators';
import { Cart, Shop, ShopDelivery } from 'src/app/lib/interfaces';
import { CartService, ShopService } from 'src/app/lib/services';
import { environment } from '../../environments/environment';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-cart-details',
  templateUrl: './cart-details.component.html',
  styleUrls: ['./cart-details.component.scss']
})
export class CartDetailsComponent implements OnInit {
  customerFrm: FormGroup;
  @Output() public showDetails = new EventEmitter();
  cart$: Observable<Cart[]>;
  total:number = 0;

  shop$:Observable<Shop>;
  selectedLocation: ShopDelivery;

  constructor(private cartService: CartService,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<CartDetailsComponent>,
    private shopService: ShopService) {
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
    this.dialogRef.close();
  }

  get f(){ return this.customerFrm.controls; }
  ngOnInit(): void {
    this.shop$ = this.shopService.aShop;
    this.cart$ = this.cartService.cart().pipe(tap(res=>{
      this.total = 0;
      res.map(itm=>{
        this.total +=itm.price;
      });
      if(!this.total){
        this.closeWindow();
      }
    }));

    this.customerFrm = this.formBuilder.group({
      name: [null, [Validators.required]],
      note: [null, [Validators.required]],
      email: [null, []],
      phone: [null, [Validators.required]],
      address: [null, [Validators.required]],
      pin: [null, [Validators.required]],
    });
  }


}
