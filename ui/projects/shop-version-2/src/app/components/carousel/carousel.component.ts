import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { GeneralService } from '../../lib/services';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss']
})
export class CarouselComponent implements OnInit {
  slides$: Observable<[{image: string}]>;
  constructor(private generalService: GeneralService) { }

  ngOnInit(): void {
    this.slides$ = this.generalService.getAllBanners();
  }

}
