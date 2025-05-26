import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { auth } from '@clerk/nextjs/server';

const httpServer = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

httpServer.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
        try {
            const { getToken } = await auth();
            const token = await getToken({
                template: process.env.NEXT_PUBLIC_CLERK_TEMPLATE,
            });
            console.log('httpServer', token);

            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        } catch (error) {
            console.error('Error getting server token', error);
        }

        return config;
    },
    (error: AxiosError) => Promise.reject(error),
);

export { httpServer };
