import { Component, OnInit } from '@angular/core';
import { GeneralService } from 'src/app/lib/services';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-page-not-found',
  templateUrl: './page-not-found.component.html',
  styleUrls: ['./page-not-found.component.scss']
})
export class PageNotFoundComponent implements OnInit {

  constructor(private generalService: GeneralService) { }

  ngOnInit(): void {
    this.generalService.bc$.next({
      siteName: environment.siteName,
      title: 'Home',
      url:'',
      backUrl: '/'
    });
  }

}
