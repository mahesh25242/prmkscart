import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashBoardComponent } from './dash-board/dash-board.component';
import { AdminAuthGuard, NegateAuthGuard } from '../../lib/guard';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { AdminHomeComponent } from './admin-home.component';





const routes: Routes = [
  {
    path: '',
    component: AdminHomeComponent,
    canActivate: [AdminAuthGuard],
    children:[
      {
        path: '',
        component: DashBoardComponent,
      },
      {
        path: 'edit-profile',
        component: EditProfileComponent,
      },
      {
        path: 'shops',
        loadChildren: () => import('./shops/shop.module').then(m => m.ShopModule),
        canActivate: [AdminAuthGuard],

      },
    ]
  },




];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
