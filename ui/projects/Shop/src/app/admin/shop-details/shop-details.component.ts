import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { mergeMap, tap } from 'rxjs/operators';
import { Shop } from 'src/app/lib/interfaces';
import { ShopService } from 'src/app/lib/services';
import Notiflix from "notiflix";

@Component({
  selector: 'app-shop-details',
  templateUrl: './shop-details.component.html',
  styleUrls: ['./shop-details.component.scss']
})
export class ShopDetailsComponent implements OnInit {
  shop$: Observable<Shop>;
  shopDetailsFrm: FormGroup;
  constructor(private shopService: ShopService,
    private formBuilder: FormBuilder) { }

  updateShop(){
    const postData = {
      name: this.f.name.value,
      email: this.f.email.value,
      phone: this.f.phone.value,
      address: this.f.address.value,
      country_id: this.f.country_id.value,
      state_id: this.f.state_id.value,
      city_id: this.f.city_id.value,
      pin: this.f.pin.value ,
      local: this.f.local.value,
    }
    this.shopService.saveShopDetail(postData).pipe(mergeMap(res=>{
      return this.shopService.shopDetail();
    })).subscribe(res=>{
      Notiflix.Notify.Success(`Successfully saved `);
    }, error=>{
      if(error.status == 422){
        for(let result in this.shopDetailsFrm.controls){
          if(error.error.errors[result]){
            this.shopDetailsFrm.controls[result].setErrors({ error: error.error.errors[result] });
          }else{
            this.shopDetailsFrm.controls[result].setErrors(null);
          }
        }
      }
    });
  }
  get f(){ return this.shopDetailsFrm.controls;}
  ngOnInit(): void {
    this.shop$ = this.shopService.aShop.pipe(tap(res=>{
      this.shopDetailsFrm.patchValue({
        name: res?.name,
        email: res?.email,
        phone: res?.phone,
        address: res?.address,
        country_id: res?.country_id,
        state_id: res?.state_id,
        city_id: res?.city_id,
        pin: res?.pin ,
        local: res?.local,
      });
    }));

    this.shopDetailsFrm = this.formBuilder.group({
      name: [null, []],
      email: [null, []],
      phone: [null, []],
      address: [null, []],
      country_id: [null, []],
      state_id: [null, []],
      city_id: [null, []],
      pin: [null, []] ,
      local: [null, []] ,
    });

  }

}
