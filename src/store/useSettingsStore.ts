import { create } from 'zustand';
import { UserSettings, UnitSystem } from '../types';
import { settingsService } from '../services/settingsService';

interface SettingsState {
    settings: UserSettings | null;
    loading: boolean;
    fetchSettings: () => Promise<void>;
    updateUnitSystem: (system: UnitSystem) => Promise<void>;
    updateDefaultMetrics: (metricIds: number[]) => Promise<void>;
    setSettings: (settings: UserSettings) => void;
}

export const useSettingsStore = create<SettingsState>((set, get) => ({
    settings: null,
    loading: false,
    setSettings: (settings: UserSettings) => set({ settings }),
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
            const current = get().settings;
            if (current) {
                set({ settings: { ...current, defaultJournalMetricIds: metricIds } });
            }
        } catch (error) {
            console.error('Failed to update default metrics', error);
            throw error;
        }
    }
}));
