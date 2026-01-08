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

    /**
     * Create a pending reservation from a hold
     */
    async createReservation(data: {
        UsuarioId: number;
        PaqueteId: string;
        FechaInicio: string;
        Personas: number;
        HoldId?: string;
    }): Promise<{ id: number }> {
        try {
            const adminUrl = "https://worldagencyadmin.runasp.net/api/admin";
            // Map keys if necessary, ensuring Case matches DTO
            const payload = {
                UsuarioId: data.UsuarioId,
                PaqueteId: parseInt(data.PaqueteId), // Backend expects int
                FechaInicio: data.FechaInicio,
                Personas: data.Personas,
                HoldId: data.HoldId
            };
            const response = await apiClient.post(`${adminUrl}/reservas`, payload);
            return response.data;
        } catch (error: any) {
            console.error('Create Reservation error:', error);
            throw new Error(error.response?.data?.message || 'Failed to create reservation');
        }
    },

    /**
     * Pay for a reservation (Hold -> Pay -> Confirm)
     */
    async pagarReserva(reservationId: string, cuentaOrigen: string): Promise<any> {
        try {
            // Note: Calling Admin Gateway for proper orchestration
            // If reservationId is int in backend, frontend string must be parsed?
            // "reservationId" input implies string from Types. Backend expects int.
            // But we use admin URL.
            const adminUrl = "https://worldagencyadmin.runasp.net/api/admin";
            const response = await apiClient.post(`${adminUrl}/reservas/${reservationId}/pagar`, {
                CuentaOrigen: parseInt(cuentaOrigen)
            });
            return response.data;
        } catch (error: any) {
            console.error('Payment error:', error);
            throw new Error(error.response?.data?.message || 'Failed to process payment');
        }
    },
};
