import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ShopProductCategory } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class ShopProductCategoryService {
  private categories$: BehaviorSubject<ShopProductCategory[]> = new BehaviorSubject<ShopProductCategory[]>(null);
  constructor(private http: HttpClient) { }

  get categories(){
    return this.categories$.asObservable();
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


}
