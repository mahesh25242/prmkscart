import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SettingService {
  isMaintanance$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  constructor() { }


}
