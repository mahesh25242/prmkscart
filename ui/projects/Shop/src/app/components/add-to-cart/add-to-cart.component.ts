import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { find } from 'lodash';
import { Subscription } from 'rxjs';
import { Cart, ShopProduct } from 'src/app/lib/interfaces';
import { CartService } from 'src/app/lib/services';
import {environment} from '../../../environments/environment';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-add-to-cart',
  templateUrl: './add-to-cart.component.html',
  styleUrls: ['./add-to-cart.component.scss']
})
export class AddToCartComponent implements OnInit, OnDestroy {

  environment = environment;
  addToCartFrm: FormGroup;
  cartSubScr: Subscription;
  cart: Cart;
  qty: number = 1;

  constructor(@Inject(MAT_DIALOG_DATA) public data: ShopProduct,
  public dialogRef: MatDialogRef<AddToCartComponent>,
  private formBuilder: FormBuilder,
  private cartService: CartService,
  private matSnackBar: MatSnackBar,) { }

  get f(){ return  this.addToCartFrm.controls; }

  chooseVarient(){
    this.qty = 1;
    this.data.shop_product_selected_variant =  find(this.data.shop_product_variant, (spv)=> (spv.id == this.f.shop_product_variant_id.value));
  }

  updateCart(type: string  ='+'){
    switch(type){
      case '+':
        this.qty++;
      break;
      case '-':
        this.qty--;
      break;
    }

    this.qty = (this.qty<=0) ? 1 : this.qty;

  }

  addToCart(){
    this.cart ={
      product: this.data,
      qty: this.qty,
      price: (this.data.shop_product_selected_variant.price * this.qty),
      message: this.f.message.value
    };
    if(this.cartSubScr) this.cartSubScr.unsubscribe();
    this.cartSubScr = this.cartService.updateCart(this.cart, '++').subscribe(res =>{
      this.matSnackBar.open(`${this.cart.product.name} - ${this.cart.product.shop_product_selected_variant.name} ( ${this.cart.qty} ) is added`, 'close');
      window.navigator.vibrate(50);
      this.dialogRef.close(true);
    });
  }
  ngOnInit(): void {
    this.data.shop_product_selected_variant = this.data.shop_product_primary_variant;

    this.addToCartFrm = this.formBuilder.group({
      shop_product_variant_id: [this.data.shop_product_primary_variant.id, []],
      message: [null, []]
    });

  }

  ngOnDestroy(){
    if(this.cartSubScr){
      this.cartSubScr.unsubscribe();
    }
  }
}
