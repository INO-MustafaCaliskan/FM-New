import axios from "axios";
import https from 'https';
import { cookies } from "next/headers";


const agent = new https.Agent({
    rejectUnauthorized: false,
});


const serverClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    httpsAgent: agent
});

// Her istekte çalışan interceptor
serverClient.interceptors.request.use((config) => {
    const token = cookies().get('accessToken')?.value;
    const sessionId = cookies().get('sessionId')?.value;

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    if (sessionId) {
        config.headers.sessionId = sessionId;
    }

    return config;
});

// Dinamik header eklemek için yardımcı fonksiyon
serverClient.setHeaders = (headers) => {
    Object.assign(serverClient.defaults.headers.common, headers);
};

export default serverClient;

