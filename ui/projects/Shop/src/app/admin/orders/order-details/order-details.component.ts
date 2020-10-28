import { Component, Inject, OnInit } from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import Notiflix from "notiflix";
import { mergeMap } from 'rxjs/operators';
import { ShopOrder } from 'src/app/lib/interfaces';
import { CartService } from 'src/app/lib/services';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.scss']
})
export class OrderDetailsComponent implements OnInit {
  displayedColumns = ["no", "name", "qty", "message", "price"];
  constructor(@Inject(MAT_DIALOG_DATA) public data: ShopOrder,
  public dialogRef: MatDialogRef<OrderDetailsComponent>,
  private cartService: CartService,) { }

  changeStatus(status: number = 1){
    let msg: { t: string, m: string, s: string} = { t : '', m: '', s : ''};

    switch(status){
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
        status :status,
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
  }

}
