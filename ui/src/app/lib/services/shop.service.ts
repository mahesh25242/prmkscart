import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Shop, ShopDelivery } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class ShopService {
  private shops$: BehaviorSubject<Shop[]> = new BehaviorSubject<Shop[]>(null);
  private shop$: BehaviorSubject<Shop> = new BehaviorSubject<Shop>(null);
  private deliveries$: BehaviorSubject<ShopDelivery[]> = new BehaviorSubject<ShopDelivery[]>(null);
  constructor(private http: HttpClient) { }

  get shops(){
    return this.shops$.asObservable();
  }
  get aShop(){
    return this.shop$.asObservable();
  }
  get deliveries(){
    return this.deliveries$.asObservable();
  }
  getAllShops(postData: any = null){
    return this.http.post<Shop[]>("/admin/shops", postData).pipe(map(res=>{
      this.shops$.next(res);
      return res;
    }));
  }

  saveShop(postData: any = null){
    return this.http.post<any>("/admin/shops/store", postData);
  }

  deleteShop(shopId:number = 0, postData: any = null){
    return this.http.post<any>(`/admin/shops/delete/${shopId}`, postData);
  }

  shop(shopId:number = 0){
    return this.http.get<Shop>(`/admin/shops/shop/${shopId}`).pipe(map(res=>{
      this.shop$.next(res);
      return res;
    }));
  }

  shopDeliveries(postData: any= null): Observable<ShopDelivery[]>{
    return this.http.post<ShopDelivery[]>(`/shop/deliveries`, postData).pipe(map(res=>{
      this.deliveries$.next(res);
      return res;
    }));
  }

  deleteShopDelivery(postData: any= null){
    return this.http.post<any>(`/shop/deliveries/delete`, postData);
  }

  saveShopDelivery(postData: any = null){
    return this.http.post<any>("/shop/deliveries/store", postData);
  }

  shopDetail(){
    return this.http.get<Shop>(`/shop`).pipe(tap(res=>{
      this.shop$.next(res);
    }));
  }
}
