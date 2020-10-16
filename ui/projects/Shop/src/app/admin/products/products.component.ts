import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ShopProduct } from 'src/app/lib/interfaces';
import { ShopProductService } from 'src/app/lib/services';
import Notiflix from "notiflix";
import { mergeMap } from 'rxjs/internal/operators/mergeMap';
import { map } from 'rxjs/operators';

declare var $: any;


@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {

  products$: Observable<ShopProduct[]>;
  private product$: BehaviorSubject<ShopProduct> = new BehaviorSubject<ShopProduct>(null);

  constructor(private shopProductService: ShopProductService) { }

  get product() { return this.product$.asObservable()}
  editProduct(product: ShopProduct = null){
    this.product$.next(product);
    $('#createProduct').modal('show')
  }

  deleteProduct(product: ShopProduct = null){
    Notiflix.Confirm.Show( 'delete?', `Do you want to delete ${product.name}`, 'Yes', 'No', ()=>{
      Notiflix.Loading.Arrows();
      this.shopProductService.deleteProduct(product).pipe(mergeMap(res=>{
        return this.shopProductService.listproducts().pipe(map(()=>{
          return res;
        }));
      })).subscribe(()=>{
        Notiflix.Loading.Remove();
        Notiflix.Notify.Success(`${product.name} Successfully deleted `);
      }, ()=>{
        Notiflix.Loading.Remove();
        Notiflix.Notify.Failure(`unexpected error`);
      });
    }, ()=>{
      // No button callback alert('If you say so...');
    } );
  }

  ngOnInit(): void {
    this.products$ = this.shopProductService.products;
  }

}
