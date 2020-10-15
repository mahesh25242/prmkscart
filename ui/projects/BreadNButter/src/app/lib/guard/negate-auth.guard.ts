import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { take, map, catchError } from 'rxjs/operators';
import { UserService } from '../services';
import { User } from 'firebase';
@Injectable({
  providedIn: 'root'
})
export class NegateAuthGuard implements CanActivate {
  constructor(private router: Router, private userService: UserService) { }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      return this.userService.authUser().pipe(
        take(1),
        map((user: User) => {

          if (user) {
            this.router.navigate(['/home']);
            return false;
          }
          return true;
        }),
        catchError((err: Response) => {
          return of(true);
       })
      );
  }

}
