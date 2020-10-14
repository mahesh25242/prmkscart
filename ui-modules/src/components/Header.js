import React, { Component, useState, useEffect } from "react";
import { authUser,loggedUser } from '../services';


const Header = () =>{
 
  const [user, setUser] = useState('');
 
  useEffect(() => {
    authUser().subscribe();
    loggedUser.asObservable().subscribe(setUser)
  }, []);
  return <>
   {
     user && <div>
       <a href="">Products</a>
       <a href="">Categories</a>
       { user.fname }
     </div>
   }
  </>
}
export default Header;
