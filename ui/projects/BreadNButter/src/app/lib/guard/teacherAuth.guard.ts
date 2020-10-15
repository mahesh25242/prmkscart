import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable, of, throwError } from 'rxjs';
import { UserService, SettingService } from '../services';
import { map, take, mergeMap, tap, catchError } from 'rxjs/operators';
import { User } from '../interfaces';


@Injectable({
  providedIn: 'root'
})
export class TeacherAuthGuard implements CanActivate {
  constructor(private router: Router, private userService: UserService,
    private settingService: SettingService) { }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

      return this.userService.authUser().pipe(
        take(1),
        map((user: User) => {

          // if (user.role_url !== 'teacher') {
          //   this.router.navigate([`/${user.role_url}`]);
          //   return false;
          // }
          return true;
        }),
        catchError(x => {
          return throwError(x);
        })
      );
     // return this.userService.isAuth();
  }

}
