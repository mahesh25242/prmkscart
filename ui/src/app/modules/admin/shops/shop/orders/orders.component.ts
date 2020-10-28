import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { ShopOrderWithPagination } from 'src/app/lib/interfaces';
import { CartService } from 'src/app/lib/services';
import { OrderDetailsComponent } from './order-details/order-details.component';
@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {
  orders$: Observable<ShopOrderWithPagination>;
  shopKey$:Observable<any>;

  constructor(private _modalService: NgbModal,
    private route: ActivatedRoute,
    private CartService: CartService) { }

  details(order){
    const activeModal = this._modalService.open(OrderDetailsComponent, {
      size: 'lg',
      //backdrop: false,
    });
    activeModal.componentInstance.order = order;
    activeModal.componentInstance.shopKey = this.shopKey$;
  }

  loadPage(page){

  }
  ngOnInit(): void {
    this.shopKey$ = this.route.parent.params;
    this.orders$ = this.CartService.orders;
  }

}
