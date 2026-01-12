import { apiClient } from './config';
import type { Reservation } from '../types/Reservation';

// Admin Gateway URL (for own frontend)
const ADMIN_API_BASE = 'https://worldagencyadmin.runasp.net/api/admin';

// Response types
export interface CreateReservaResponse {
    id: number;
}

export interface CreateReservaData {
    UsuarioId: number;
    PaqueteId: number;
    FechaInicio: string;
    Personas: number;
}

export const ReservasService = {
    /**
     * Create a pending reservation
     * Calls: POST /api/admin/reservas
     */
    async createReservation(data: CreateReservaData): Promise<CreateReservaResponse> {
        try {
            const response = await apiClient.post(`${ADMIN_API_BASE}/reservas`, data);
            return {
                id: response.data.id
            };
        } catch (error: any) {
            console.error('Create reservation error:', error);
            throw new Error(error.response?.data?.detalle || error.response?.data?.message || 'Failed to create reservation');
        }
    },

    /**
     * Pay for a reservation and confirm it
     * Calls: POST /api/admin/reservas/{id}/pagar
     * This endpoint processes payment via Finanzas and confirms the reservation
     */
    async payReservation(reservaId: number, cuentaOrigen: number): Promise<{ message: string }> {
        try {
            const payload = {
                CuentaOrigen: cuentaOrigen
            };

            const response = await apiClient.post(`${ADMIN_API_BASE}/reservas/${reservaId}/pagar`, payload);
            return {
                message: response.data.message || 'Pago exitoso y reserva confirmada'
            };
        } catch (error: any) {
            console.error('Pay reservation error:', error);
            throw new Error(error.response?.data?.detalle || error.response?.data?.error || 'Failed to process payment');
        }
    },

    /**
     * Get user's reservations
     */
    async getUserReservations(userId: string): Promise<Reservation[]> {
        try {
            const response = await apiClient.get(`${ADMIN_API_BASE}/reservas/usuario/${userId}`);
            return response.data;
        } catch (error: any) {
            console.error('Get reservations error:', error);
            throw new Error(error.response?.data?.message || 'Failed to get reservations');
        }
    },

    /**
     * Cancel a reservation
     * Calls: POST /api/admin/reservas/{id}/cancelar
     */
    async cancelReservation(reservationId: string, motivo: string = 'Cancelado por el usuario'): Promise<void> {
        try {
            await apiClient.post(`${ADMIN_API_BASE}/reservas/${reservationId}/cancelar`, JSON.stringify(motivo), {
                headers: { 'Content-Type': 'application/json' }
            });
        } catch (error: any) {
            console.error('Cancel reservation error:', error);
            throw new Error(error.response?.data?.message || 'Failed to cancel reservation');
        }
    }
};


