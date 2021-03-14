import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, Subscription } from 'rxjs';
import { Shop, User } from 'src/app/lib/interfaces';
import { ShopService } from 'src/app/lib/services';
import { CreateAdminComponent } from './create-admin/create-admin.component';
import Notiflix from "notiflix";

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss']
})
export class ShopComponent implements OnInit {
  shop$: Observable<Shop>;

  generateShopSubScr: Subscription;
  constructor(private shopService: ShopService,
    private _modalService: NgbModal,) { }

    createAdmin(shop: Shop=null){
      const activeModal = this._modalService.open(CreateAdminComponent, {
        size: 'lg'
      });
      activeModal.componentInstance.shop = shop;
    }

    generateIt(shop: Shop = null){
      let msg = (shop.is_generated) ? 'Do you want to re-generate' : 'Do you want to generate';
      Notiflix.Confirm.Show( 'Generate?', msg, 'Yes', 'No', ()=>{
        Notiflix.Loading.Arrows();

        this.generateShopSubScr = this.shopService.generateSite(shop).subscribe(res=>{
          Notiflix.Notify.Success(`Successfully ${ (shop.is_generated) ? `re-generated` : `generated` } site `);
          Notiflix.Loading.Remove();
        }, err=>{
          Notiflix.Notify.Failure('Sorry unexpected error occur. ');
          Notiflix.Loading.Remove();
        });

      }, ()=>{
        // No button callback alert('If you say so...');
      } );

    }

    downloadSite(shop: Shop = null){
      Notiflix.Loading.Arrows();
      this.generateShopSubScr = this.shopService.downloadSite(shop).subscribe(res=>{
        const blob = new Blob([res], {
          type: 'application/zip'
        });
        const url = window.URL.createObjectURL(blob);
        var anchor = document.createElement("a");
        anchor.download = "www.zip";
        anchor.href = url;
        anchor.click();




        Notiflix.Notify.Success(`Successfully download site `);
        Notiflix.Loading.Remove();
      }, err=>{
        console.log(err)
        Notiflix.Notify.Failure('Sorry unexpected error occur. ');
        Notiflix.Loading.Remove();
      });

    }
  ngOnInit(): void {
    this.shop$ = this.shopService.aShop;
  }

}
