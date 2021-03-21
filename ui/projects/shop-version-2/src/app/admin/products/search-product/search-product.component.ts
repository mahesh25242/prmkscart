import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import Notiflix from "notiflix";
import { ShopProductService } from 'src/app/lib/services';

@Component({
  selector: 'app-search-product',
  templateUrl: './search-product.component.html',
  styleUrls: ['./search-product.component.scss']
})
export class SearchProductComponent implements OnInit {
  searchFrm: FormGroup;
  @Input() pageEvent: PageEvent;
  constructor(private formBuilder: FormBuilder,
    private shopProductService: ShopProductService) { }

  search(){
    const postData = {
      pageSize : (this.pageEvent?.pageSize) ? this.pageEvent?.pageSize : 20,
      q: this.searchFrm.controls.q.value,
    }
    Notiflix.Loading.Arrows();
    this.shopProductService.listproducts(1, postData).subscribe(res=>{
      Notiflix.Loading.Remove();
    }, error=>{
      Notiflix.Loading.Remove();
    });
  }
  reset(){
    this.searchFrm.controls.q.setValue('');
    this.search();
  }
  ngOnInit(): void {
    this.searchFrm = this.formBuilder.group({
      q: [null, []]
    });
  }

}
