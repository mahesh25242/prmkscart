import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Shop } from 'src/app/lib/interfaces';
import { ShopService } from 'src/app/lib/services';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss']
})
export class ShopComponent implements OnInit {
  shop$: Observable<Shop>;

  constructor(private shopService: ShopService) { }

  ngOnInit(): void {
    this.shop$ = this.shopService.aShop;
  }

}
