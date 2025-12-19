import axios, { AxiosError, AxiosRequestConfig } from 'axios';

// Force 8080/api for now to fix connection issues
const API_URL = 'http://localhost:8080/api';
// const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

// Create axios instance
const apiClient = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access_token');
        // Send (mock) token to backend so it doesn't complain about missing header immediately
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle errors
apiClient.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
        if (error.response?.status === 401) {
            const token = localStorage.getItem('access_token');
            // If it's a mock token, don't redirect to avoid loop
            if (token && token.startsWith('mock.')) {
                console.warn('API returned 401 for mock token. Avoiding redirect loop.');
                return Promise.reject(error);
            }

            // Real token expired or invalid
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            document.cookie = 'access_token=; path=/; max-age=0';
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default apiClient;

// Helper function for GET requests
export async function get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await apiClient.get<T>(url, config);
    return response.data;
}

// Helper function for POST requests
export async function post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await apiClient.post<T>(url, data, config);
    return response.data;
}

// Helper function for PUT requests
export async function put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await apiClient.put<T>(url, data, config);
    return response.data;
}

// Helper function for PATCH requests
export async function patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await apiClient.patch<T>(url, data, config);
    return response.data;
}

// Helper function for DELETE requests
export async function del<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await apiClient.delete<T>(url, config);
    return response.data;
}
