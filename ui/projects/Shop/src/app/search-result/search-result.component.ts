import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { ShopProduct } from 'src/app/lib/interfaces';
import { ShopProductService } from 'src/app/lib/services';
import { AddToCartComponent } from '../components/add-to-cart/add-to-cart.component';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-search-result',
  templateUrl: './search-result.component.html',
  styleUrls: ['./search-result.component.scss']
})
export class SearchResultComponent implements OnInit {
  environment =environment;
  products$: Observable<ShopProduct[]>;
  constructor(private shopProductService: ShopProductService,
    private route: ActivatedRoute,
    public dialog: MatDialog,) { }

    addToCart(product: ShopProduct){
      let dialogRef = this.dialog.open(AddToCartComponent, {
        data: product,
      });
      /*  this.cartService.cart$.next(cart);*/
      }

  ngOnInit(): void {
    this.products$ = this.route.params.pipe(mergeMap(res=>{
      const postData = {
        q: res?.q
      }
      return this.shopProductService.showProducts(postData);
    }));
  }

}
