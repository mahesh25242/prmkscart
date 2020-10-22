import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ShopOrderWithPagination } from 'src/app/lib/interfaces';
import { CartService } from 'src/app/lib/services';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {
  orders$: Observable<ShopOrderWithPagination>;
  displayedColumns = ["no", "name", "total", "delivery_location" ,'created_at', "status"]
  constructor(private cartService: CartService) { }

  viewOrder(shopOrder: ShopOrderWithPagination = null){

  }
  ngOnInit(): void {
    this.orders$ = this.cartService.orders;
  }

}
