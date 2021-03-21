import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ShopOrder } from 'src/app/lib/interfaces';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-order-deatil',
  templateUrl: './order-deatil.component.html',
  styleUrls: ['./order-deatil.component.scss']
})
export class OrderDeatilComponent implements OnInit {
  order:ShopOrder;
  mapUrl: string = null;
  displayedColumns = ["no", "name", "qty", "message", "price"];
  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.order = this.route.snapshot.data["order"];

    this.mapUrl = `${environment.gMapUrl}/maps?z=12&t=m&q=loc:${this.order?.loc?.lat}+${this.order?.loc?.lon}`;
  }

}
