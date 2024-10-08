import axios, {AxiosError, InternalAxiosRequestConfig} from 'axios';
import {authStore} from '../store/AuthStore.ts';
import {marketStore} from '../store/MarketStore.ts';

// @ts-expect-error
const base_url = import.meta.env.VITE_BASE_URL;

const axiosJson = axios.create({
    baseURL: base_url,
    headers: {
        'Content-Type': 'application/json'
    }
});

axiosJson.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = authStore.token;
        const userId = authStore.user?.userId;
        const currentMarketId = marketStore.currentMarket?.marketId;

        config.params = config.params || {};
        if (userId) config.params.userId = userId;
        if (currentMarketId) config.params.currentMarketId = currentMarketId;

        if (token) {
            config.headers = config.headers || {};
            config.headers['authorization'] = `Bearer ${token}`;
            // console.log('Token added to request');
        } else {
            // console.log('No token available');
        }

        return config;
    },
    (error: AxiosError) => Promise.reject(error),
);

export default axiosJson;
