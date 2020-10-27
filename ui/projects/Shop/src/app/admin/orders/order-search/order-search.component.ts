import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { CartService } from 'src/app/lib/services';

@Component({
  selector: 'app-order-search',
  templateUrl: './order-search.component.html',
  styleUrls: ['./order-search.component.scss']
})
export class OrderSearchComponent implements OnInit {
  searchFrm: FormGroup;
  @Input() pageEvent: PageEvent;
  constructor(private formBuilder: FormBuilder,
    private cartService: CartService,
    public datepipe: DatePipe) { }

  search(){
    const startDate = (this.searchFrm.controls.start_date.value) ? this.datepipe.transform(this.searchFrm.controls.start_date.value, 'yyyy-MM-dd') : null;
    const endDate = (this.searchFrm.controls.end_date.value) ? this.datepipe.transform(this.searchFrm.controls.end_date.value, 'yyyy-MM-dd') : null;
    const postData = {
      pageSize : (this.pageEvent?.pageSize) ? this.pageEvent?.pageSize : 20,
      q: this.searchFrm.controls.q.value,
      start_date: startDate,
      end_date: endDate,
    }

    this.cartService.getAllOrders(1, postData).subscribe();
  }


  ngOnInit(): void {
    this.searchFrm = this.formBuilder.group({
      q: [null, []],
      start_date: [null, []],
      end_date: [null, []],
    });
  }

}
