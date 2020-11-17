import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { empty, Observable,of,pipe, Subscription } from 'rxjs';
import { mergeMap, tap, map } from 'rxjs/operators';
import { Cart, Shop, ShopDelivery, ShopOrder } from 'src/app/lib/interfaces';
import { CartService, GeneralService, ShopService } from 'src/app/lib/services';
import { environment } from '../../environments/environment';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'lodash'
import {MatSnackBar} from '@angular/material/snack-bar';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { Router } from '@angular/router';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { EditMessageComponent } from './edit-message/edit-message.component';
import Notiflix from "notiflix";
import { DatePipe } from '@angular/common'
import { OrderFormComponent } from './order-form/order-form.component';
import { OrderTermsComponent } from './order-terms/order-terms.component';

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
  todayDate:Date = new Date();

  shop$:Observable<Shop>;
  selectedLocation: ShopDelivery;
  mapUrl: string = '';
  loc : any =null;
  terms:boolean = false;
  breakPointSubScr: Subscription;

  cartSubScr: Subscription;
  sentToShop: Subscription;
  constructor(private cartService: CartService,
    private formBuilder: FormBuilder,
    private shopService: ShopService,
    private matSnackBar: MatSnackBar,
    private breakpointObserver: BreakpointObserver,
    private generalService: GeneralService,
    private router: Router,
    public dialog: MatDialog,
    public datepipe: DatePipe) {
    cartService.shopKey = environment.shopKey;
  }

  updateCart(cart: Cart, action: string='+'){
    const itm =Object.assign({}, cart);
    itm.qty = 1;
    if(this.cartSubScr) this.cartSubScr.unsubscribe();
    this.cartSubScr = this.cartService.updateCart(itm, action).subscribe();
  }

  sendToShop(){

    if(!this.selectedLocation?.id){
      this.matSnackBar.open('Please choose a delivery location.');
      return;
    }
    Notiflix.Loading.Arrows();
    this.sentToShop = this.cart$.pipe(mergeMap(cart=>{
      if(!cart) return empty();

      return this.shop$.pipe(mergeMap(shop=>{
        if(!shop) return empty();

        let deliveryDate = '';

        if(this.f.delivery_date.value){
          deliveryDate = this.datepipe.transform(this.f.delivery_date.value, 'yyyy-MM-dd');
          let minute;
          if(this.f.hour.value){
            minute = (this.f.minute.value) ? ("0" + this.f.minute.value).slice(-2) : '00';
          }
          deliveryDate = `${deliveryDate} ${ (this.f.hour.value) ? `${("0" + this.f.hour.value).slice(-2) }:` :'' }${ (minute) ? `${minute}` : '' }${(this.f.hour.value) ? this.f.ampm.value : ''}`
        }

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
          loc :this.loc,
          delivery_date: deliveryDate,
          hour: this.f.hour.value,
          minute: this.f.minute.value,
          ampm: this.f.ampm.value,
        }

        return this.cartService.createOrder(postData).pipe(mergeMap((orderRes : ShopOrder)=>{
          if(!orderRes) return empty();
          return this.breakpointObserver.observe([
            Breakpoints.Handset,
            Breakpoints.Tablet
          ]).pipe(map(bp =>{
            let txt = `%0a‎ New Order`;
            txt += `%0a‎ Order Number: ${encodeURIComponent(`#${orderRes.id}`)}`;

            cart.map(itm=>{
              txt += `%0a‎ Product: ${itm.product.name} `;
              if(itm.message){
                txt += `%0a‎ Message: ${itm.message} `;
              }
              txt += `%0a‎ Varient Name: ${itm.product.shop_product_selected_variant.name} `;
              txt += `%0a‎ Quantity: ${itm.qty} `;
              txt += `%0a‎ Price: ₹ ${itm.price} `;
              txt += `%0a‎ ============== `;
            });
            txt += `%0a‎ ${ cart.length }  ${ (cart.length > 1) ? 'items' : 'item' } `;
            if(postData.name){
              txt += `%0a‎ Customer Name: ${postData.name}  `;
            }

            if(postData.delivery_date){
              txt += `%0a‎ Delivered On: ${postData.delivery_date}  `;
            }

            if(postData.note){
              txt += `%0a‎ Order Note: ${postData.note}  `;
            }

            if(postData.delivery_date){
              txt += `%0a‎ Delivery Date: ${postData.delivery_date}  `;
            }

            txt += `%0a‎ Delivery Point: ${postData.selectedLocation.name} `;
            if(postData.selectedLocation.need_cust_loc){
              txt += `%0a‎ Address: ${postData.address} `;
              txt += `%0a‎ Pin: ${postData.pin} `;
            }
            if(postData.selectedLocation.charge){
              txt += `%0a‎ Delivery Charge: ₹ ${postData.selectedLocation.charge} %0a `;
            }



            txt += `%0a‎ Grand Total: ₹ *${this.grandTotal}* %0a`;


            let ret;
            if(bp.matches){
              ret = {
                url: `https://api.whatsapp.com/send?phone=${orderRes.shop_customer.phone}&text=${txt}`
              }
            }else{
              ret = {
                url: `https://web.whatsapp.com/send?phone=${orderRes.shop_customer.phone}&text=${txt}`
              }
            }
            return ret;
          }))
        }))
      }));

    })).subscribe(res=>{
      localStorage.removeItem(`${environment.shopKey}-cart`);
      window.location.href = res.url;
      Notiflix.Loading.Remove();
    }, error=>{
      Notiflix.Loading.Remove();
      if(error.status == 422){
        for(let result in this.customerFrm.controls){
          if(error.error.errors[result]){
            this.customerFrm.controls[result].setErrors({ error: error.error.errors[result] });
            this.customerFrm.controls[result].markAsDirty();
            this.customerFrm.controls[result].markAsTouched();
          }else{
            this.customerFrm.controls[result].setErrors(null);

          }
        }
      }
    });




  }



  deleteItem(itm: Cart){
    itm.qty = 0;
    if(this.cartSubScr) this.cartSubScr.unsubscribe();
    this.cartSubScr = this.cartService.updateCart(itm, '++').subscribe(res=>{
      this.matSnackBar.open(`${itm.product.name} - ${itm.product.shop_product_selected_variant.name} successfully removed`);
    });
  }

  changeLocation(loc: ShopDelivery){
    if(!loc) return;
    if(loc.min_amount && this.grandTotal < loc.min_amount){
      this.matSnackBar.open(`Sorry you cant choose ${loc.name} as your delivery. Because it has miinum order amount is ${loc.min_amount}`);
      return;
    }
    this.selectedLocation = loc;
    if(this.selectedLocation?.charge){
      this.grandTotal = this.total + this.selectedLocation?.charge;
    }else{
      this.grandTotal = this.total;
    }
    this.triggerOrderForm();

    if(this.breakPointSubScr) this.breakPointSubScr.unsubscribe();

      this.breakPointSubScr = this.breakpointObserver.observe([
        Breakpoints.Handset
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

  isShowButton(){
    if(this.selectedLocation?.need_cust_loc){
      return (this.f.name.valid && this.f.phone.valid && this.f.address.valid && this.f.pin.valid);
    }
    return (this.f.name.valid && this.f.phone.valid);
  }
  triggerOrderForm(){
    let dialogRef = this.dialog.open(OrderFormComponent, {
      data: {
        customerFrm: this.customerFrm,
        selectedLocation: this.selectedLocation,
        mapUrl: this.mapUrl
      },
      // height: '400px',
      // width: '600px',
    });

  }

  triggerTerms(){
    let dialogRef = this.dialog.open(OrderTermsComponent, {
      // height: '400px',
      // width: '600px',
    });
  }
  get f(){ return this.customerFrm.controls; }

  editMessage(cart: Cart = null){
    let dialogRef = this.dialog.open(EditMessageComponent, {
      data: cart
    });
  }
  ngOnInit(): void {
    this.generalService.bc$.next({
      siteName: environment.siteName,
      title: `My Cart`,
      url:'',
      backUrl: '/'
    });

    this.cartService.hideCartComponent$.next(true);
    this.shop$ = this.shopService.aShop;
    // .pipe(tap(res=>{
    //   this.changeLocation(first(res?.shop_delivery));
    // }));
    this.cart$ = this.cartService.cart().pipe(tap(res=>{


      this.total = 0;
      res.map(itm=>{
        this.total +=itm.price;
      });

      if(this.selectedLocation && this.selectedLocation.charge){
        this.grandTotal = this.total + this.selectedLocation.charge;
      }else{
        this.grandTotal = this.total;
      }

      if(!this.total){
        this.matSnackBar.open('Your cart is empty.');
        this.router.navigate(['/']);
      }

      this.generalService.bc$.next({
        siteName: environment.siteName,
        title: `My Cart ( ${res.length} )`,
        url:'',
        backUrl: '/'
      });


    }));

    this.customerFrm = this.formBuilder.group({
      name: [null, [Validators.required]],
      note: [null, []],
      email: [null, []],
      phone: [null, [Validators.required]],
      address: [null, []],
      pin: [null, []],
      delivery_date: [null, []],
      hour: [null, [Validators.min(1), Validators.max(12)]],
      minute: [null, [Validators.min(0), Validators.max(59)]],
      ampm: ['am', []],
    });
  }

  ngOnDestroy(){
    this.cartService.hideCartComponent$.next(false);
    if(this.breakPointSubScr){
      this.breakPointSubScr.unsubscribe();
    }

    if(this.cartSubScr){
      this.cartSubScr.unsubscribe();
    }

    if(this.sentToShop){
      this.sentToShop.unsubscribe();
    }

  }
}
