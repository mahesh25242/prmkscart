import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatCarousel, MatCarouselComponent } from '@ngmodule/material-carousel';
import { Observable } from 'rxjs';
import { GeneralService } from '../lib/services';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  direction = "";
  slides$: Observable<[{image: string}]>;
  constructor(private route: ActivatedRoute,
    private generalService: GeneralService) { }


  onSwipe(event) {
    const x =
      Math.abs(
   event.deltaX) > 40 ? (event.deltaX > 0 ? "Right" : "Left") : "";
    const y =
      Math.abs(
   event.deltaY) > 40 ? (event.deltaY > 0 ? "Down" : "Up") : "";

       this.direction +=
   `You swiped in <b> ${x} ${y} </b> direction <hr>`;
     }

  ngOnInit(): void {
    this.slides$ = this.generalService.getAllBanners();
  }

}
