import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { ShopCategory } from 'src/app/lib/interfaces';
import { ShopCategoryService } from 'src/app/lib/services';
import { CreateShopCategoryComponent } from './create-shop-category/create-shop-category.component';
import Notiflix from "notiflix";
import { map, mergeMap } from 'rxjs/operators';
import {  faTrash } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-shop-category',
  templateUrl: './shop-category.component.html',
  styleUrls: ['./shop-category.component.scss']
})
export class ShopCategoryComponent implements OnInit {
  faTrash =  faTrash;
  categories$: Observable<ShopCategory[]>;
  constructor(private _modalService: NgbModal,
    private shopCategoryService: ShopCategoryService) { }

  create(cat: ShopCategory = null){
    const activeModal = this._modalService.open(CreateShopCategoryComponent);
    activeModal.componentInstance.shopCategory = cat;
  }

  delete(cat: ShopCategory = null){
    Notiflix.Confirm.Show( 'delete?', `Do you want to delete ${cat.name}`, 'Yes', 'No', ()=>{
      Notiflix.Loading.Arrows();
      this.shopCategoryService.deleteCategory(cat.id).pipe(mergeMap(res=>{
        return this.shopCategoryService.getCategories().pipe(map(cats=>{
          return res;
        }));
      })).subscribe(res=>{
        Notiflix.Loading.Remove();
        Notiflix.Notify.Success(`${cat.name} Successfully deleted `);
      }, error=>{
        Notiflix.Loading.Remove();
        Notiflix.Notify.Failure(`unexpected error`);
      });
    }, ()=>{
      // No button callback alert('If you say so...');
    } );
  }


  ngOnInit(): void {
    this.categories$ = this.shopCategoryService.shopCategories;
  }

}
