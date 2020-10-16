import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { ShopCategory } from 'src/app/lib/interfaces';

@Injectable({
  providedIn: 'root'
})
export class ShopCategoryService {
  private categories$: BehaviorSubject<ShopCategory[]> = new BehaviorSubject<ShopCategory[]>(null);
  constructor(private http: HttpClient) { }

  get shopCategories(){
    return this.categories$.asObservable();
  }
  getCategories(postData: any = null){
    return this.http.post<ShopCategory[]>("/admin/shops/categories", postData).pipe(map(res=>{
      this.categories$.next(res);
      return res;
    }));
  }

  saveCategory(postData: any = null){
    return this.http.post<any>("/admin/shops/categories/store", postData);
  }

  deleteCategory(catid:number = 0, postData: any = null){
    return this.http.post<any>(`/admin/shops/categories/delete/${catid}`, postData);
  }
}
