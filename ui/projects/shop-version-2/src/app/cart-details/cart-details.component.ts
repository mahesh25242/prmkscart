import { ChangeDetectionStrategy, Component, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { empty, Observable,of,pipe, Subscription } from 'rxjs';
import { mergeMap, tap, map } from 'rxjs/operators';
import { Cart, Shop, ShopDelivery, ShopOrder } from 'src/app/lib/interfaces';
import { CartService, GeneralService, ShopService } from 'src/app/lib/services';
import { environment } from '../../environments/environment';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { find, first } from 'lodash'
import {MatSnackBar} from '@angular/material/snack-bar';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { Router } from '@angular/router';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { EditMessageComponent } from './edit-message/edit-message.component';
import Notiflix from "notiflix";
import { DatePipe } from '@angular/common'
import { OrderFormComponent } from './order-form/order-form.component';
import { OrderTermsComponent } from './order-terms/order-terms.component';
import { MessagingService } from '../lib/services';
import { MatAccordion } from '@angular/material/expansion';

@Component({
  selector: 'app-cart-details',
  templateUrl: './cart-details.component.html',
  styleUrls: ['./cart-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CartDetailsComponent implements OnInit, OnDestroy {
  customerFrm: FormGroup;
  @Output() public showDetails = new EventEmitter();
  @ViewChild(MatAccordion) accordion: MatAccordion;
  cart$: Observable<Cart[]>;
  total:number = 0;
  grandTotal:number = 0;
  todayDate:Date = new Date();

  panelOpenState:boolean = false;
  environment = environment;
  deliveries: any;
  shop$:Observable<Shop>;
  selectedLocation: ShopDelivery;
  mapUrl: string = '';
  loc : any =null;

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
    public datepipe: DatePipe,
    private messagingService: MessagingService) {
    cartService.shopKey = environment.shopKey;
  }

  updateCart(cart: Cart, action: string='+'){
    const itm =Object.assign({}, cart);
    itm.qty = 1;
    if(this.cartSubScr) this.cartSubScr.unsubscribe();
    this.cartSubScr = this.cartService.updateCart(itm, action).subscribe();
  }

  sendToShop(el: HTMLElement){

    // if(!this.f.selectedLocation.value?.id){
    //   //this.matSnackBar.open('Please choose a delivery location.', 'close');
    //   el.scrollIntoView({behavior:"smooth"});
    //   return;
    // }

    if(!this.f.delivery_date.value){
      this.f.is_delivery_date.setValue(false);
    }
    Notiflix.Loading.Arrows();
    this.sentToShop = this.cart$.pipe(mergeMap(cart=>{
      if(!cart) {
        console.log("no cart exists")
        return empty();
      }

      return this.shop$.pipe(mergeMap(shop=>{
        if(!shop) {
          console.log("no shop exists");
          return empty();
        }



        const postData = {
          cart: cart,
          name: this.f.name.value,
          note: this.f.note.value,
          email: this.f.email.value,
          phone: this.f.phone.value,
          address: this.f.address.value,
          pin: this.f.pin.value,
          selectedLocation: this.f.selectedLocation.value,
          grad_total: this.grandTotal,
          loc :this.loc,
          delivery_date: this.f.delivery_date.value,
          token: null
        }

        return this.messagingService.getToken().pipe(mergeMap(tkn=>{
          postData.token = (tkn) ? tkn : '';
          return this.cartService.createOrder(postData).pipe(mergeMap((orderRes : ShopOrder)=>{
            if(!orderRes) return empty();
            return this.breakpointObserver.observe([
              Breakpoints.Handset,
              Breakpoints.Tablet
            ]).pipe(map(bp =>{
              let txt = `%0a‎ Order from *${postData.name}*`;

              txt += `%0a‎ Order: *${encodeURIComponent(`#${orderRes.id}`)}* ( ${cart.length} ${ (cart.length > 1) ? 'items' : 'item' } )`;
              if(postData.phone){
                txt += `%0a‎ Phone: ${encodeURIComponent(postData.phone)}  `;
              }
              cart.map((itm, idx)=>{
                txt += `%0a‎ *${encodeURIComponent(itm.product.name)}* `;
                if(itm.message){
                  txt += `%0a‎ Message: ${encodeURIComponent(itm.message)} `;
                }
                txt += `%0a‎ Varient Name: ${encodeURIComponent(itm.product.shop_product_selected_variant.name)} `;
                txt += `%0a‎ Quantity: ${encodeURIComponent(itm.qty)} `;
                txt += `%0a‎ Price: ₹ *${encodeURIComponent(itm.price)}* `;
                txt += `%0a‎ ============== `;
              });
              //txt += `%0a‎ ${ cart.length }  ${ (cart.length > 1) ? 'items' : 'item' } `;

              if(postData.delivery_date){
                let deliveryDate = this.datepipe.transform(this.f.delivery_date.value, 'dd/MM/yyyy');
                let minute;
                if(this.f.hour.value){
                  minute = (this.f.minute.value) ? ("0" + this.f.minute.value).slice(-2) : '00';
                }
                deliveryDate = `${deliveryDate} ${ (this.f.hour.value) ? `${("0" + this.f.hour.value).slice(-2) }:` :'' }${ (minute) ? `${minute}` : '' }${(this.f.hour.value) ? this.f.ampm.value : ''}`
                txt += `%0a‎ Delivered On: ${encodeURIComponent(deliveryDate)}  `;
              }

              if(postData.note){
                txt += `%0a‎ Order Note: ${encodeURIComponent(postData.note)}  `;
              }



              txt += `%0a‎ Delivery Point: ${encodeURIComponent(postData.selectedLocation.name)} `;
              if(postData.selectedLocation.need_cust_loc){
                txt += `%0a‎ Address: ${encodeURIComponent(postData.address)} `;
                txt += `%0a‎ Pin: ${encodeURIComponent(postData.pin)} `;
              }
              if(postData.selectedLocation.charge){
                txt += `%0a‎ Delivery Charge: ₹ ${encodeURIComponent(postData.selectedLocation.charge)} %0a `;
              }
              let locUrl= null;
              if(postData.loc?.lat && postData.loc?.lon){
                locUrl = `https://www.google.com/maps/search/?api=1&query=${postData.loc.lat},${postData.loc.lon}`;
                locUrl = encodeURIComponent(locUrl);
              }
              if(locUrl)
                txt += `%0a‎ Location: ${locUrl} %0a`;

              txt += `%0a‎ Grand Total: ₹ *${this.grandTotal}* %0a`;
              txt += `%0a‎ ============== %0a`;
              txt += `%0a‎ *Order confirmation through reply/call* %0a`;

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
        }))
      }));

    })).subscribe(res=>{
      localStorage.removeItem(`${environment.shopKey}-cart`);
      window.location.href = res.url;
      Notiflix.Loading.Remove();
    }, error=>{

      Notiflix.Loading.Remove();

      if(error.status == 422){

        if(!this.f.selectedLocation.value?.need_cust_loc){
          let selectedLocation = this.f.selectedLocation.value;
          if(selectedLocation){
            selectedLocation.isOpened = (selectedLocation.isOpened) ? selectedLocation.isOpened : true;
          }
          this.f.selectedLocation.setValue(selectedLocation);
        }


        for(let result in this.customerFrm.controls){
          if(error.error.errors[result]){
            this.customerFrm.controls[result].markAsTouched();
            this.customerFrm.controls[result].setErrors({ error: error.error.errors[result] });
          }else{
            this.customerFrm.controls[result].setErrors(null);

          }
        }

        if(this.customerFrm.invalid){
          document.getElementById('fullName').focus();
          el.scrollIntoView({behavior:"smooth"});


        }

      }

    });




  }



  deleteItem(itm: Cart){
    itm.qty = 0;
    if(this.cartSubScr) this.cartSubScr.unsubscribe();
    this.cartSubScr = this.cartService.updateCart(itm, '++').subscribe(res=>{
      this.matSnackBar.open(`${itm.product.name} - ${itm.product.shop_product_selected_variant.name} successfully removed`, 'close');
    });
  }

  changeLocation(loc: ShopDelivery){
    if(!loc) return;
    if(loc.min_amount && this.grandTotal < loc.min_amount){
      this.matSnackBar.open(`Sorry you cant choose ${loc.name} as your delivery. Because it has miinum order amount is ${loc.min_amount}`, 'close');
      return;
    }
    this.selectedLocation = loc;
    if(this.selectedLocation?.charge){
      this.grandTotal = this.total + this.selectedLocation?.charge;
    }else{
      this.grandTotal = this.total;
    }


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
                this.matSnackBar.open('Location Permission denied.', 'close');
              break;
              case 2:
                this.matSnackBar.open('Sorry your position is unavailable.', 'close');
              break;
              case 3:
                this.matSnackBar.open('Sorry your position request was timeout. Please try again.', 'close');
              break;
              default:
                this.matSnackBar.open('Sorry unexpected error occur.', 'close');
              break;
            }
      })



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
    this.shop$ = this.shopService.aShop.pipe(tap(res=>{
      if(res){
        this.deliveries = res?.shop_delivery.reduce(function (r, a) {
          let idx = (a.charge) ? 'paid': 'free';
          r[idx] = r[idx] || [];
          r[idx].push(a);
          return r;
        }, Object.create(null));
      }

    }));
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
        this.matSnackBar.open('Your cart is empty.', 'close');
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
      name: [null, []],
      note: [null, []],
      email: [null, []],
      phone: [null, []],
      address: [null, []],
      pin: [null, []],
      delivery_date: [null, []],
      is_delivery_date:[ false, []],
      selectedLocation: [null, []],
      terms: [null, []]
    });

    this.f.selectedLocation.valueChanges.subscribe(res=>{
      if(res?.min_amount && this.grandTotal < res?.min_amount){
        this.f.selectedLocation.setErrors({
          error: `${res.name} need atleast ₹ ${res?.min_amount} to delivery.`
        });
      }

      if(res?.charge && this.f.selectedLocation.valid){
        this.grandTotal = this.total + res?.charge;
      }else{
        this.grandTotal = this.total;
      }

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
