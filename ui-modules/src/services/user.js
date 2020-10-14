import { ajax } from 'rxjs/ajax';
import { of, throwError, pipe, BehaviorSubject } from 'rxjs';
import { map, catchError, shareReplay, } from 'rxjs/operators';
import config from '../config';
import { post, getJson } from './ajax';

export const loggedUser =  new BehaviorSubject(null);

export const login  = (u = '', p = '') =>  post(`oauth/token`, {
        client_id: 2,
        client_secret: config.client_secret,
        grant_type: config.grant_type,
        password: p,
        recaptcha: null,
        scope: "",
        username: u
    }).pipe(map(res=>{
      localStorage.setItem('token', JSON.stringify(res.response));
      return res;
    }));
  
export const authUser = () => {
 
    return getJson(`authUser`).pipe(map((x)=>{
      loggedUser.next(x);
      return x;
    }),
    shareReplay({ bufferSize: 1, refCount: true }),
    catchError((err)=>{
     // console.log(x.status)
     localStorage.removeItem('token');
      loggedUser.next(null);
      return throwError(err);
    })
    )
  }
