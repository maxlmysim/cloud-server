import React, {useEffect, useState} from "react";
import Navbar from "./navbar/Navbar";
import "./app.css"
import { Redirect, Route, Switch} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {auth} from "../actions/user";
import Disk from "./disk/Disk";
import App1 from "./test/app1";
import Regisration from "./authorization/Regisration";
import Login from "./authorization/Login";

function App() {
    const [isLoading, setIsLoading] = useState(true)
    const isAuth = useSelector(state => state.user.isAuth)
    const dispatch = useDispatch()

    useEffect(() => {
        const authenticate = async () => {
            await dispatch(auth());
            setIsLoading(false);
        };
        authenticate();
    }, [dispatch]);


    if (isLoading) {
        return <></>;
    }

    return (
            <div className="app">
                <Navbar/>

                <div className="container">
                    {isAuth
                        ? <Switch>
                            <Route exact path='/' component={Disk}/>
                            <Route path='/test' component={App1}/>
                            <Redirect to='/'/>
                        </Switch>
                        : <Switch>
                            <Route path='/register' component={Regisration}/>
                            <Route path='/login' component={Login}/>
                            <Redirect to='/login'/>
                        </Switch>
                    }

                </div>
            </div>
    );
}

export default App