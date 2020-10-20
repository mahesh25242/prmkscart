import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ShopProduct } from 'src/app/lib/interfaces';
import { ShopProductService } from 'src/app/lib/services';
import Notiflix from "notiflix";
import { map, mergeMap } from 'rxjs/operators';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { CreateProductComponent } from './create-product/create-product.component';


@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {

  products$: Observable<ShopProduct[]>;
  private product$: BehaviorSubject<ShopProduct> = new BehaviorSubject<ShopProduct>(null);
  displayedColumns: string[] = ['no', 'name',  'status', 'options'];

  constructor(private shopProductService: ShopProductService,
    public dialog: MatDialog) { }

  get product() { return this.product$.asObservable()}
  editProduct(product: ShopProduct = null){

    let dialogRef = this.dialog.open(CreateProductComponent, {
      data: product,
      // height: '400px',
      // width: '600px',
    });
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
