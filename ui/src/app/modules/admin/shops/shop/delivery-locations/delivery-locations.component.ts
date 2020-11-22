import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ShopDelivery } from 'src/app/lib/interfaces';
import { ShopService } from 'src/app/lib/services';

@Component({
  selector: 'app-delivery-locations',
  templateUrl: './delivery-locations.component.html',
  styleUrls: ['./delivery-locations.component.scss']
})
export class DeliveryLocationsComponent implements OnInit {
  deliveries$: Observable<ShopDelivery[]>;
  constructor(private shopService: ShopService) { }

  ngOnInit(): void {
    this.deliveries$ = this.shopService.deliveries;
  }

}
