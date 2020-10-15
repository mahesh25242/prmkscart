import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { Shop, User } from 'src/app/lib/interfaces';
import { ShopService } from 'src/app/lib/services';
import { CreateAdminComponent } from './create-admin/create-admin.component';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss']
})
export class ShopComponent implements OnInit {
  shop$: Observable<Shop>;

  constructor(private shopService: ShopService,
    private _modalService: NgbModal,) { }

    createAdmin(shop: Shop=null){
      const activeModal = this._modalService.open(CreateAdminComponent, {
        size: 'lg'
      });
      activeModal.componentInstance.shop = shop;
    }
  ngOnInit(): void {
    this.shop$ = this.shopService.aShop;
  }

}
