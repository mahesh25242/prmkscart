import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class GeneralService {

  constructor(private http: HttpClient) { }

  sentContact(postData: any = null){
    return this.http.post("/sentContact", postData);
  }
}
