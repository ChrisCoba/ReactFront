import { apiClient } from './config';
import type { Tour, SearchFilters } from '../types/Tour';

export const PaquetesService = {
    async search(params: SearchFilters = {}): Promise<Tour[]> {
        const response = await apiClient.get('/search', { params });
        return response.data;
    },

    async create(data: Partial<Tour>): Promise<Tour> {
        const response = await apiClient.post('/', data);
        return response.data;
    },

    async update(id: string, data: Partial<Tour>): Promise<Tour> {
        const response = await apiClient.put(`/${id}`, data);
        return response.data;
    },

    async delete(id: string): Promise<void> {
        await apiClient.delete(`/${id}`);
    },
};
