import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from 'src/app/lib/interfaces';
import * as _ from 'lodash';
import { UserService as uservices} from 'src/app/lib/services';
@Injectable({
  providedIn: 'root'
})
export class UserService {


  constructor(public usvs: uservices) { }



  signIn(user: any=null){
    return  this.usvs.signIn(user);
  }


  refreshToken(){
    return this.usvs.refreshToken();
  }


  setUserLogin(postData:any= null){
    return this.usvs.setUserLogin(postData);
  }

  signOut(){
    return this.usvs.signOut();
  }


  authUser():Observable<User>{
    return this.usvs.authUser();
  }

  updateProfile(postData:any= null){
    return this.usvs.updateProfile(postData);
  }

  updateAvatar(postData:any= null){
    return this.usvs.updateAvatar(postData);
  }





}
