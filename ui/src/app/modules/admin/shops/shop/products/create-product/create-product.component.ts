import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { ShopProductService, ShopProductCategoryService } from 'src/app/lib/services';
import Notiflix from "notiflix";
import { ShopProduct, ShopProductCategory } from 'src/app/lib/interfaces';
import { faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { environment } from '../../../../../../../environments/environment';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';



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
  varientTypes = [
    {
      name:'Any',
      id: 0
    },
    {
      name:'Veg',
      id: 1
    },
    {
      name:'Non Veg',
      id: 1
    }
  ];
  categories$: Observable<ShopProductCategory[]>;
  @Input() product: ShopProduct;
  @Input() shopKey: Observable<any>;
  saveProdSubScr: Subscription;
  formPathSubScr: Subscription;
  constructor(private formBuilder: FormBuilder,
    private shopProductService: ShopProductService,
    private shopProductCategoryService: ShopProductCategoryService,
    public modal: NgbActiveModal,
    ) { }

  get f() { return this.createProductFrm.controls }

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
      formData.append(`variants[${i}][description]`, `${(res.controls.description.value) ? res.controls.description.value : ''}`);
      formData.append(`variants[${i}][is_primary]`, `${(res.controls.is_primary.value) ? 1 : 0}`);
      formData.append(`variants[${i}][type]`, `${(res.controls.type.value) ?  JSON.stringify(res.controls.type.value): ''}`);
      formData.append(`variants[${i}][shop_product_id]`, `${(res.controls.shop_product_id.value) ? res.controls.shop_product_id.value : 0}`);
      formData.append(`variants[${i}][actual_price]`, `${(res.controls.actual_price.value) ? res.controls.actual_price.value : 0}`);
      formData.append(`variants[${i}][price]`, `${(res.controls.price.value) ? res.controls.price.value : 0}`);
      formData.append(`variants[${i}][sortorder]`, `${(res.controls.sortorder.value) ? res.controls.sortorder.value : 0}`);
      formData.append(`variants[${i}][image]`, res.controls.image.value);

    });


    formData.append('id', `${this.f.id.value}`);
    formData.append('name', this.f.name.value);
    formData.append('description', this.f.description.value);
    formData.append('status', (this.f.status.value) ? this.f.status.value : '');
    formData.append('sortorder', (this.f.sortorder.value) ? this.f.sortorder.value : 0);
    formData.append('shop_product_category_id', JSON.stringify(this.f.shop_product_category_id.value));



    this.saveProdSubScr = this.shopKey.pipe(mergeMap(parm=>{
      formData.append(`shop_key`, parm.id);
      return this.shopProductService.createProduct(formData).pipe(mergeMap(res=>{
        return this.shopProductService.listproducts(1, {
          shop_key: parm.id
        });
      }))
    })).subscribe(res=>{
      Notiflix.Loading.Remove();
      Notiflix.Notify.Success(`Successfully saved product `);
      this.modal.close();
    }, error=>{
      Notiflix.Loading.Remove();
      if(error.status == 422){
        for(let result in this.createProductFrm.controls){
          if(result == 'varients'){
            for(let varient in (this.createProductFrm.controls['varients'] as FormArray).controls){
              for(let variantFrm in ((this.createProductFrm.controls['varients'] as FormArray).controls[varient] as FormGroup).controls){
                if(error.error.errors[`variants.${varient}.${variantFrm}`]){
                  ((this.createProductFrm.controls['varients'] as FormArray).controls[varient] as FormGroup).controls[variantFrm].setErrors({ error: error.error.errors[`variants.${varient}.${variantFrm}`] });
                }else{
                  ((this.createProductFrm.controls['varients'] as FormArray).controls[varient] as FormGroup).controls[variantFrm].setErrors(null);
                }

              }
            }


          }

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
      stat.controls.name.setErrors({"error": 'The variant name field is required'})
    }
    if(!stat.controls.price.value && stat.controls.price.value !== 0){
      validation = false;
      stat.controls.name.setErrors({"error": 'The price field is required'})
    }

    if(stat.controls.actual_price.value && (stat.controls.actual_price.value < stat.controls.price.value)){
      validation = false;
      stat.controls.price.setErrors({"error": 'Sale price is greater than actual price'})
    }
    if(validation){
      this.varients.push(this.formBuilder.group(this.varientFormBuild()));
    }
  }
  removeVarient(i){
    this.varients.removeAt(i);
  }

  varientFormBuild(vrnt=null, img=null){
      return {
        id: new FormControl((vrnt?.id ? vrnt?.id : 0)),
        status: new FormControl((vrnt?.status ? vrnt?.status : 1)),
        name: new FormControl((vrnt?.name ? vrnt?.name : '')),
        description: new FormControl((vrnt?.description ? vrnt?.description : '')),
        is_primary: new FormControl((vrnt?.is_primary ? vrnt?.is_primary : 0)),
        type: new FormControl((vrnt?.type ? vrnt?.type : { name:'Any', id: 0 })),
        shop_product_id: new FormControl((vrnt?.shop_product_id ? vrnt?.shop_product_id : 0)),
        actual_price: new FormControl((vrnt?.actual_price ? vrnt?.actual_price : 0)),
        price: new FormControl((vrnt?.price ? vrnt?.price : 0)),
        sortorder: new FormControl((vrnt?.sortorder ? vrnt?.sortorder : 0)),
        image: new FormControl(null),
        currImage: new FormControl(img)
      }
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

    this.categories$ = this.shopKey.pipe(mergeMap(parm=>{
      return this.shopProductCategoryService.listCategories({
        status: 1,
        shop_key: parm.id
      })
    }));




    this.shopKey.subscribe(res=>{
      if(res?.id){
        this.varients.controls = [];
        this.createProductFrm.patchValue({
          id: (this.product?.id) ? this.product?.id : 0,
          name: (this.product?.name) ? this.product?.name : '',
          description: (this.product?.description) ? this.product?.description : '',
          status: (this.product?.status >= 0) ? this.product?.status : 1,
          sortorder: (this.product?.sortorder) ? this.product?.sortorder : 1,
          shop_product_category_id: (this.product?.shop_product_category?.id) ? this.product?.shop_product_category : null,
        });
        if(this.product?.shop_product_variant){
          this.product.shop_product_variant.map(vrnt =>{
            let img=null;
            if(vrnt?.shop_product_image?.image)
              img = `${environment.siteAddress}/assets/shop/${res?.id}/products/${vrnt.shop_product_image.image}`;
            this.varients.push(this.formBuilder.group(this.varientFormBuild(vrnt, img)));
          });
          // this.varients.patchValue({
          //   id: res.shop_product_variant?.
          // });
        }else{
          this.varients.controls = [];
          this.varients.push(this.formBuilder.group(this.varientFormBuild()));
        }
      }


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
