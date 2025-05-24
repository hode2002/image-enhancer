'use server';

import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { auth } from '@clerk/nextjs/server';

const httpServer = axios.create({
    headers: {
        'Content-Type': 'application/json',
    },
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    withCredentials: true,
});

httpServer.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
        try {
            const { getToken } = await auth();
            const token = await getToken();
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        } catch (error) {
            return Promise.reject(error);
        }
    },
    (error: AxiosError) => {
        return Promise.reject(error);
    },
);

export default httpServer;
