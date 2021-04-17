import { ChangeDetectionStrategy, Component, Input, OnChanges, OnInit } from '@angular/core';
import { ControlContainer, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { ShopDelivery } from 'src/app/lib/interfaces';


@Component({
  selector: '[formGroup] app-order-form,[formGroupName] app-order-form',
  templateUrl: './order-form.component.html',
  styleUrls: ['./order-form.component.scss']
})
export class OrderFormComponent implements OnInit {
  customerFrm: FormGroup;
  @Input() shopDelivery: ShopDelivery;
  @Input() mapUrl: string;
  @Input() deliveryloc: {paid: ShopDelivery[]};
  todayDate:Date = new Date();
  isSlideChecked: boolean = false;
  constructor(
    private formBuilder: FormBuilder,
    private controlContainer: ControlContainer
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
    this.customerFrm = <FormGroup>this.controlContainer.control;


    this.f.selectedLocation.setValue(this.shopDelivery)
  }



}
