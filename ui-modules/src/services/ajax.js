import { ajax } from 'rxjs/ajax';
import { of, throwError, pipe, BehaviorSubject } from 'rxjs';
import { map, catchError, shareReplay, } from 'rxjs/operators';
import config from '../config';


const header = () =>{
    let token = localStorage.getItem('token');
    if (token) {
      token = JSON.parse(token);
      config.ajax.headers.Authorization =  `${token.token_type} ${token.access_token}`;
    }
    try{
      if(document.head.querySelector("[property~=shop][content]")){
        config.ajax.headers.ShopId = document.head.querySelector("[property~=shop][content]").content;
        return config.ajax.headers;
      }else{
        throw 'shop id is missing in meta data. please add  <meta property="shop" content="**YOUR ID HERE***" />';
      }
      
    }catch(e){
      console.error(e)
    }
   
}
export const post = (url, parm) => ajax({
    url: `${config.baseUrl}/${url}`,
    method: 'POST',
    headers: header(),
    body: parm
  }).pipe(    
    catchError(error => {
      console.log('error: ', error);
      return throwError(error);
    })
  );

  export const getJson = (url) => ajax.getJSON(`${config.baseUrl}/${url}`, header()).pipe(    
    catchError(error => {
      console.log('error: ', error);
      return throwError(error);
    })
  );
  