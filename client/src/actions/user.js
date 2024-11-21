import axios from 'axios';
import {API_URL} from "../config";
import {setUser, updateUser} from "../reducers/userReducer";
import {api} from "../api/axiosInstance";

export const register = async (email, password) => {
    return axios.post(API_URL + '/auth/register/', {email, password})
        .then(response => {
            if (response.status === 200) {
                return response.data
            }
            return false
        })
        .catch(error => {
            console.error("Registration error:", error);
            throw error;
        });
}

export const login = (email, password) => {
    return async (dispatch) => {
        try {
            const response = await axios.post(API_URL + '/auth/login/', {email, password})
                .then(response => response.data)

            dispatch(setUser(response))

            console.log(response)
        } catch (e) {
            console.log(e)
        }

    };
}

export const auth = () => {
    return async (dispatch) => {
        try {
            const response = await axios.get(API_URL + '/auth', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            })

            if (response.status === 200 && response.data.token) {
                dispatch(setUser(response.data))
            } else {
                localStorage.removeItem('token')
            }
        } catch (e) {
            localStorage.removeItem('token')
            console.log(e)
        }

    }
}

export const uploadAvatar = (file) => {
    return async (dispatch) => {
        try {
            const formData = new FormData()

            formData.append('file', file)
            const response = await api.post(API_URL + '/user/avatar', formData)

           dispatch(updateUser(response.data))
        } catch (e) {
            console.log(e)
        }
    }
}
