import {
    combineLatest,
    fromEvent,
    Observable,
    Subscription,
    concat,
    defer,
    of
  } from "rxjs";
  import {
    debounceTime,
    finalize,
    map,
    shareReplay,
    startWith,
    withLatestFrom,
    distinctUntilChanged
  } from "rxjs/operators";
  import { AbstractControl } from "@angular/forms";
  import * as isEqual from "fast-deep-equal";

  export function dirtyCheck<U>(source: Observable<boolean>=null) {


    let subscription: Subscription;
    let isDirty = false;

    const isDirty$ = source.pipe(
      finalize(() => subscription.unsubscribe()),
      startWith(false),
      shareReplay({ bufferSize: 1, refCount: true })
    );

    subscription = fromEvent(window, "beforeunload")
      .pipe(withLatestFrom(isDirty$))
      .subscribe(([event, isDirty]) => {
        console.log(event, isDirty)
       return isDirty && (event.returnValue = false)
      });

    return isDirty$;
  }
