import { Component, Inject, OnInit } from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import Notiflix from "notiflix";
import { ShopOrder } from 'src/app/lib/interfaces';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.scss']
})
export class OrderDetailsComponent implements OnInit {
  displayedColumns = ["no", "name", "qty", "price"];
  constructor(@Inject(MAT_DIALOG_DATA) public data: ShopOrder,
  public dialogRef: MatDialogRef<OrderDetailsComponent>) { }

  ngOnInit(): void {
  }

}
