import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/lib/services';
import { Observable } from 'rxjs';
import { User } from 'src/app/lib/interfaces';
import {faEdit } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-dash-board',
  templateUrl: './dash-board.component.html',
  styleUrls: ['./dash-board.component.scss']
})
export class DashBoardComponent implements OnInit {
  faEdit = faEdit;



  constructor(private userSerivce: UserService) { }

  ngOnInit(): void {

  }

}
