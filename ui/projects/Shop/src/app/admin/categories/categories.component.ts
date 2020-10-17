import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ShopProductCategory } from 'src/app/lib/interfaces';
import { ShopProductCategoryService } from 'src/app/lib/services';
import Notiflix from "notiflix";
import { map, mergeMap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
declare var $: any;

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit {
  categories$: Observable<ShopProductCategory[]>;
  private category$: BehaviorSubject<ShopProductCategory> = new BehaviorSubject<ShopProductCategory>(null);
  environment = environment;
  constructor(private shopProductCategoryService: ShopProductCategoryService) { }

  get category() { return this.category$.asObservable()}
  editCategory(cat: ShopProductCategory = null){
    this.category$.next(cat);
    $('#createCategory').modal('show')
  }

  deleteCategory(cat: ShopProductCategory = null){
    Notiflix.Confirm.Show( 'delete?', `Do you want to delete ${cat.name}`, 'Yes', 'No', ()=>{
      Notiflix.Loading.Arrows();
      this.shopProductCategoryService.deleteCategory(cat).pipe(mergeMap(res=>{
        return this.shopProductCategoryService.listCategories().pipe(map(cats=>{
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
  }

}
