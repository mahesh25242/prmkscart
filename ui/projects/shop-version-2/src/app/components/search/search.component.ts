import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ShopProductCategoryService, ShopProductService } from 'src/app/lib/services';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  searchFrm: FormGroup;
  constructor(private formBuilder : FormBuilder,
    private shopProductCategoryService: ShopProductCategoryService,
    private shopProductService: ShopProductService,
    private router: Router) { }

  get f(){ return this.searchFrm.controls; }

  search(){
    if(this.f.q.value){
      this.shopProductService.allProduct = [];
      this.router.navigate([`/search/${this.f.q.value}`]);
    }
  }
  ngOnInit(): void {
    this.searchFrm = this.formBuilder.group({
      q: [null, []]
    });
  }

}
