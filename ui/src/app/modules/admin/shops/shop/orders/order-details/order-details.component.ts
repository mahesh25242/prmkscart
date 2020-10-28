import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ShopOrder } from 'src/app/lib/interfaces';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.scss']
})
export class OrderDetailsComponent implements OnInit {
  @Input() order: ShopOrder;
  @Input() shopKey: Observable<any>;
  constructor() { }

  ngOnInit(): void {
  }

}
