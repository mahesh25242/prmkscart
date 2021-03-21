import { Component, EventEmitter, Inject, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { ShopProductCategoryService } from 'src/app/lib/services/shop-product-category.service';
import Notiflix from "notiflix";
import { ShopProductCategory } from 'src/app/lib/interfaces';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { catIcon } from './cat-icons';



@Component({
  selector: 'app-create-category',
  templateUrl: './create-category.component.html',
  styleUrls: ['./create-category.component.scss']
})
export class CreateCategoryComponent implements OnInit, OnDestroy {
  createCatFrm: FormGroup;
  selected = 'option2';
  catIcon = catIcon;
  @Output() onCreation = new EventEmitter();


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

  saveCatSubScr: Subscription;
  formPathSubScr: Subscription;
  constructor(@Inject(MAT_DIALOG_DATA) public data: ShopProductCategory,
  private formBuilder: FormBuilder,
    private shopProductCategoryService: ShopProductCategoryService,
    public dialogRef: MatDialogRef<CreateCategoryComponent>) { }

  get f() { return this.createCatFrm.controls}

  saveCategory(){
    Notiflix.Loading.Arrows();



    const formData = new FormData();
    formData.append('id', `${(this.f.id.value) ? this.f.id.value : 0}`);
    formData.append('name', (this.f.name.value) ? this.f.name.value : '');
    formData.append('description', (this.f.description.value) ? this.f.description.value : '');
    formData.append('status', `${this.f.status.value}`);
    formData.append('sortorder', `${this.f.sortorder.value}`);

    formData.append(`is_maticon`, (this.f.is_maticon.value) ? `1` : `0`);
    if(this.f.is_maticon.value){
      formData.append(`icon`, (this.f.icon.value?.icon ? this.f.icon.value?.icon : ''));
    }else{
      formData.append(`icon`, this.f.icon.value);
    }

    this.saveCatSubScr = this.shopProductCategoryService.createCategory(formData).pipe(mergeMap(res=>{
      this.onCreation.emit(res.data);
      return this.shopProductCategoryService.listCategories();
    })).subscribe(res=>{
      Notiflix.Loading.Remove();
      Notiflix.Notify.Success(`Successfully saved category `);

      this.dialogRef.close();
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
      icon: [null, []],
      is_maticon: [null, []]
    });




      this.createCatFrm.patchValue({
        id: this.data?.id,
        name: this.data?.name,
        description: this.data?.description,
        status: (this.data?.status >= 0) ? this.data?.status : 1,
        sortorder: (this.data?.sortorder) ? this.data?.sortorder : 1,
        is_maticon: (this.data?.is_maticon) ? this.data?.is_maticon : 1
      });

      if(this.data?.is_maticon){
        catIcon.map(ico =>{
          if(ico.icon == this.data?.icon)
            this.f.icon.setValue(ico);
        })

      }

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
