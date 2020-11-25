import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ShopOrder, ShopProduct, ShopProductWithPagination } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class ShopProductService {
  allProduct: ShopProduct[] = [];
  private products$: BehaviorSubject<ShopProductWithPagination> = new BehaviorSubject<ShopProductWithPagination>(null);

  constructor(private http: HttpClient) { }

  get products(){
    return this.products$.asObservable();
  }

  listproducts(page:number= 1, postData: any = null): Observable<ShopProductWithPagination>{
    return this.http.post<ShopProductWithPagination>(`/shop/products${(page) ? `?page=${page}` : ''}`, postData).pipe(map(res=>{
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

  changeStatus(postData: any = null): Observable<any>{
    return this.http.post<any>(`/shop/products/changeStatus`, postData);
  }

  showProducts(page:number= 1,postData: any = null): Observable<ShopProductWithPagination>{
    return this.http.post<ShopProductWithPagination>(`/shop/product/showProducts${(page) ? `?page=${page}` : ''}`, postData).pipe(map(res=>{
      this.products$.next(res);
      return res;
    }));
  }

  showProductDetails(postData: any = null): Observable<ShopProduct>{
    return this.http.post<ShopProduct>("/shop/product/showProductDetails", postData);
  }

  showOrderDetail(postData: any = null): Observable<ShopOrder>{
    return this.http.post<ShopOrder>("/shop/showOrderDetail", postData);
  }

}
