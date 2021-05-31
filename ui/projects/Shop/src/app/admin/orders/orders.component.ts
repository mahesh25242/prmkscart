import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ShopOrder, ShopOrderWithPagination } from 'src/app/lib/interfaces';
import { CartService, GeneralService } from 'src/app/lib/services';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { OrderDetailsComponent } from './order-details/order-details.component';
import { environment } from '../../../environments/environment';
import { PageEvent } from '@angular/material/paginator';
import Notiflix from "notiflix";
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { mergeMap, tap, map } from 'rxjs/operators';


@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {
  whastAppUrl:string;
  pageEvent: PageEvent

  orders$: Observable<ShopOrderWithPagination>;
  displayedColumns = ["no", "name", "total", "delivery_location", "delivery_date" ,'created_at', "status"]
  constructor(private cartService: CartService,
    public dialog: MatDialog,
    private generalService: GeneralService,
    private breakpointObserver: BreakpointObserver) { }

  viewOrder(shopOrder: ShopOrder = null){
    const data = {
      shopOrder: shopOrder,
      pageEvent: this.pageEvent
    }
    let dialogRef = this.dialog.open(OrderDetailsComponent, {
      data: data
    });


  }

  goto(pageEvent: PageEvent){
    this.pageEvent = pageEvent;
    Notiflix.Loading.Custom();
    const postData = {
      pageSize : this.pageEvent.pageSize
    }
    this.cartService.getAllOrders((this.pageEvent.pageIndex + 1), postData).subscribe(res=>{
      Notiflix.Loading.Remove();
    }, error=>{
      Notiflix.Loading.Remove();
    });

  }
  ngOnInit(): void {
    this.generalService.bc$.next({
      siteName: environment.siteName,
      title: 'Orders',
      url:'',
      backUrl: null
    });


    this.orders$ = this.cartService.orders.pipe(mergeMap(res=>{
      return this.breakpointObserver.observe([
        Breakpoints.XSmall,
        Breakpoints.Tablet
      ]).pipe(map((bpoint)=>{
        this.whastAppUrl = `https://api.whatsapp.com/send?phone=`;
        return res;
      }));


    }));


  }

}
