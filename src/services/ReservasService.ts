import { apiClient } from './config';
import type { Reservation } from '../types/Reservation';

// Admin Gateway URL (for own frontend)
const ADMIN_API = 'https://worldagencyadmin.runasp.net/api/admin';

// Response types
export interface PreReservaResponse {
    id: number;
    codigo: string;
    fechaExpiracion: string;
    total: number;
    estado: string;
    mensaje: string;
}

export interface PagoPreReservaResponse {
    message: string;
    reservaId: number;
    codigo: string;
    estado: string;
    uriFactura?: string;
}

export interface PreReservaData {
    UsuarioId: number;
    PaqueteId: number;
    FechaInicio: string;
    Personas: number;
}

export const ReservasService = {
    /**
     * Create a Pre-Reserva (pending, 300s to pay)
     * Calls: POST /api/admin/pre-reserva
     */
    async createPreReserva(data: PreReservaData): Promise<PreReservaResponse> {
        console.log('📝 [ReservasService] Creando pre-reserva:', data);
        try {
            const response = await apiClient.post(`${ADMIN_API}/pre-reserva`, data);
            console.log('✅ [ReservasService] Pre-reserva creada:', response.data);
            return response.data;
        } catch (error: any) {
            console.error('❌ [ReservasService] Error creando pre-reserva:', error.response?.data || error.message);
            throw new Error(error.response?.data?.detalle || error.response?.data?.error || 'Failed to create pre-reserva');
        }
    },

    /**
     * Pay for a Pre-Reserva and confirm it (creates Reserva + Factura)
     * Calls: POST /api/admin/pre-reserva/{id}/pagar
     */
    async payPreReserva(preReservaId: number, cuentaOrigen: number, monto: number): Promise<PagoPreReservaResponse> {
        console.log('💰 [ReservasService] Pagando pre-reserva:', { preReservaId, cuentaOrigen, monto });
        try {
            const payload = { CuentaOrigen: cuentaOrigen, Monto: monto };
            const response = await apiClient.post(`${ADMIN_API}/pre-reserva/${preReservaId}/pagar`, payload);
            console.log('✅ [ReservasService] Pago procesado:', response.data);
            return response.data;
        } catch (error: any) {
            console.error('❌ [ReservasService] Error pagando pre-reserva:', error.response?.data || error.message);
            throw new Error(error.response?.data?.detalle || error.response?.data?.error || 'Failed to process payment');
        }
    },

    /**
     * Get user's reservations
     */
    async getUserReservations(userId: string): Promise<Reservation[]> {
        try {
            const response = await apiClient.get(`${ADMIN_API}/reservas/usuario/${userId}`);
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
            await apiClient.post(`${ADMIN_API}/reservas/${reservationId}/cancelar`, JSON.stringify(motivo), {
                headers: { 'Content-Type': 'application/json' }
            });
        } catch (error: any) {
            console.error('Cancel reservation error:', error);
            throw new Error(error.response?.data?.message || 'Failed to cancel reservation');
        }
    }
};
