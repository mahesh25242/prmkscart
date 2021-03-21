import { Component, Inject, Input, OnInit } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { ShopDelivery } from 'src/app/lib/interfaces';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import Notiflix from "notiflix";
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';


export const MY_FORMATS = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'YYYY',
  },
};


@Component({
  selector: 'app-order-form',
  templateUrl: './order-form.component.html',
  styleUrls: ['./order-form.component.scss'],
  providers: [
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ],
})
export class OrderFormComponent implements OnInit {

  todayDate:Date = new Date();

  constructor(public dialogRef: MatDialogRef<OrderFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { customerFrm: FormGroup, selectedLocation: ShopDelivery, mapUrl: string}) { }

  get f() { return this.data.customerFrm.controls; }
  ngOnInit(): void {

  }

  chekValidation(){
    this.f.name.markAsTouched();
    this.f.phone.markAsTouched();
    if(this.data.selectedLocation?.need_cust_loc){
      this.f.address.setValidators([Validators.required]);
      this.f.pin.setValidators([Validators.required]);
      this.f.address.markAsTouched();
      this.f.pin.markAsTouched();
    }else{
      this.f.address.clearValidators();
      this.f.pin.clearValidators();
      this.f.pin.updateValueAndValidity();
      this.f.address.updateValueAndValidity();
    }
    if(this.f.hour.value){
      if(!this.f.minute.value){
        this.f.minute.setValue('00');
      }
      if(!this.f.delivery_date.value){
        this.f.delivery_date.setValue(new Date());
      }
      let datetimeStart = `${this.f.delivery_date.value} ${this.f.hour.value}:${this.f.minute.value}:00 ${this.f.ampm.value}`;
      console.log(datetimeStart);
    }

    if(this.data.customerFrm.valid)
      this.dialogRef.close();
    }



}
