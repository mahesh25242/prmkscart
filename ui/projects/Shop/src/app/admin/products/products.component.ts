import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ShopProduct, ShopProductWithPagination } from 'src/app/lib/interfaces';
import { GeneralService, ShopProductService } from 'src/app/lib/services';
import Notiflix from "notiflix";
import { map, mergeMap } from 'rxjs/operators';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { CreateProductComponent } from './create-product/create-product.component';
import { environment } from '../../../environments/environment';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {
  pageEvent: PageEvent;
  products$: Observable<ShopProductWithPagination>;
  private product$: BehaviorSubject<ShopProduct> = new BehaviorSubject<ShopProduct>(null);
  displayedColumns: string[] = ['no', 'name', 'category',  'status', 'options'];

  constructor(private shopProductService: ShopProductService,
    public dialog: MatDialog,
    private generalService: GeneralService) { }

  get product() { return this.product$.asObservable()}
  editProduct(product: ShopProduct = null){
    let dialogRef = this.dialog.open(CreateProductComponent, {
      data: { product : product , pageEvent: this.pageEvent},
      // height: '400px',
      // width: '600px',
    });
  }

  changeStatus(cat: ShopProduct = null){
    Notiflix.Confirm.Show( 'Change Status?', `Do you want to change ${cat.name} status?`, 'Yes', 'No', ()=>{
      Notiflix.Loading.Arrows();
      this.shopProductService.changeStatus(cat).pipe(mergeMap(res=>{
        const page = (this.pageEvent?.pageIndex) ? (this.pageEvent?.pageIndex + 1) : 1;
        return this.shopProductService.listproducts(page, {
          pageSize: (this.pageEvent?.pageSize) ? this.pageEvent?.pageSize :10
        }).pipe(map(cats=>{
          return res;
        }));
      })).subscribe(res=>{
        Notiflix.Loading.Remove();
        Notiflix.Notify.Success(`${cat.name} Successfully deleted `);
      }, error=>{
        console.log(error)
        Notiflix.Loading.Remove();
        Notiflix.Notify.Failure(`unexpected error`);
      });
    }, ()=>{
      // No button callback alert('If you say so...');
    } );
  }


  deleteProduct(product: ShopProduct = null){
    Notiflix.Confirm.Show( 'delete?', `Do you want to delete ${product.name}`, 'Yes', 'No', ()=>{
      Notiflix.Loading.Arrows();
      this.shopProductService.deleteProduct(product).pipe(mergeMap(res=>{
        return this.shopProductService.listproducts((this.pageEvent.pageIndex+1), {
          pageSize: this.pageEvent.pageSize
        }).pipe(map(()=>{
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

  goto(pageEvent: PageEvent){
    Notiflix.Loading.Arrows();
    this.pageEvent = pageEvent;
    const postData = {
      pageSize : this.pageEvent.pageSize
    }
    this.shopProductService.listproducts((this.pageEvent.pageIndex + 1), postData).subscribe(res=>{
      Notiflix.Loading.Remove();
    }, error=>{
      Notiflix.Loading.Remove();
    });

  }

  ngOnInit(): void {

    this.generalService.bc$.next({
      siteName: environment.siteName,
      title: 'Products',
      url:'',
      backUrl: null
    });

    this.products$ = this.shopProductService.products;
  }

}
