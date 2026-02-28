import apiClient from './apiClient';
import { JournalEntryResponse, JournalEntryType, JournalBatch, Page } from '../types';

export const journalService = {
    getEntries: async (): Promise<JournalEntryResponse[]> => {
        const response = await apiClient.get<JournalEntryResponse[]>('/api/journal');
        return response.data;
    },

    getEntry: async (id: number): Promise<JournalEntryResponse> => {
        const response = await apiClient.get<JournalEntryResponse>(`/api/journal/${id}`);
        return response.data;
    },

    getBatches: async (page: number = 0, size: number = 10): Promise<Page<JournalBatch>> => {
        const response = await apiClient.get<Page<JournalBatch>>(`/api/journal/batches?page=${page}&size=${size}`);
        return response.data;
    },

    getBatch: async (id: number): Promise<JournalBatch> => {
        const response = await apiClient.get<JournalBatch>(`/api/journal/batches/${id}`);
        return response.data;
    },

    createEntry: async (entry: {
        entryType: JournalEntryType,
        metricId?: number,
        value?: number,
        unit?: string,
        notes?: string,
        entryDate: string
    }): Promise<JournalEntryResponse> => {
        const response = await apiClient.post<JournalEntryResponse>('/api/journal', entry);
        return response.data;
    },

    createBatch: async (batch: {
        entries: Array<{
            metricId: number;
            value: number;
            unit: string;
            notes?: string;
        }>;
        entryDate: string;
        notes?: string;
    }): Promise<JournalBatch> => {
        const response = await apiClient.post<JournalBatch>('/api/journal/batch', batch);
        return response.data;
    },

    deleteEntry: async (id: number): Promise<void> => {
        await apiClient.delete(`/api/journal/${id}`);
    }
};
