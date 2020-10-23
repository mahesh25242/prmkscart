import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
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
  constructor(private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: Cart,
    public dialogRef: MatDialogRef<EditMessageComponent>,
    private matSnackBar: MatSnackBar,
    private cartService: CartService) { }

  get f(){ return this.editMessageFrm.controls}

  updateMessage(){
    this.data.message = this.f.message.value;
    this.cartSubScr = this.cartService.updateCart(this.data, '++').subscribe(res=>{
      this.matSnackBar.open('Message updated successfully.');
      this.dialogRef.close();
    });



  }
  ngOnInit(): void {
    this.editMessageFrm = this.formBuilder.group({
      message: [this.data.message, []]
    });
  }

  ngOnDestroy(){
    if(this.cartSubScr){
      this.cartSubScr.unsubscribe();
    }
  }
}
