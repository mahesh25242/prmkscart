import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ShopProductCategory } from 'src/app/lib/interfaces';
import { ShopProductCategoryService } from 'src/app/lib/services';
import Notiflix from "notiflix";
import { map, mergeMap } from 'rxjs/operators';
import { environment } from '../../../../../../environments/environment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CreateCategoryComponent } from './create-category/create-category.component';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit {
  categories$: Observable<ShopProductCategory[]>;
  environment = environment;
  shopKey$:Observable<any>;
  constructor(private shopProductCategoryService: ShopProductCategoryService,
    private _modalService: NgbModal,
    private route: ActivatedRoute) { }


  editCategory(cat: ShopProductCategory = null){
    const activeModal = this._modalService.open(CreateCategoryComponent, {
      size: 'lg',
      //backdrop: false,
    });
    activeModal.componentInstance.category = cat;
    activeModal.componentInstance.shopKey = this.shopKey$;
  }

  deleteCategory(cat: ShopProductCategory = null, shopKey: string = ''){
    Notiflix.Confirm.Show( 'delete?', `Do you want to delete ${cat.name}`, 'Yes', 'No', ()=>{
      Notiflix.Loading.Arrows();
      this.shopProductCategoryService.deleteCategory(cat).pipe(mergeMap(res=>{
        return this.shopProductCategoryService.listCategories({
          "shop_key": shopKey
        }).pipe(map(cats=>{
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
    this.categories$ = this.shopProductCategoryService.categories;
    this.shopKey$ = this.route.parent.params;
  }

}
