import { Injectable } from '@angular/core';
import { CanDeactivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { dirtyCheck } from './dirty-check';


export interface SampleComponentCanDeactivate {
  updateCourseSetup: () => boolean | Observable<boolean>;
}

@Injectable({
  providedIn: 'root'
})
export class DirtyCheckGuard implements CanDeactivate<SampleComponentCanDeactivate> {

  canDeactivate(
    component: SampleComponentCanDeactivate,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState?: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

      return component.updateCourseSetup()
      ? true
      : confirm(
          "WARNING: You have unsaved changes. Press Cancel to go back and save these changes, or OK to lose these changes."
        );
  }

}
