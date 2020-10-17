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



    const formData = new FormData();
    formData.append('id', `${(this.f.id.value) ? this.f.id.value : 0}`);
    formData.append('name', (this.f.name.value) ? this.f.name.value : '');
    formData.append('description', (this.f.description.value) ? this.f.description.value : '');
    formData.append('status', `${this.f.status.value}`);
    formData.append('sortorder', `${this.f.sortorder.value}`);
    formData.append(`icon`, this.f.icon.value);

    this.saveCatSubScr = this.shopProductCategoryService.createCategory(formData).pipe(mergeMap(res=>{
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

  handleIconSelection( files: FileList) {
    this.f.icon.setValue(files.item(0));
  }

  ngOnInit(): void {

    this.createCatFrm= this.formBuilder.group({
      id: [null, []],
      name: [null, []],
      description: [null, []],
      status: [1, []],
      sortorder: [1, []],
      icon: [null, []]
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
