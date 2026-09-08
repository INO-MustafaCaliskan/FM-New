import axios from 'axios';
import https from 'https';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';

// Create a reusable HTTPS agent (ignore self‑signed certs in dev)
const agent = new https.Agent({
    rejectUnauthorized: false,
});

// Initialise the axios instance without auth headers. They will be added
// dynamically in a request interceptor so that changes to cookies after a
// login/logout are respected.
const client = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    httpsAgent: agent,
});

// Request interceptor: attach the latest token and sessionId from cookies.
client.interceptors.request.use((config) => {
    const token = Cookies.get('accessToken');
    const sessionId = Cookies.get('sessionId');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    } else {
        delete config.headers.Authorization;
    }
    if (sessionId) {
        config.headers.sessionId = sessionId;
    } else {
        delete config.headers.sessionId;
    }
    return config;
});

// Add a response interceptor to handle 401 Unauthorized errors
client.interceptors.response.use(
    (response) => {
        // If the response is successful, just return it
        return response;
    },
    (error) => {
        // Log the error for debugging purposes
        console.error('Axios error interceptor:', error);

        // Handle 401 Unauthorized errors globally
        if (error.response?.status === 401 && error.config?.baseURL === process.env.NEXT_PUBLIC_API_URL) {
            // Optionally clear authentication cookies
            Cookies.remove('accessToken');
            Cookies.remove('sessionId');
            window.location.href = '/sign-in';
        } else if (error.response?.status === 400) {
            // Show server‑provided error message for bad requests
            toast.error(error.response.data?.message || 'Bad request');
        }

        // Reject the promise with the error object so callers can handle it further
        return Promise.reject(error);
    }
);

export default client;