import { httpClient } from '@/lib/http/client';
import { AxiosResponse } from 'axios';

const prefix = '/auth';

export const login = async (): Promise<AxiosResponse> => {
    return httpClient.post(`${prefix}/login`);
};
