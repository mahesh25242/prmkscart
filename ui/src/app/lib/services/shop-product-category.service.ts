import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { ShopProductCategory } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class ShopProductCategoryService {
  private categories$: BehaviorSubject<ShopProductCategory[]> = new BehaviorSubject<ShopProductCategory[]>(null);
  isCatExistsInAddressBar$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);

  constructor(private http: HttpClient) { }

  get categories(){
    return this.categories$.asObservable();
  }

  get isCatExistsInAddressBar(){
    return this.isCatExistsInAddressBar$.asObservable();
  }

  listCategories(postData: any = null): Observable<ShopProductCategory[]>{
    return this.http.post<ShopProductCategory[]>("/shop/products/categories", postData).pipe(map(res=>{
      this.categories$.next(res);
      return res;
    }));
  }

  createCategory(postData: any = null): Observable<ShopProductCategory>{
    return this.http.post<ShopProductCategory>("/shop/products/categories/store", postData);
  }

  deleteCategory(postData: any = null): Observable<ShopProductCategory>{
    return this.http.post<ShopProductCategory>(`/shop/products/categories/delete`, postData);
  }


  showCategories(){
    return this.http.get<ShopProductCategory[]>("/shop/product/showCategories").pipe(tap(res=>{
      this.categories$.next(res);
    }));
  }
}
