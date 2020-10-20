import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ShopDelivery } from 'src/app/lib/interfaces';
import { ShopService } from 'src/app/lib/services';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import Notiflix from "notiflix";
import { map, mergeMap } from 'rxjs/operators';
import { CreateShopDeliveryComponent } from './create-shop-delivery/create-shop-delivery.component';

@Component({
  selector: 'app-shop-delivery',
  templateUrl: './shop-delivery.component.html',
  styleUrls: ['./shop-delivery.component.scss']
})
export class ShopDeliveryComponent implements OnInit {
  deliveries$: Observable<ShopDelivery[]>;
  displayedColumns: string[] = ['no', 'name', 'charge', 'need_cust_loc', 'options'];

  constructor(private shopService: ShopService,
    public dialog: MatDialog) { }

    editDeliveryLoc(delivery: ShopDelivery = null){

    let dialogRef = this.dialog.open(CreateShopDeliveryComponent, {
      data: delivery,
    });


  }

  deleteDeliveryLoc(delivery: ShopDelivery = null){
    Notiflix.Confirm.Show( 'delete?', `Do you want to delete ${delivery.name}`, 'Yes', 'No', ()=>{
      Notiflix.Loading.Arrows();
      this.shopService.deleteShopDelivery(delivery).pipe(mergeMap(res=>{
        return this.shopService.shopDeliveries().pipe(map(cats=>{
          return res;
        }));
      })).subscribe(res=>{
        Notiflix.Loading.Remove();
        Notiflix.Notify.Success(`${delivery.name} Successfully deleted `);
      }, error=>{
        Notiflix.Loading.Remove();
        Notiflix.Notify.Failure(`unexpected error`);
      });
    }, ()=>{
      // No button callback alert('If you say so...');
    } );
  }

  ngOnInit(): void {
    this.deliveries$ = this.shopService.deliveries;
  }

}
