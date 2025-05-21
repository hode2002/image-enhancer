import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { Clerk } from '@clerk/clerk-js';
import { auth } from '@clerk/nextjs/server';

const clerk = new Clerk(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY!);

const http = axios.create({
    headers: {
        'Content-Type': 'application/json',
    },
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    withCredentials: true,
});

http.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
        try {
            if (typeof window !== 'undefined') {
                await clerk.load();

                const token = await clerk.session?.getToken();
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
            } else {
                const { getToken } = await auth();
                const token = await getToken();
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
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

http.interceptors.response.use(
    response => response,
    async (error: AxiosError) => {
        if (error.response?.status === 401) {
            console.error('Unauthorized request:', error);
        }
        return Promise.reject(error);
    },
);

export { http };
export default http;
