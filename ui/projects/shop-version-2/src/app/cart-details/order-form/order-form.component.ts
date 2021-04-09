import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { ShopDelivery } from 'src/app/lib/interfaces';


@Component({
  selector: 'app-order-form',
  templateUrl: './order-form.component.html',
  styleUrls: ['./order-form.component.scss']
})
export class OrderFormComponent implements OnInit {
  @Input() customerFrm: FormGroup;
  @Input() isHomeDelivery: boolean;
  @Input() mapUrl: string;
  @Input() deliveryloc: {paid: ShopDelivery[]};
  todayDate:Date = new Date();
  isSlideChecked: boolean = false;
  constructor(
    private formBuilder: FormBuilder
    ) { }

  get f() {
    return this.customerFrm.controls;
  }

  triggerPicker(picker: any){
    if(this.f.is_delivery_date.value){
      picker.open();
    }else{
      this.f.delivery_date.setValue(null);
    }
  }
  ngOnInit(): void {

  }

  chekValidation(){
    this.f.name.markAsTouched();
    this.f.phone.markAsTouched();
    if(this.isHomeDelivery){

      this.f.address.setValidators([Validators.required]);
      this.f.pin.setValidators([Validators.required]);
      this.f.selectedLocation.setValidators([Validators.required]);
      if(!this.f.selectedLocation.value){
        this.f.selectedLocation.setValue(undefined);
      }
      this.f.address.markAsTouched();
      this.f.pin.markAsTouched();
      this.f.selectedLocation.markAsTouched();
    }else{
      this.f.address.clearValidators();
      this.f.pin.clearValidators();
      this.f.selectedLocation.clearValidators();
      this.f.pin.updateValueAndValidity();
      this.f.address.updateValueAndValidity();
      this.f.selectedLocation.updateValueAndValidity();
    }
    if(this.f.is_delivery_date.value && !this.f.delivery_date.value){
      this.f.is_delivery_date.setValue(false);
    }


    }



}
