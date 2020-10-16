import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { ShopProductService, ShopProductCategoryService } from 'src/app/lib/services';
import Notiflix from "notiflix";
import { ShopProduct, ShopProductCategory } from 'src/app/lib/interfaces';
import { faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';

declare var $: any;


@Component({
  selector: 'app-create-product',
  templateUrl: './create-product.component.html',
  styleUrls: ['./create-product.component.scss']
})
export class CreateProductComponent implements OnInit, OnDestroy {
  faPlus =faPlus ;
  faTrash = faTrash;
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

  get varients() {
    return this.createProductFrm.get('varients') as FormArray;
 }

  saveProduct(){
    Notiflix.Loading.Arrows();

    const formData = new FormData();

    this.varients.controls.map((res: FormGroup, i) =>{
      formData.append(`variants[${i}][id]`, `${(res.controls.id.value) ? res.controls.id.value : 0}`);
      formData.append(`variants[${i}][status]`, `${(res.controls.status.value) ? res.controls.status.value : ''}`);
      formData.append(`variants[${i}][name]`, `${(res.controls.name.value) ? res.controls.name.value : ''}`);
      formData.append(`variants[${i}][shop_product_id]`, `${(res.controls.shop_product_id.value) ? res.controls.shop_product_id.value : 0}`);
      formData.append(`variants[${i}][actual_price]`, `${(res.controls.actual_price.value) ? res.controls.actual_price.value : 0}`);
      formData.append(`variants[${i}][price]`, `${(res.controls.price.value) ? res.controls.price.value : 0}`);
      formData.append(`variants[${i}][sortorder]`, `${(res.controls.sortorder.value) ? res.controls.sortorder.value : 0}`);
      formData.append(`variants[${i}][image]`, res.controls.image.value);

    });


    formData.append('id', `${this.f.id.value}`);
    formData.append('name', this.f.name.value);
    formData.append('description', this.f.description.value);
    formData.append('status', this.f.status.value);
    formData.append('sortorder', this.f.sortorder.value);
    formData.append('shop_product_category_id', this.f.shop_product_category_id.value);



    this.saveProdSubScr = this.shopProductService.createProduct(formData).pipe(mergeMap(res=>{
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

  handleImageSelection(stat:FormGroup, files: FileList) {
    stat.controls.image.setValue(files.item(0));
  }

  addVarient(stat: FormGroup){
    let validation = true;
    if(!stat.controls.name.value){
      validation = false;
      stat.controls.name.setErrors({"error": 'Varient name is requires'})
    }
    if(!stat.controls.price.value && stat.controls.price.value !== 0){
      validation = false;
      stat.controls.name.setErrors({"error": 'Varient name is requires'})
    }

    if(stat.controls.actual_price.value && (stat.controls.actual_price.value < stat.controls.price.value)){
      validation = false;
      stat.controls.price.setErrors({"error": 'Sale price is greater than actual price'})
    }
    if(validation){
      this.varients.push(this.formBuilder.group({
        id: new FormControl(0),
        status: new FormControl(null),
        name: new FormControl(null),
        shop_product_id: new FormControl(0),
        actual_price: new FormControl(0),
        price: new FormControl(0),
        sortorder: new FormControl(null),
        image: new FormControl(null)
      }));
    }
  }
  removeVarient(i){
    this.varients.removeAt(i);
  }

  ngOnInit(): void {

    this.createProductFrm= this.formBuilder.group({
      id: [0, []],
      name: [null, []],
      description: [null, []],
      status: [1, []],
      sortorder: [1, []],
      shop_product_category_id: [null, []],
      varients:this.formBuilder.array([]),
    });

    this.categories$ = this.shopProductCategoryService.listCategories({
      status: 1
    });

    this.varients.controls = [];

    this.varients.push(this.formBuilder.group({
      id: new FormControl(0),
      status: new FormControl(null),
      name: new FormControl(null),
      shop_product_id: new FormControl(0),
      actual_price: new FormControl(0),
      price: new FormControl(0),
      sortorder: new FormControl(null),
      image: new FormControl(null)
    }));

    this.formPathSubScr = this.product.subscribe(res=>{
      this.createProductFrm.patchValue({
        id: (res?.id) ? res?.id : 0,
        name: (res?.name) ? res?.name : '',
        description: (res?.description) ? res?.description : '',
        status: (res?.status >= 0) ? res?.status : 1,
        sortorder: (res?.sortorder) ? res?.sortorder : 1,
        shop_product_category_id: (res?.shop_product_category?.id) ? res?.shop_product_category?.id : null,
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
