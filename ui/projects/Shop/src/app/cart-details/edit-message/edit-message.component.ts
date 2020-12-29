import { Component, EventEmitter, Inject, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { Cart } from 'src/app/lib/interfaces';
import {MatSnackBar} from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { CartService } from 'src/app/lib/services';

@Component({
  selector: 'app-edit-message',
  templateUrl: './edit-message.component.html',
  styleUrls: ['./edit-message.component.scss']
})
export class EditMessageComponent implements OnInit, OnDestroy {
  editMessageFrm: FormGroup;
  cartSubScr: Subscription;
  //@Output() onUpdated = new EventEmitter();

  constructor(private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: Cart,
    public dialogRef: MatDialogRef<EditMessageComponent>,
    private matSnackBar: MatSnackBar,
    private cartService: CartService) { }

  get f(){ return this.editMessageFrm.controls}

  updateMessage(){
    this.data.message = this.f.message.value;
    this.cartSubScr = this.cartService.updateCart(this.data, '++').subscribe(res=>{
      if(this.data.message)
        this.matSnackBar.open('Message updated successfully.', 'close');
      else
        this.matSnackBar.open('Removed message successfully.', 'close');
//      this.onUpdated.emit();
      this.dialogRef.close();
    });
  }
  ngOnInit(): void {
    this.editMessageFrm = this.formBuilder.group({
      message: [this.data.message, [Validators.required]]
    });
  }

  ngOnDestroy(){
    if(this.cartSubScr){
      this.cartSubScr.unsubscribe();
    }
  }
}
