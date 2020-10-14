import React, { Component, useState } from "react";
import { ajax } from 'rxjs/ajax';
import { of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import config from '../config';


  
const Products = () =>{  
    
    const users = ajax({
        url: `${config.baseUrl}/oauth/token`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'rxjs-custom-header': 'Rxjs',         
        },
        body: {
            client_id: 2,
            client_secret: config.client_secret,
            grant_type: config.grant_type,
            password: '123456',
            recaptcha: null,
            scope: "",
            username: 'admin@cart.com'
        }
      }).pipe(
        map(response => console.log('response: ', response)),
        catchError(error => {
          console.log('error: ', error);
          return of(error);
        })
      );
      
      users.subscribe();
    return (
        <div>
            Load products
        </div>
    );
}

export default Products;



