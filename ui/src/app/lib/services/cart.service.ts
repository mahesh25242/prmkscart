import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Cart, City, ShopOrder } from '../interfaces';
import { BehaviorSubject, empty, from, Observable, of, throwError } from 'rxjs';
import { combineAll, concatAll, map, mergeAll, tap, toArray } from 'rxjs/operators';
import { compact } from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  cart$: BehaviorSubject<Cart[]> = new BehaviorSubject<Cart[]>(null);
  private orders$: BehaviorSubject<ShopOrder[]> = new BehaviorSubject<ShopOrder[]>(null);
  private isUpdated$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  shopKey: string = null;
  constructor(private http: HttpClient) { }

  get isUpdated(){
    return this.isUpdated$.asObservable();
  }
  get orders(){
    return this.orders$.asObservable();
  }

  private getCart(){
    try {
      if(this.shopKey){
        const cart = localStorage.getItem(`${this.shopKey}-cart`);
        return (cart) ?  JSON.parse(cart) : [];
      }else{
        throw 'shop Key not exists';
      }
    } catch (error) {
      console.error(error)
    }
  }

  cart(): Observable<Cart[]>{
    return  this.isUpdated.pipe(map(res=>{
      return this.getCart();
    }));
  }

  updateCart(item: Cart = null, action: string='+'){

    if(!this.shopKey){
      return throwError('shop Key not exists');
    }
    if(item === null){
      return throwError('item not found');
    }

    if(item.qty < 0){
      return throwError('invalid quantity');
    }

    let cart: Cart[] = this.getCart();

    let cartUpdated= false;
    if(!cart.length && action == '+'){
      cart = [...[item]];
      localStorage.setItem(`${this.shopKey}-cart`, JSON.stringify(cart));
      this.isUpdated$.next(true);
      return empty();
    }else{
      return from(cart).pipe(map(cItem =>{
        if(action =='+' && cItem.product.id == item.product.id
          && cItem.product.shop_product_selected_variant.id == item.product.shop_product_selected_variant.id){
          cItem.qty += item.qty;
          cartUpdated = true;

        }else if(action =='-' && cItem.product.id == item.product.id
          && cItem.product.shop_product_selected_variant.id == item.product.shop_product_selected_variant.id){
          cItem.qty -= item.qty;
          cartUpdated = true;
        }
        if(cItem.qty >0){
          cItem.price = (cItem.qty * cItem.product.shop_product_selected_variant.price);
          return cItem;
        }
      }), toArray(), tap(cartArr=> {
        cartArr = compact(cartArr);
        if(!cartUpdated && action =='+'){
          cartArr.push(item);
          cartUpdated = true;
        }
        localStorage.setItem(`${this.shopKey}-cart`, JSON.stringify(cartArr));
        if(cartUpdated)
          this.isUpdated$.next(true);
      }))
    }


  }

  createOrder(postData:any = null){
    return this.http.post<City[]>(`/shop/createOrder`, postData);
  }

  getAllOrders(postData:any = null){
    return this.http.post<ShopOrder[]>(`/shop/orders`, postData).pipe(tap(res=>{
      this.orders$.next(res);
    }));
  }

}
