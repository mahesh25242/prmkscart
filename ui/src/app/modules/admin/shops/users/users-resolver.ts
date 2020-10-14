import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot  } from '@angular/router';
import { empty, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserService } from '../../../../lib/services';

@Injectable()
export class UsersResolver implements Resolve<any> {

  constructor(
    private userService: UserService) { }

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    let pageTitle:string;
    switch(route.data.type){
      case 'teacher':
        pageTitle = 'Teachers';
      break;
      case 'student':
        pageTitle = 'Students';
      break;
    }

    return this.userService.getAllUser(`admin/${route.data.type}`).pipe(map(users =>{
      return {
        pageTitle: pageTitle,
        data: users,
        type: route.data.type
      }
    }));


  }
}
