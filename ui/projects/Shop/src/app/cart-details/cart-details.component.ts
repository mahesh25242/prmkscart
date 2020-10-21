import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { empty, Observable,of,pipe, Subscription } from 'rxjs';
import { mergeMap, tap, } from 'rxjs/operators';
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

  shop$:Observable<Shop>;
  selectedLocation: ShopDelivery;
  mapUrl: string = '';

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
    let txt = `%0a‎ New Order`;
    txt += `%0a‎ Order Number: ${encodeURIComponent(`#45`)}`;
    txt += `%0a‎ Product: Cake `;
    txt += `%0a‎ Quantity: 1Kg `;
    txt += `%0a‎ Price: 200 `;
    txt += `%0a‎ ============== `;


    txt += `%0a‎ Product: Cake `;
    txt += `%0a‎ Quantity: 1Kg `;
    txt += `%0a‎ Price: 200 `;
    txt += `%0a‎ ============== `;


    txt += `%0a‎ Product: Cake `;
    txt += `%0a‎ Quantity: 1Kg `;
    txt += `%0a‎ Price: 200 `;
    txt += `%0a‎ ============== `;



    txt += `%0a‎ Product: Cake `;
    txt += `%0a‎ Quantity: 1Kg `;
    txt += `%0a‎ Price: 200 `;
    txt += `%0a‎ ============== `;



    txt += `%0a‎ Product: Cake `;
    txt += `%0a‎ Quantity: 1Kg `;
    txt += `%0a‎ Price: 200 `;
    txt += `%0a‎ ============== `;


    txt += `%0a‎ Product: Cake `;
    txt += `%0a‎ Quantity: 1Kg `;
    txt += `%0a‎ Price: 200 `;
    txt += `%0a‎ ============== `;


    txt += `%0a‎ Total: 20000 %0a`;
    window.location.href = `https://wa.me/919995453566?text=${txt}`;

  }

  closeWindow(){
    this.showDetails.emit();
    this.dialogRef.close();
  }

  changeLocation(loc: ShopDelivery){
    this.selectedLocation = loc;


    if (navigator.geolocation && loc.need_cust_loc) {
        navigator.geolocation.getCurrentPosition((position: Position) => {
          if (position) {
            this.breakPointSubScr = this.breakpointObserver.observe([
              Breakpoints.Handset,
              Breakpoints.Tablet
            ]).pipe(mergeMap(res=>{
              //alert("as")
              if(res.matches){
                return this.generalService.reverseLatLngAddress({
                  lat: position?.coords?.latitude,
                  lon: position?.coords?.longitude
                })
              }else{
                return empty();
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
            });
            this.mapUrl = `${environment.gMapUrl}/maps?z=12&t=m&q=loc:${position?.coords?.latitude}+${position?.coords?.longitude}`;
          }
      }, (err: PositionError) =>{
          switch(err.code){
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
    }else{
      this.mapUrl = null;
    }

  }
  get f(){ return this.customerFrm.controls; }

  ngOnInit(): void {
    this.shop$ = this.shopService.aShop.pipe(tap(res=>{
      this.changeLocation(first(res.shop_delivery));
    }));
    this.cart$ = this.cartService.cart().pipe(tap(res=>{
      this.total = 0;
      res.map(itm=>{
        this.total +=itm.price;
      });
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
