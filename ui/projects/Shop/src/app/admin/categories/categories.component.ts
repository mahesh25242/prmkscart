import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ShopProductCategory } from 'src/app/lib/interfaces';
import { GeneralService, ShopProductCategoryService } from 'src/app/lib/services';
import Notiflix from "notiflix";
import { map, mergeMap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { CreateCategoryComponent } from './create-category/create-category.component';



@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit {
  categories$: Observable<ShopProductCategory[]>;
  environment = environment;

  displayedColumns: string[] = ['no', 'name', 'icon', 'status', 'options'];

  constructor(private shopProductCategoryService: ShopProductCategoryService,
    public dialog: MatDialog,
    private generalService: GeneralService) { }


  editCategory(cat: ShopProductCategory = null){

    let dialogRef = this.dialog.open(CreateCategoryComponent, {
      data: cat,     
     
    });


  }

  changeStatus(cat: ShopProductCategory = null){
    Notiflix.Confirm.Show( 'Change Status?', `Do you want to change ${cat.name} status?`, 'Yes', 'No', ()=>{
      Notiflix.Loading.Arrows();
      this.shopProductCategoryService.changeStatus(cat).pipe(mergeMap(res=>{
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

    this.generalService.bc$.next({
      siteName: environment.siteName,
      title: 'Categories',
      url:'',
      backUrl: null
    });

    this.categories$ = this.shopProductCategoryService.categories;
  }

}
