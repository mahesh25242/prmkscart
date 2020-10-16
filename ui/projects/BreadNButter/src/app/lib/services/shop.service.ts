import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Shop } from 'src/app/lib/interfaces';

@Injectable({
  providedIn: 'root'
})
export class ShopService {
  private shops$: BehaviorSubject<Shop[]> = new BehaviorSubject<Shop[]>(null);
  private shop$: BehaviorSubject<Shop> = new BehaviorSubject<Shop>(null);
  constructor(private http: HttpClient) { }

  get shops(){
    return this.shops$.asObservable();
  }
  get aShop(){
    return this.shop$.asObservable();
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
}
