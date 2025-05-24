import httpClient from './http-client';
import httpServer from './http-server';

const http = typeof window === 'undefined' ? httpServer : httpClient;

export default http;
