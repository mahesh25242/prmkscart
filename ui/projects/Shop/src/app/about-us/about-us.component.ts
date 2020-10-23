import { Component, OnInit } from '@angular/core';
import { GeneralService } from 'src/app/lib/services';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.scss']
})
export class AboutUsComponent implements OnInit {

  constructor(private generalService: GeneralService) { }

  ngOnInit(): void {
    this.generalService.bc$.next({
      siteName: environment.siteName,
      title: 'About Us',
      url:'',
      backUrl: null
    });
  }

}
