import { Component, OnInit } from '@angular/core';
import { GeneralService } from 'src/app/lib/services';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.scss']
})
export class ContactUsComponent implements OnInit {

  constructor(private generalService: GeneralService) { }

  ngOnInit(): void {
    this.generalService.bc$.next({
      siteName: environment.siteName,
      title: 'Contact Us',
      url:'',
      backUrl: null
    });
  }

}
