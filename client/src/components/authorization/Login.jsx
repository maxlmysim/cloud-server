import React, {useState} from 'react';
import {login} from "../../actions/user";
import Input from "../../utils/input/Input";
import {useDispatch} from "react-redux";

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useDispatch()

    return (
        <div className='authorization'>
            <h1>Login</h1>

            <div className="authorization__header"></div>
            <Input value={email} setValue={setEmail} type='text' placeholder='Email...'/>
            <Input value={password} setValue={setPassword} type='password' placeholder='Password...'/>
            <button className='authorization__btn' onClick={() => dispatch(login(email, password))}>login</button>

        </div>
    );

};

export default Login;