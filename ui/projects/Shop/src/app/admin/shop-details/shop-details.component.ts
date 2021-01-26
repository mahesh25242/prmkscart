import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { mergeMap, tap } from 'rxjs/operators';
import { City, Country, Shop, State } from 'src/app/lib/interfaces';
import { CityService, CountryService, GeneralService, ShopService, StateService } from 'src/app/lib/services';
import Notiflix from "notiflix";
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-shop-details',
  templateUrl: './shop-details.component.html',
  styleUrls: ['./shop-details.component.scss']
})
export class ShopDetailsComponent implements OnInit, OnDestroy {
  shop$: Observable<Shop>;
  shopDetailsFrm: FormGroup;
  countries$: Observable<Country[]>;
  states$: Observable<State[]>;
  cities$: Observable<City[]>;

  countrySubscription: Subscription;
  stateSubscription: Subscription;
  constructor(private shopService: ShopService,
    private formBuilder: FormBuilder,
    private countryServive: CountryService,
    private stateService: StateService,
    private cityService: CityService,
    private generalService: GeneralService) { }

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

    this.generalService.bc$.next({
      siteName: environment.siteName,
      title: 'Shop Details',
      url:'',
      backUrl: null
    });

    this.shop$ = this.shopService.aShop.pipe(tap(res=>{
      const phone = (res?.phone) ? res?.phone.slice(2): '';
      this.shopDetailsFrm.patchValue({
        name: res?.name,
        email: res?.email,
        phone: phone,
        address: res?.address,
        country_id: res?.country,
        state_id: res?.state,
        city_id: res?.city,
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

    this.countries$ = this.countryServive.countries();

    this.countrySubscription = this.f.country_id.valueChanges.subscribe(res=>{
      if(res)
        this.states$ = this.stateService.states(res.id);
    });

    this.stateSubscription = this.f.state_id.valueChanges.subscribe(res=>{
      if(res)
        this.cities$ = this.cityService.cities(res.id);
    });

  }

  ngOnDestroy(){
    if(this.countrySubscription){
      this.countrySubscription.unsubscribe();
    }

    if(this.stateSubscription){
      this.stateSubscription.unsubscribe();
    }
  }

}
