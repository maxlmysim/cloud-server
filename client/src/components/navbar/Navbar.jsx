import React, {useRef} from 'react';
import Logo from '../../assets/img/navbar-logo.svg'
import './navbar.css'
import {NavLink} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {logOutUser} from "../../reducers/userReducer";
import avatarLogo from '../../assets/img/avatar.svg'
import {uploadAvatar} from "../../actions/user";
import {SERVER_URL} from "../../config";

const Navbar = () => {
    const isAuth = useSelector(state => state.user.isAuth)
    const user = useSelector(state => state.user.currentUser)
    const dispatch = useDispatch()
    const inputFileRef = useRef(null);
    const avatar = user.avatar ? `${SERVER_URL}${user.avatar}` : avatarLogo


    function handleFileChange(event) {
        const file = event.target.files[0];
        dispatch(uploadAvatar(file))
    }

    return (
        <div className="navbar">
            <div className="container">
                <img src={Logo} className='navbar__logo' alt=""/>
                <div className="navbar__header">MERN CLOUD</div>
                {!isAuth &&
                    <>
                        <div className="navbar__login">
                            <NavLink to='/login'>Login</NavLink>
                        </div>
                        <div className="navbar__registation">
                            <NavLink to='/register'>Register</NavLink>
                        </div>
                    </>
                }
                {isAuth &&
                    <div className="navbar__login" onClick={() => dispatch(logOutUser())}>
                        Log out
                    </div>
                }
                {isAuth && <img src={avatar} className="navbar__avatar" alt="" onClick={() => inputFileRef.current.click()}/>}
                {isAuth && <input type="file" ref={inputFileRef}
                                  onChange={handleFileChange}
                                  style={{display: 'none'}}/>}
            </div>
        </div>
    );
};

export default Navbar;