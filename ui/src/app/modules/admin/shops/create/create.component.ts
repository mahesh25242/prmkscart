import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { City, Country, ShopCategory, State } from 'src/app/lib/interfaces';
import { CityService, CountryService, ShopCategoryService, ShopService, StateService } from 'src/app/lib/services';
import Notiflix from "notiflix";
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit, OnDestroy {
  createShop: FormGroup;
  countries$:Observable<Country[]>;
  states$:Observable<State[]>;
  cities$:Observable<City[]>;
  categories$:Observable<ShopCategory[]>;

  countrySubscription: Subscription;
  stateSubscription: Subscription;
  saveShopSubScr: Subscription;

  logo: File = null;
  favicon: File = null;


  constructor(private formBuilder: FormBuilder,
    private countryService: CountryService,
    private stateService: StateService,
    private cityService: CityService,
    private shopService: ShopService,
    private shopCategoryService: ShopCategoryService,
    private route: ActivatedRoute,
    private router: Router,) { }

  saveShop(){

    const postData = {
      id: this.f.id.value,
      name: this.f.name.value,
      email: this.f.email.value,
      phone: this.f.phone.value,
      address: this.f.address.value,
      country_id: (this.f.country_id.value) ? JSON.stringify(this.f.country_id.value) : '',
      state_id: (this.f.state_id.value) ? JSON.stringify(this.f.state_id.value) : '',
      city_id: (this.f.city_id.value) ? JSON.stringify(this.f.city_id.value) : '',
      pin: this.f.pin.value,
      local: this.f.local.value,
      map: this.f.map.value,
      status: this.f.status.value,
      shop_category_id: this.f.shop_category_id.value,
      shop_url: this.f.shop_url.value,
      short_name: this.f.short_name.value ?? this.f.name.value,
      base_path: this.f.base_path.value ,
      theme_color: this.f.theme_color.value,
      bg_color: this.f.bg_color.value ,
    };
    Notiflix.Loading.Arrows();

    const formData = new FormData();
    formData.append('id', postData.id);
    formData.append('name', postData.name);
    formData.append('email', postData.email);
    formData.append('phone', postData.phone);
    formData.append('address', postData.address);
    formData.append('country_id', postData.country_id);
    formData.append('state_id', postData.state_id);
    formData.append('city_id', postData.city_id);
    formData.append('pin', postData.pin);
    formData.append('local', postData.local);
    formData.append('map', postData.map);
    formData.append('status', postData.status);
    formData.append('shop_category_id', postData.shop_category_id);
    formData.append('shop_url', postData.shop_url);
    formData.append('short_name', postData.short_name);
    formData.append('base_path', postData.base_path);
    formData.append('theme_color', postData.theme_color);
    formData.append('bg_color', postData.bg_color);
    formData.append('logo', this.logo);
    formData.append('favicon', this.favicon);

    this.saveShopSubScr = this.shopService.saveShop(formData).pipe(mergeMap(res=>{
      return this.shopService.getAllShops().pipe(map(shops => res))
    })).subscribe(res=>{
      Notiflix.Notify.Success(`Successfully saved shop `);
      Notiflix.Loading.Remove();
      this.router.navigate(['admin/shops']);
    }, error=>{
      if(error.status == 422){
        for(let result in this.createShop.controls){
          if(error.error.errors[result]){
            this.createShop.controls[result].setErrors({ error: error.error.errors[result] });
          }else{
            this.createShop.controls[result].setErrors(null);
          }
        }
      }
      Notiflix.Loading.Remove();
    });
  }

  get f(){ return this.createShop.controls }

  handleLogoInput(files: FileList) {
      this.logo = files.item(0);
  }

  handleFaviconInput(files: FileList) {
    this.favicon = files.item(0);
  }


  ngOnInit(): void {

    this.createShop = this.formBuilder.group({
      id: [null, []],
      name: [null, []],
      short_name: [null, []],
      email: [null, []],
      phone: [null, []],
      address: [null, []],
      country_id: [null, []],
      state_id: [null, []],
      city_id: [null, []],
      pin: [null, []],
      local: [null, []],
      map: [null, []],
      status: [1, []],
      shop_category_id: [null, []],
      shop_url: [null, []],
      base_path: ['/', []],
      theme_color: ['#1976d2', []],
      bg_color: ['#fafafa', []],
      favicon: ['', []],
      logo: ['', []]
    });

    this.countries$ = this.countryService.countries();
    this.countrySubscription = this.f.country_id.valueChanges.subscribe(res=>{
      if(res)
        this.states$ = this.stateService.states(res.id);
    });

    this.stateSubscription = this.f.state_id.valueChanges.subscribe(res=>{
      if(res)
        this.cities$ = this.cityService.cities(res.id);
    });

    this.categories$ = this.shopCategoryService.getCategories();

    if(this.route.snapshot.data?.shop){
      this.createShop.patchValue({
        id: this.route.snapshot.data?.shop.id,
        name: this.route.snapshot.data?.shop.name,
        email: this.route.snapshot.data?.shop.email,
        phone: this.route.snapshot.data?.shop.phone,
        address: this.route.snapshot.data?.shop.address,
        country_id: this.route.snapshot.data?.shop.country,
        state_id: this.route.snapshot.data?.shop.state,
        city_id: this.route.snapshot.data?.shop.city,
        pin: this.route.snapshot.data?.shop.pin,
        local: this.route.snapshot.data?.shop.local,
        map: this.route.snapshot.data?.shop.map,
        status: this.route.snapshot.data?.shop.status,
        shop_category_id: this.route.snapshot.data?.shop.shop_category,
        shop_url: this.route.snapshot.data?.shop.shop_url,
        short_name: this.route.snapshot.data?.shop.short_name ?? this.route.snapshot.data?.shop.name,
        base_path: this.route.snapshot.data?.shop.base_path ?? '/',
        theme_color: this.route.snapshot.data?.shop.theme_color ?? '#1976d2',
        bg_color: this.route.snapshot.data?.shop.bg_color ?? '#fafafa',

      });
    }
  }

  ngOnDestroy(){
    if(this.stateSubscription){
      this.stateSubscription.unsubscribe();
    }
    if(this.countrySubscription){
      this.countrySubscription.unsubscribe();
    }
    if(this.saveShopSubScr){
      this.saveShopSubScr.unsubscribe();
    }
  }
}
