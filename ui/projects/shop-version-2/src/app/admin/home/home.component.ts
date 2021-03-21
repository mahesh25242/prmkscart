import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ShopOrder } from 'src/app/lib/interfaces';
import { GeneralService } from 'src/app/lib/services';
import { environment } from '../../../environments/environment';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  stat$: Observable<{
    active_categories?: number,
    active_products?: number,
    cancelled?: number,
    categories?: number,
    delivered?: number,
    delivery_locations?: number,
    latest_orders?: ShopOrder[],
    orders?: number,
    products?: number,
  }>;
  constructor(private generalService: GeneralService) { }

  ngOnInit(): void {
    this.generalService.bc$.next({
      siteName: environment.siteName,
      title: 'Home',
      url:'',
      backUrl: null
    });

    this.stat$ = this.generalService.adminHomeStat();

  }

}
