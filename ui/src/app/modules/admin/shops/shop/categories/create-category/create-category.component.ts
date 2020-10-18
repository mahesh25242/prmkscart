import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { ShopProductCategoryService } from 'src/app/lib/services/shop-product-category.service';
import Notiflix from "notiflix";
import { ShopProductCategory } from 'src/app/lib/interfaces';
import { ActivatedRoute } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';




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
  @Input() category: ShopProductCategory;
  @Input() shopKey: Observable<any>;
  saveCatSubScr: Subscription;
  formPathSubScr: Subscription;
  constructor(private formBuilder: FormBuilder,
    private shopProductCategoryService: ShopProductCategoryService,
    public modal: NgbActiveModal,
    ) { }

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


    this.saveCatSubScr = this.shopKey.pipe(mergeMap(parm =>{
      formData.append(`shop_key`, parm.id);
      return this.shopProductCategoryService.createCategory(formData).pipe(mergeMap(res=>{
        return this.shopProductCategoryService.listCategories({
          "shop_key": parm.id
        });
      }));
    })).subscribe(res=>{
      Notiflix.Loading.Remove();
      this.modal.close();
      Notiflix.Notify.Success(`Successfully saved category `);

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


    this.createCatFrm.patchValue({
      id: this.category?.id,
      name: this.category?.name,
      description: this.category?.description,
      status: (this.category?.status >= 0) ? this.category?.status : 1,
      sortorder: (this.category?.sortorder) ? this.category?.sortorder : 1,
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
