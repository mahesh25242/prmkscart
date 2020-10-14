import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ShopCategoryService } from 'src/app/lib/services';
import Notiflix from "notiflix";
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { map, mergeMap } from 'rxjs/operators';
import { ShopCategory } from 'src/app/lib/interfaces';

@Component({
  selector: 'app-create-shop-category',
  templateUrl: './create-shop-category.component.html',
  styleUrls: ['./create-shop-category.component.scss']
})
export class CreateShopCategoryComponent implements OnInit, OnDestroy {
  @Input() shopCategory: ShopCategory;
  createCategoryFrm: FormGroup;
  saveCategorySubScr: Subscription;
  constructor(private formBuilder: FormBuilder,
    private shopCategoryService: ShopCategoryService,
    public modal: NgbActiveModal,) { }
  get f(){ return this.createCategoryFrm.controls }
  saveCategory(){
    const postData = {
      id: this.f.id.value,
      name: this.f.name.value,
      description: this.f.description.value,
      status: this.f.status.value,
      sortorder: this.f.sortorder.value,
    };
    Notiflix.Loading.Arrows();
    this.saveCategorySubScr = this.shopCategoryService.saveCategory(postData).pipe(mergeMap(res=>{
      return this.shopCategoryService.getCategories().pipe(map(acts=>{
        return res;
      }));
    })).subscribe(res=>{
      Notiflix.Loading.Remove();
      this.modal.close();
      Notiflix.Notify.Success(`Successfully saved category `);
    }, error=>{

      if(error.status == 422){
        for(let result in this.createCategoryFrm.controls){
          if(error.error.errors[result]){
            this.createCategoryFrm.controls[result].setErrors({ error: error.error.errors[result] });
          }else{
            this.createCategoryFrm.controls[result].setErrors(null);
          }
        }
      }

      Notiflix.Loading.Remove();
    })
  }
  ngOnInit(): void {
    this.createCategoryFrm = this.formBuilder.group({
      id: [(this.shopCategory?.id ? this.shopCategory?.id : 0), []],
      name: [this.shopCategory?.name, []],
      description: [this.shopCategory?.description, []],
      status: [( this.shopCategory?.status ? this.shopCategory?.status : 1), []],
      sortorder: [(this.shopCategory?.sortorder ? this.shopCategory?.sortorder : 1), []],
    });
  }

  ngOnDestroy(){
    if(this.saveCategorySubScr){
      this.saveCategorySubScr.unsubscribe();
    }
  }
}
