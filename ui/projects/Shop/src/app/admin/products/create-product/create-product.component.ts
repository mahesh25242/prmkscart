import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { ShopProductService, ShopProductCategoryService } from 'src/app/lib/services';
import Notiflix from "notiflix";
import { ShopProduct, ShopProductCategory } from 'src/app/lib/interfaces';

declare var $: any;


@Component({
  selector: 'app-create-product',
  templateUrl: './create-product.component.html',
  styleUrls: ['./create-product.component.scss']
})
export class CreateProductComponent implements OnInit, OnDestroy {
  createProductFrm: FormGroup;
  statuses = [
    {
      name:'Active',
      id: 1
    },
    {
      name:'In-Active',
      id: 0
    }
  ];
  categories$: Observable<ShopProductCategory[]>;
  @Input() product: Observable<ShopProduct>;
  saveProdSubScr: Subscription;
  formPathSubScr: Subscription;
  constructor(private formBuilder: FormBuilder,
    private shopProductService: ShopProductService,
    private shopProductCategoryService: ShopProductCategoryService,
    ) { }

  get f() { return this.createProductFrm.controls}

  saveProduct(){
    Notiflix.Loading.Arrows();

    const postData = {
      id: this.f.id.value,
      name: this.f.name.value,
      description: this.f.description.value,
      status: this.f.status.value,
      sortorder: this.f.sortorder.value,
      shop_product_category_id: this.f.shop_product_category_id.value,
    };

    this.saveProdSubScr = this.shopProductService.createProduct(postData).pipe(mergeMap(res=>{
      return this.shopProductService.listproducts();
    })).subscribe(res=>{
      Notiflix.Loading.Remove();
      Notiflix.Notify.Success(`Successfully saved product `);
      $('#createProduct').modal('hide')
    }, error=>{
      Notiflix.Loading.Remove();
      if(error.status == 422){
        for(let result in this.createProductFrm.controls){
          if(error.error.errors[result]){
            this.createProductFrm.controls[result].setErrors({ error: error.error.errors[result] });
          }else{
            this.createProductFrm.controls[result].setErrors(null);
          }
        }
      }
    });

  }

  ngOnInit(): void {

    this.createProductFrm= this.formBuilder.group({
      id: [null, []],
      name: [null, []],
      description: [null, []],
      status: [1, []],
      sortorder: [1, []],
      shop_product_category_id: [null, []]
    });

    this.categories$ = this.shopProductCategoryService.listCategories({
      status: 1
    });


    this.formPathSubScr = this.product.subscribe(res=>{


      this.createProductFrm.patchValue({
        id: res?.id,
        name: res?.name,
        description: res?.description,
        status: (res?.status >= 0) ? res?.status : 1,
        sortorder: (res?.sortorder) ? res?.sortorder : 1,
        shop_product_category_id: (res?.shop_product_category.id) ? res?.shop_product_category.id : null,
      });
    });

  }

  ngOnDestroy(){
    if(this.saveProdSubScr){
      this.saveProdSubScr.unsubscribe();
    }
    if(this.formPathSubScr){
      this.formPathSubScr.unsubscribe();
    }
  }
}
