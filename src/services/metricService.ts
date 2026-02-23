import apiClient from './apiClient';
import { Metric, MeasurementType } from '../types';

export const metricService = {
    getMetrics: async (): Promise<Metric[]> => {
        const response = await apiClient.get<Metric[]>('/api/metrics');
        return response.data;
    },

    getMeasurementTypes: async (): Promise<MeasurementType[]> => {
        const response = await apiClient.get<MeasurementType[]>('/api/metrics/types');
        return response.data;
    },

    getMetricsByType: async (typeId: number): Promise<Metric[]> => {
        const response = await apiClient.get<Metric[]>(`/api/metrics/type/${typeId}`);
        return response.data;
    }
};
