import config from  './config';
import React from "react";
import ReactDOM from "react-dom";
import Header from "./components/Header";
import Products from "./components/Products";
import Login from "./components/Login";


const domIds = [
                {
                    dom: `${config.domPrefix}-Header`,
                    component: <Header />
                },
                {
                    dom: `${config.domPrefix}-Login`,
                    component: <Login />
                },       
                {
                    dom: `${config.domPrefix}-Products`,
                    component: <Products />
                }        
            ];

domIds.map(r =>{    
    const wrapper = document.getElementById(`${r.dom}`);
    wrapper ? ReactDOM.render(r.component, wrapper) : false;    
})

