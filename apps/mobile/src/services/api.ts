import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import config from '../config/env';

const API_URL = config.API_URL;

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(
    async (config) => {
        const token = await AsyncStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            // Handle unauthorized access (e.g., logout user)
            await AsyncStorage.removeItem('token');
            // You might want to trigger a global state update here to redirect to login
        }
        return Promise.reject(error);
    }
);

export const apiService = api;
export default api;
