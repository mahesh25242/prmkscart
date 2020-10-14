import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModuleModule } from '../../shared-module/shared-module.module';
import {  AdminRoutingModule } from './admin-routing.module';
import { AdminHomeComponent } from './admin-home.component';
import { DashBoardComponent } from './dash-board/dash-board.component';
import { EditProfileComponent } from './edit-profile/edit-profile.component';

@NgModule({
  declarations: [AdminHomeComponent, DashBoardComponent, EditProfileComponent,  ],
  imports: [
    CommonModule,
    SharedModuleModule,
    AdminRoutingModule,

  ],
  providers:[

  ]
})
export class AdminModule { }
