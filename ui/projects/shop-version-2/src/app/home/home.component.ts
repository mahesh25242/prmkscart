import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatCarousel, MatCarouselComponent } from '@ngmodule/material-carousel';
import { Observable } from 'rxjs';



@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent implements OnInit {
  direction = "";

  constructor(private route: ActivatedRoute,
    ) { }


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

  }

}
