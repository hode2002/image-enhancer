'use client';

import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { Clerk } from '@clerk/clerk-js';

const httpClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

const clerk = new Clerk(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY!);

httpClient.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
        try {
            await clerk.load();
            const token = await clerk.session?.getToken({
                template: process.env.NEXT_PUBLIC_CLERK_TEMPLATE,
            });

            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }

            return config;
        } catch (err) {
            console.error('Error getting token:', err);
            return Promise.reject(err);
        }
    },
    (error: AxiosError) => Promise.reject(error),
);

export { httpClient };
