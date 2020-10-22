import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { empty, Observable,of,pipe, Subscription } from 'rxjs';
import { mergeMap, tap, map } from 'rxjs/operators';
import { Cart, Shop, ShopDelivery } from 'src/app/lib/interfaces';
import { CartService, GeneralService, ShopService } from 'src/app/lib/services';
import { environment } from '../../environments/environment';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'lodash'
import {MatSnackBar} from '@angular/material/snack-bar';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';

@Component({
  selector: 'app-cart-details',
  templateUrl: './cart-details.component.html',
  styleUrls: ['./cart-details.component.scss']
})
export class CartDetailsComponent implements OnInit, OnDestroy {
  customerFrm: FormGroup;
  @Output() public showDetails = new EventEmitter();
  cart$: Observable<Cart[]>;
  total:number = 0;
  grandTotal:number = 0;

  shop$:Observable<Shop>;
  selectedLocation: ShopDelivery;
  mapUrl: string = '';
  loc : any =null;

  breakPointSubScr: Subscription;
  constructor(private cartService: CartService,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<CartDetailsComponent>,
    private shopService: ShopService,
    private matSnackBar: MatSnackBar,
    private breakpointObserver: BreakpointObserver,
    private generalService: GeneralService) {
    cartService.shopKey = environment.shopKey;
  }

  updateCart(cart: Cart, action: string='+'){
    const itm =Object.assign({}, cart);
    itm.qty = 1;
    this.cartService.updateCart(itm, action).subscribe();
  }

  sendToShop(){
    if(!this.selectedLocation?.id){
      this.matSnackBar.open('Please choose a delivery location.');
      return;
    }
    this.cart$.pipe(mergeMap(cart=>{
      if(!cart) return empty();
      return this.shop$.pipe(mergeMap(shop=>{
        if(!shop) return empty();
        const postData = {
          cart: cart,
          name: this.f.name.value,
          note: this.f.note.value,
          email: this.f.email.value,
          phone: this.f.phone.value,
          address: this.f.address.value,
          pin: this.f.pin.value,
          selectedLocation: this.selectedLocation,
          grad_total: this.grandTotal,
          loc :this.loc
        }
        return this.cartService.createOrder(postData).pipe(mergeMap(orderRes=>{
          if(!orderRes) return empty();
          return this.breakpointObserver.observe([
            Breakpoints.Handset,
            Breakpoints.Tablet
          ]).pipe(map(bp =>{
            let txt = `%0a‎ New Order`;
            txt += `%0a‎ Order Number: ${encodeURIComponent(`#45`)}`;

            cart.map(itm=>{
              txt += `%0a‎ Product: ${itm.product.name} `;
              txt += `%0a‎ Varient Name: ${itm.product.shop_product_selected_variant.name} `;
              txt += `%0a‎ Quantity: ${itm.qty} `;
              txt += `%0a‎ Price: ${itm.price} `;
              txt += `%0a‎ ============== `;
            });
            txt += `%0a‎ ${ cart.length }  ${ (cart.length > 1) ? 'items' : 'item' }  %0a`;
            txt += `%0a‎ Grand Total: ${this.grandTotal} %0a`;

            let ret;
            if(bp.matches){
              ret = {
                url: `https://api.whatsapp.com/send?phone=${shop.phone}&text=${txt}`
              }
            }else{
              ret = {
                url: `https://web.whatsapp.com/send?phone=${shop.phone}&text=${txt}`
              }
            }
            return ret;
          }))
        }))
      }));

    })).subscribe(res=>{
      localStorage.removeItem(`${environment.shopKey}-cart`);
      window.location.href = res.url;
    });




  }

  closeWindow(){
    this.showDetails.emit();
    this.dialogRef.close();
  }

  changeLocation(loc: ShopDelivery){
    if(!loc) return;
    this.selectedLocation = loc;
    if(this.selectedLocation?.charge){
      this.grandTotal = this.total + this.selectedLocation?.charge;
    }else{
      this.grandTotal = this.total;
    }


      this.breakPointSubScr = this.breakpointObserver.observe([
        Breakpoints.Handset,
        Breakpoints.Tablet
      ]).pipe(mergeMap(brakPoints=>{
        if (brakPoints.matches && navigator.geolocation && loc.need_cust_loc) {
          return this.generalService.getLocation().pipe(mergeMap(coords=>{
            if(coords){
              this.loc = {
                lat: coords?.coords?.latitude,
                lon: coords?.coords?.longitude
              }
              this.mapUrl = `${environment.gMapUrl}/maps?z=12&t=m&q=loc:${coords?.coords?.latitude}+${coords?.coords?.longitude}`;
              return this.generalService.reverseLatLngAddress(this.loc);
            }else{
              this.mapUrl = null;
              return empty();
            }

          }))
        }else{
          return empty()
        }

      })).subscribe((res: any)=> {

        if(res){
          if(!this.f.pin.value && res?.address?.postcode){
            this.f.pin.setValue(res?.address?.postcode)
          }

          if(!this.f.address.value && res?.display_name){
            this.f.address.setValue(res?.display_name)
          }

        }
      }, err=>{
        switch(err?.code){
              case 1:
                this.matSnackBar.open('Location Permission denied.');
              break;
              case 2:
                this.matSnackBar.open('Sorry your position is unavailable.');
              break;
              case 3:
                this.matSnackBar.open('Sorry your position request was timeout. Please try again.');
              break;
              default:
                this.matSnackBar.open('Sorry unexpected error occur.');
              break;
            }
      })



  }
  get f(){ return this.customerFrm.controls; }

  ngOnInit(): void {
    this.shop$ = this.shopService.aShop;
    // .pipe(tap(res=>{
    //   this.changeLocation(first(res?.shop_delivery));
    // }));
    this.cart$ = this.cartService.cart().pipe(tap(res=>{
      this.total = 0;
      res.map(itm=>{
        this.total +=itm.price;
      });

      this.grandTotal = this.total;
      if(!this.total){
        this.closeWindow();
      }

    }));

    this.customerFrm = this.formBuilder.group({
      name: [null, [Validators.required]],
      note: [null, [Validators.required]],
      email: [null, []],
      phone: [null, [Validators.required]],
      address: [null, [Validators.required]],
      pin: [null, [Validators.required]],
    });
  }

  ngOnDestroy(){
    if(this.breakPointSubScr)
      this.breakPointSubScr.unsubscribe();
  }
}
