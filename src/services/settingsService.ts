import apiClient from './apiClient';
import { UserSettings, UnitSystem } from '../types';

export const settingsService = {
    getSettings: async (): Promise<UserSettings> => {
        const response = await apiClient.get<UserSettings>('/api/settings');
        return response.data;
    },

    updateSettings: async (settings: { preferredUnitSystem: UnitSystem }): Promise<UserSettings> => {
        const response = await apiClient.put<UserSettings>('/api/settings', settings);
        return response.data;
    },

    updateDefaultMetrics: async (metricIds: number[]): Promise<void> => {
        await apiClient.put('/api/settings/default-journal-metrics', metricIds);
    }
};
