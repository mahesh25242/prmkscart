import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ShopProduct } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class ShopProductService {
  private products$: BehaviorSubject<ShopProduct[]> = new BehaviorSubject<ShopProduct[]>(null);

  constructor(private http: HttpClient) { }

  get products(){
    return this.products$.asObservable();
  }

  listproducts(postData: any = null): Observable<ShopProduct[]>{
    return this.http.post<ShopProduct[]>("/shop/products", postData).pipe(map(res=>{
      this.products$.next(res);
      return res;
    }));
  }

  createProduct(postData: any = null): Observable<ShopProduct>{
    return this.http.post<ShopProduct>("/shop/products/store", postData);
  }

  deleteProduct(postData: any = null): Observable<ShopProduct>{
    return this.http.post<ShopProduct>(`/shop/products/delete`, postData);
  }

  showProducts(postData: any = null): Observable<ShopProduct[]>{
    return this.http.post<ShopProduct[]>("/shop/product/showProducts", postData).pipe(map(res=>{
      this.products$.next(res);
      return res;
    }));
  }

  showProductDetails(postData: any = null): Observable<ShopProduct>{
    return this.http.post<ShopProduct>("/shop/product/showProductDetails", postData);
  }

}
