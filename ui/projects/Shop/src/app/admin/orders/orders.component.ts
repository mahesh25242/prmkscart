import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ShopOrder, ShopOrderWithPagination } from 'src/app/lib/interfaces';
import { CartService, GeneralService } from 'src/app/lib/services';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { OrderDetailsComponent } from './order-details/order-details.component';
import { environment } from '../../../environments/environment';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {

  pageEvent: PageEvent

  orders$: Observable<ShopOrderWithPagination>;
  displayedColumns = ["no", "name", "total", "delivery_location", "delivery_date" ,'created_at', "status"]
  constructor(private cartService: CartService,
    public dialog: MatDialog,
    private generalService: GeneralService) { }

  viewOrder(shopOrder: ShopOrder = null){
    let dialogRef = this.dialog.open(OrderDetailsComponent, {
      data: shopOrder
    });


  }

  goto(pageEvent: PageEvent){
    this.pageEvent = pageEvent;

    const postData = {
      pageSize : this.pageEvent.pageSize
    }
    this.cartService.getAllOrders((this.pageEvent.pageIndex + 1), postData).subscribe();

  }
  ngOnInit(): void {
    this.generalService.bc$.next({
      siteName: environment.siteName,
      title: 'Orders',
      url:'',
      backUrl: null
    });


    this.orders$ = this.cartService.orders;
  }

}
