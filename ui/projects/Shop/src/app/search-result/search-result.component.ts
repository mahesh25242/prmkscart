import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { ShopProduct } from 'src/app/lib/interfaces';
import { ShopProductService } from 'src/app/lib/services';

@Component({
  selector: 'app-search-result',
  templateUrl: './search-result.component.html',
  styleUrls: ['./search-result.component.scss']
})
export class SearchResultComponent implements OnInit {
  products$: Observable<ShopProduct[]>;
  constructor(private shopProductService: ShopProductService,
    private route: ActivatedRoute) { }


  ngOnInit(): void {
    this.products$ = this.route.params.pipe(mergeMap(res=>{
      const postData = {
        q: res?.q
      }
      return this.shopProductService.showProducts(postData);
    }));
  }

}
