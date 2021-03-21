import { Component, OnInit } from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-order-terms',
  templateUrl: './order-terms.component.html',
  styleUrls: ['./order-terms.component.scss']
})
export class OrderTermsComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<OrderTermsComponent>,) { }

  ngOnInit(): void {
  }

}
