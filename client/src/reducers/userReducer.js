import {TOKEN} from "../constans/api";

const SET_USER = 'SET_USER'
const LOGOUT_USER = 'LOGOUT_USER'
const UPDATE_USER = 'UPDATE_USER'

const defaultState = {
    currentUser: {},
    isAuth: false,
}

export default function userReducer(state = defaultState, action) {
    switch (action.type) {
        case SET_USER:
            localStorage.setItem(TOKEN, action.payload.token)

            return {
                ...state,
                currentUser: action.payload.user,
                isAuth: true
            }

        case LOGOUT_USER:
            localStorage.removeItem(TOKEN)
            return {
                ...state,
                currentUser: {},
                isAuth: false
            }

        case UPDATE_USER:
            return {
                ...state,
                currentUser: action.payload
            }

        default:
            return state
    }
}

export const setUser = ({user, token}) => ({type: SET_USER, payload: {user, token}})
export const logOutUser = () => ({type: LOGOUT_USER})
export const updateUser = (user) => ({type: UPDATE_USER, payload: user})