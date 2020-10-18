import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Cart, City } from '../interfaces';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  cart$: BehaviorSubject<Cart> = new BehaviorSubject<Cart>(null);
  constructor(private http: HttpClient) { }


}
