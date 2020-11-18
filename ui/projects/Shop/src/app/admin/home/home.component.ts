import { Component, OnInit } from '@angular/core';
import { GeneralService } from 'src/app/lib/services';
import { environment } from '../../../environments/environment';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(private generalService: GeneralService) { }

  ngOnInit(): void {
    this.generalService.bc$.next({
      siteName: environment.siteName,
      title: 'Home',
      url:'',
      backUrl: null
    });

    this.generalService.adminHomeStat().subscribe(res=>{

    });

  }

}
