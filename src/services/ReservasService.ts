import { apiClient } from './config';
import type { HoldData, HoldResponse, BookData, Reservation } from '../types/Reservation';

export const ReservasService = {
    /**
     * Create a hold for a tour
     */
    async hold(data: HoldData): Promise<HoldResponse> {
        try {
            const response = await apiClient.post('/hold', data);
            return response.data;
        } catch (error: any) {
            console.error('Hold error:', error);
            throw new Error(error.response?.data?.message || 'Failed to create hold');
        }
    },

    /**
     * Book/confirm a reservation
     */
    async book(data: BookData): Promise<Reservation> {
        try {
            const response = await apiClient.post('/booking', data);
            return response.data;
        } catch (error: any) {
            console.error('Booking error:', error);
            throw new Error(error.response?.data?.message || 'Failed to create booking');
        }
    },

    /**
     * Get availability for a tour
     */
    async checkAvailability(tourId: string, date: string): Promise<number> {
        try {
            const response = await apiClient.get('/availability', {
                params: { tourId, date },
            });
            return response.data.cuposDisponibles || 0;
        } catch (error: any) {
            console.error('Availability check error:', error);
            throw new Error(error.response?.data?.message || 'Failed to check availability');
        }
    },

    /**
     * Get user's reservations
     */
    async getUserReservations(userId: string): Promise<Reservation[]> {
        try {
            const response = await apiClient.get(`/reservas/usuario/${userId}`);
            return response.data;
        } catch (error: any) {
            console.error('Get reservations error:', error);
            throw new Error(error.response?.data?.message || 'Failed to get reservations');
        }
    },

    /**
     * Cancel a reservation
     */
    async cancelReservation(reservationId: string): Promise<void> {
        try {
            await apiClient.delete(`/reservas/${reservationId}`);
        } catch (error: any) {
            console.error('Cancel reservation error:', error);
            throw new Error(error.response?.data?.message || 'Failed to cancel reservation');
        }
    },
};
