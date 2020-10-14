import React, {  useState, useEffect } from "react";
import { of, pipe } from 'rxjs';
import { map, catchError, mergeMap } from 'rxjs/operators';
import config from '../config';
import { login, authUser, loggedUser } from '../services/index';


  
const Login = () =>{  
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    
    
      

    const handleSubmit = (event) =>{                
        event.preventDefault();
        login(username, password).pipe(mergeMap(res=>{
            return authUser()
        })).subscribe(res=>{
            $('#loginPopup').modal('hide')
        }, err=>{
            setError({
                message: 'invalid credentials'
            });
        });

    }

    const [user, setUser] = useState('');
 
    useEffect(() => {
      loggedUser.asObservable().subscribe(setUser)
    }, []);
    
    return (<>
    {
        !user &&  <button type="button" className="btn btn-primary" data-toggle="modal" data-target="#loginPopup">
            Login
        </button>
    }
       
       
        <div className="modal fade" id="loginPopup" data-backdrop="static" tabindex="-1" role="dialog" aria-labelledby="loginPopupLabel" aria-hidden="true">
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="loginPopupLabel">Modal title</h5>
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        {
                            error && <div className="alert alert-warning">{error.message}</div>
                        }
                        <form onSubmit={handleSubmit}>
                            <div>
                                <label>Email/Mobile</label>
                                <input type="text" className="form-control"
                                onChange={e => setUsername(e.target.value)} value={username} />
                            </div>
                            <div>
                                <label>Password</label>
                                <input type="password" className="form-control" 
                                onChange={e => setPassword(e.target.value)} value={password} />
                            </div>
                            <button className="btn btn-primary">Login</button>
                            <a href="javascript:{}">Forgot Password</a>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </>);
}

export default Login;
