import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ShopOrder } from 'src/app/lib/interfaces';
import { CartService } from 'src/app/lib/services';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {
  orders$: Observable<ShopOrder[]>;
  displayedColumns = ["no", "name", "status"]
  constructor(private cartService: CartService) { }

  viewOrder(shopOrder: ShopOrder = null){

  }
  ngOnInit(): void {
    this.orders$ = this.cartService.orders;
  }

}
