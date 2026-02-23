import apiClient from './apiClient';
import { JournalEntry } from '../types';

export const journalService = {
    getEntries: async (): Promise<JournalEntry[]> => {
        const response = await apiClient.get<JournalEntry[]>('/api/journal');
        return response.data;
    },

    getEntry: async (id: number): Promise<JournalEntry> => {
        const response = await apiClient.get<JournalEntry>(`/api/journal/${id}`);
        return response.data;
    },

    createEntry: async (entry: Partial<JournalEntry>): Promise<JournalEntry> => {
        const response = await apiClient.post<JournalEntry>('/api/journal', entry);
        return response.data;
    },

    batchCreateEntries: async (entries: Partial<JournalEntry>[]): Promise<JournalEntry[]> => {
        const response = await apiClient.post<JournalEntry[]>('/api/journal/batch', entries);
        return response.data;
    },

    deleteEntry: async (id: number): Promise<void> => {
        await apiClient.delete(`/api/journal/${id}`);
    }
};
