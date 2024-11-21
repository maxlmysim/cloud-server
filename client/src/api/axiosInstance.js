import axios from 'axios';
import {API_URL} from "../config";
import {TOKEN} from "../constans/api";

export const api = axios.create({
    baseURL: API_URL,
});

export const CancelToken = axios.CancelToken;

api.interceptors.request.use((config) => {
    return {
        ...config,
        headers: {...config.headers, Authorization: `Bearer ${localStorage.getItem(TOKEN)}`},
    };
});