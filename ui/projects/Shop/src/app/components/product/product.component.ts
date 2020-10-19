import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ShopProduct, Cart } from 'src/app/lib/interfaces';
import { ShopProductService, CartService } from 'src/app/lib/services';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {
  products$: Observable<ShopProduct[]>;

  constructor(private shopProductService: ShopProductService,
    private cartService: CartService) {
      cartService.shopKey = environment.shopKey;
    }


  addToCart(product: ShopProduct){
      product.shop_product_selected_variant = (product.shop_product_selected_variant) ? product.shop_product_selected_variant : product.shop_product_primary_variant;
      const cart: Cart ={
        product: product,
        qty: 1,
        price: product.shop_product_selected_variant.price
      };
      this.cartService.updateCart(cart, '+').subscribe(res=> console.log(res));
    //  this.cartService.cart$.next(cart);
    }

  ngOnInit(): void {
    this.products$ = this.shopProductService.products;
  }

}
