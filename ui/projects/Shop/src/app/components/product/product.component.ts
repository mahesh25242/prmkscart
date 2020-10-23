import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ShopProduct, Cart } from 'src/app/lib/interfaces';
import { ShopProductService, CartService } from 'src/app/lib/services';
import { environment } from '../../../environments/environment';
import Notiflix from "notiflix";
import { ActivatedRoute } from '@angular/router';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { AddToCartComponent } from '../add-to-cart/add-to-cart.component';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {
  products$: Observable<ShopProduct[]>;
  environment = environment;
  constructor(private shopProductService: ShopProductService,
    private cartService: CartService,
    private route: ActivatedRoute,
    public dialog: MatDialog) {
      cartService.shopKey = environment.shopKey;
    }


  addToCart(product: ShopProduct){
    let dialogRef = this.dialog.open(AddToCartComponent, {
      data: product,
    });
    /*  this.cartService.cart$.next(cart);*/
    }

  ngOnInit(): void {

    this.products$ = this.shopProductService.products;
  }

}
