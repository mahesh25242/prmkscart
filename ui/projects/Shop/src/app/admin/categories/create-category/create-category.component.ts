import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { ShopProductCategoryService } from 'src/app/lib/services/shop-product-category.service';
import Notiflix from "notiflix";
import { ShopProductCategory } from 'src/app/lib/interfaces';

declare var $: any;


@Component({
  selector: 'app-create-category',
  templateUrl: './create-category.component.html',
  styleUrls: ['./create-category.component.scss']
})
export class CreateCategoryComponent implements OnInit, OnDestroy {
  createCatFrm: FormGroup;

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
  @Input() category: Observable<ShopProductCategory>;
  saveCatSubScr: Subscription;
  formPathSubScr: Subscription;
  constructor(private formBuilder: FormBuilder,
    private shopProductCategoryService: ShopProductCategoryService) { }

  get f() { return this.createCatFrm.controls}

  saveCategory(){
    Notiflix.Loading.Arrows();

    const postData = {
      id: this.f.id.value,
      name: this.f.name.value,
      description: this.f.description.value,
      status: this.f.status.value,
      sortorder: this.f.sortorder.value,
    };

    this.saveCatSubScr = this.shopProductCategoryService.createCategory(postData).pipe(mergeMap(res=>{
      return this.shopProductCategoryService.listCategories();
    })).subscribe(res=>{
      Notiflix.Loading.Remove();
      Notiflix.Notify.Success(`Successfully saved category `);
      $('#createCategory').modal('hide')
    }, error=>{
      Notiflix.Loading.Remove();
      if(error.status == 422){
        for(let result in this.createCatFrm.controls){
          if(error.error.errors[result]){
            this.createCatFrm.controls[result].setErrors({ error: error.error.errors[result] });
          }else{
            this.createCatFrm.controls[result].setErrors(null);
          }
        }
      }
    });

  }

  ngOnInit(): void {

    this.createCatFrm= this.formBuilder.group({
      id: [null, []],
      name: [null, []],
      description: [null, []],
      status: [1, []],
      sortorder: [1, []],
    });

    this.formPathSubScr = this.category.subscribe(res=>{


      this.createCatFrm.patchValue({
        id: res?.id,
        name: res?.name,
        description: res?.description,
        status: (res?.status >= 0) ? res?.status : 1,
        sortorder: (res?.sortorder) ? res?.sortorder : 1,
      });
    });

  }

  ngOnDestroy(){
    if(this.saveCatSubScr){
      this.saveCatSubScr.unsubscribe();
    }

    if(this.formPathSubScr){
      this.formPathSubScr.unsubscribe();
    }
  }
}
