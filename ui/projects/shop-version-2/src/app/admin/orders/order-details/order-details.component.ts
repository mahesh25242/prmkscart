import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import Notiflix from "notiflix";
import { Subscription } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { ShopOrder } from 'src/app/lib/interfaces';
import { CartService } from 'src/app/lib/services';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.scss']
})
export class OrderDetailsComponent implements OnInit, OnDestroy {
  displayedColumns = ["no", "name", "qty", "message", "price"];
  mapUrl: string = null;
  status: number;
  whastAppUrl: string = null
  breakPointSubscr: Subscription;
  constructor(@Inject(MAT_DIALOG_DATA) public data: ShopOrder,
  public dialogRef: MatDialogRef<OrderDetailsComponent>,
  private cartService: CartService,
  private breakpointObserver: BreakpointObserver,) { }

  changeStatus(){
    let msg: { t: string, m: string, s: string} = { t : '', m: '', s : ''};

    switch(this.status){
      case 1:
        msg.t = 'Set as orderd';
        msg.m = 'Do you want to set as ordered';
        msg.s = 'Successfully set as ordered';
      break;
      case 2:
        msg.t = 'Set as processing';
        msg.m = 'Do you want to set as processing';
        msg.s = 'Successfully set as processing';
      break;
      case 3:
        msg.t = 'Set as out for delivery';
        msg.m = 'Do you want to set as out for delivery';
        msg.s = 'Successfully set as out for delivery';
      break;
      case 4:
        msg.t = 'Set as out for delivered';
        msg.m = 'Do you want to set as delivered';
        msg.s = 'Successfully set as delivered';
      break;
      case 5:
        msg.t = 'Cancel this order';
        msg.m = 'Do you want to cancel this order?';
        msg.s = 'Order cancelled';
      break;
    }
    Notiflix.Confirm.Show( msg.t, msg.m, 'Yes', 'No', ()=>{
      Notiflix.Loading.Arrows();
      const postData = {
        status :this.status,
        id: this.data.id
      };
      this.cartService.changeStatus(postData).pipe(mergeMap(res=>{
        return this.cartService.getAllOrders();
      })).subscribe(res=>{
        Notiflix.Loading.Remove();
        Notiflix.Notify.Success(msg.s);
        this.dialogRef.close();
      }, error=>{
        Notiflix.Loading.Remove();
        Notiflix.Notify.Failure(`Sorry unexpected error occur. please try again later `);
      });
    }, ()=>{
      // No button callback alert('If you say so...');
    } );


  }
  ngOnInit(): void {
    this.status = this.data.status;
    this.breakpointObserver.observe([
      Breakpoints.XSmall,
      Breakpoints.Tablet
    ]).subscribe(res=>{
      if(res.matches){
        this.whastAppUrl = `https://api.whatsapp.com/send?phone=${this.data.shop_customer.phone}`;
      }else{
        this.whastAppUrl = `https://web.whatsapp.com/send?phone=${this.data.shop_customer.phone}`;
      }
    })

    this.mapUrl = `${environment.gMapUrl}/maps?z=12&t=m&q=loc:${this.data?.loc?.lat}+${this.data?.loc?.lon}`;
  }

  ngOnDestroy(){
    if(this.breakPointSubscr){
      this.breakPointSubscr.unsubscribe();
    }
  }
}
