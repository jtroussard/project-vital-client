import axios from 'axios';
import { supabase } from './supabaseClient';

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL || '/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor to add JWT to every request
apiClient.interceptors.request.use(async (config) => {
    const { data: { session } } = await supabase.auth.getSession();

    if (session?.access_token) {
        config.headers.Authorization = `Bearer ${session.access_token}`;
    }

    return config;
}, (error) => {
    return Promise.reject(error);
});

export const profileService = {
    getMyProfile: async () => {
        const response = await apiClient.get('/api/profile/me');
        return response.data;
    },

    updateProfile: async (profileData: any) => {
        const response = await apiClient.post('/api/profile/me', profileData);
        return response.data;
    }
};

export default apiClient;
