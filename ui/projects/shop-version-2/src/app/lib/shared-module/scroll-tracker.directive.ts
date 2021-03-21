import { Directive, Output, EventEmitter, HostListener, ElementRef } from '@angular/core';

@Directive({
  selector: '[appScrollTracker]'
})
export class ScrollTrackerDirective {
  @Output() scrollingFinished = new EventEmitter<void>();

  emitted = false;
  private scroll: number;

  constructor(private el: ElementRef) {  }


  @HostListener("elementScrolled", [])
  onScroll(): void {
    console.log("as")
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight && !this.emitted) {
      this.emitted = true;
      this.scrollingFinished.emit();
    } else if ((window.innerHeight + window.scrollY) < document.body.offsetHeight) {
      this.emitted = false;
    }
  }
}
