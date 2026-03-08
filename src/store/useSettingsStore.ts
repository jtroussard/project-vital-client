import { create } from 'zustand';
import { UserSettings, UnitSystem } from '../types';
import { settingsService } from '../services/settingsService';

interface SettingsState {
    settings: UserSettings | null;
    loading: boolean;
    fetchSettings: () => Promise<void>;
    updateUnitSystem: (system: UnitSystem) => Promise<void>;
    updateDefaultMetrics: (metricIds: number[]) => Promise<void>;
}

export const useSettingsStore = create<SettingsState>((set, get) => ({
    settings: null,
    loading: false,
    fetchSettings: async () => {
        set({ loading: true });
        try {
            const data = await settingsService.getSettings();
            set({ settings: data, loading: false });
        } catch (error) {
            console.error('Failed to fetch settings', error);
            set({ loading: false });
        }
    },
    updateUnitSystem: async (system: UnitSystem) => {
        try {
            const updated = await settingsService.updateSettings({ preferredUnitSystem: system });
            set({ settings: updated });
        } catch (error) {
            console.error('Failed to update unit system', error);
            throw error;
        }
    },
    updateDefaultMetrics: async (metricIds: number[]) => {
        try {
            await settingsService.updateDefaultMetrics(metricIds);
            // Re-fetch to get updated state (or we could assume the backend returns the full object if we update the service)
            // Based on UserSettingsController, it returns UserSettings.
            // Let's check settingsService.ts again.
            const data = await settingsService.getSettings();
            set({ settings: data });
        } catch (error) {
            console.error('Failed to update default metrics', error);
            throw error;
        }
    }
}));
