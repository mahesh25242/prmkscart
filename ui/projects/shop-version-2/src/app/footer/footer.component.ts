import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { GeneralService } from '../lib/services';
@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  environment = environment;
  isAdmin$: Observable<boolean>;
  currentYear: number = new Date().getFullYear();
  constructor(private generalService: GeneralService) { }

  ngOnInit(): void {
    this.isAdmin$ = this.generalService.isAdmin$.asObservable()
  }

}
