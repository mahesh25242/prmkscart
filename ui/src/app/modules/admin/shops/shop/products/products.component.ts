import { Component, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { ShopProduct, ShopProductWithPagination } from 'src/app/lib/interfaces';
import { ShopProductService } from 'src/app/lib/services';
import Notiflix from "notiflix";
import { map, mergeMap } from 'rxjs/operators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute } from '@angular/router';
import { CreateProductComponent } from './create-product/create-product.component';



@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit, OnDestroy {

  products$: Observable<ShopProductWithPagination>;
  private product$: BehaviorSubject<ShopProduct> = new BehaviorSubject<ShopProduct>(null);
  shopKey$:Observable<any>;

  pageinationSubScr: Subscription;
  constructor(private shopProductService: ShopProductService,
    private _modalService: NgbModal,
    private route: ActivatedRoute) { }

  get product() { return this.product$.asObservable()}
  editProduct(product: ShopProduct = null){
    const activeModal = this._modalService.open(CreateProductComponent, {
      size: 'xl',
      //backdrop: true,
    });
    activeModal.componentInstance.product = product;
    activeModal.componentInstance.shopKey = this.shopKey$;

  }

  loadPage(page){
    this.pageinationSubScr =  this.route.parent.params.pipe(mergeMap(parms=>{
      return this.shopProductService.listproducts(page, {
        'shop_key': parms.id
      });
    })).subscribe();

  }

  deleteProduct(product: ShopProduct = null, shopKey: string = ''){
    Notiflix.Confirm.Show( 'delete?', `Do you want to delete ${product.name}`, 'Yes', 'No', ()=>{
      Notiflix.Loading.Arrows();
      this.shopProductService.deleteProduct(product).pipe(mergeMap(res=>{
        return this.shopProductService.listproducts(1, {
          "shop_key": shopKey
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

  ngOnInit(): void {
    this.products$ = this.shopProductService.products;
    this.shopKey$ = this.route.parent.params;
  }

  ngOnDestroy(){
    if(this.pageinationSubScr){
      this.pageinationSubScr.unsubscribe();
    }
  }
}
