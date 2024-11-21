import React, {useState} from 'react';
import Input from "../../utils/input/Input";
import './authorization.css';
import {register} from "../../actions/user";
import {useHistory} from "react-router-dom";

const Regisration = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const history = useHistory();

    const handlerRegister = async () => {
        const result = await register(email, password);
        if (result) {
            history.push('/login')
        }
    }

    return (
        <div className='authorization'>
            <h1>Regisration</h1>
            <div className="authorization__header"></div>
            <Input value={email} setValue={setEmail} type='text' placeholder='Email...'/>
            <Input value={password} setValue={setPassword} type='password' placeholder='Password...'/>
            <button className='authorization__btn' onClick={handlerRegister}>Login</button>

        </div>
    )
};

export default Regisration;