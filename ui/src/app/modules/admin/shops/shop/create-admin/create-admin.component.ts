import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Shop } from 'src/app/lib/interfaces';


@Component({
  selector: 'app-create-admin',
  templateUrl: './create-admin.component.html',
  styleUrls: ['./create-admin.component.scss']
})
export class CreateAdminComponent implements OnInit {

  @Input() shop: Shop;
  constructor(public modal: NgbActiveModal,) { }

  ngOnInit(): void {

  }

}
