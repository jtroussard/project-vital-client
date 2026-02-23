import apiClient from './apiClient';
import { UserProfile } from '../types';

export const profileService = {
    getMyProfile: async (): Promise<UserProfile> => {
        const response = await apiClient.get<UserProfile>('/api/profile/me');
        return response.data;
    },

    updateProfile: async (profile: Partial<UserProfile>): Promise<UserProfile> => {
        const response = await apiClient.post<UserProfile>('/api/profile/me', profile);
        return response.data;
    }
};
