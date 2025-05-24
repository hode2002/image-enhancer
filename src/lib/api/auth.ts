import http from '@/lib/http';
import { AxiosResponse } from 'axios';

const prefix = '/auth';

export const login = async (): Promise<AxiosResponse> => {
    return http.post(`${prefix}/login`);
};
