import { apiClient } from './config';
import type { HoldData, PreReservaResponse, ConfirmReservaData, ReservaResponse, Reservation } from '../types/Reservation';

// V2 API Base URL
const V2_API_BASE = 'https://worldagencyint.runasp.net/api/v2/paquetes';

export const ReservasService = {
    /**
     * Create pre-reserva (Hold + PreReserva in one step)
     * Calls: POST /api/v2/paquetes/pre-reserva
     */
    async createPreReserva(data: HoldData): Promise<PreReservaResponse> {
        try {
            const payload = {
                idPaquete: data.IdPaquete,
                bookingUserId: data.BookingUserId,
                correo: data.Correo || data.BookingUserId,
                fechaInicio: data.FechaInicio,
                turistas: data.Turistas || [],
                duracionHoldSegundos: data.DuracionHoldSegundos || 300
            };

            const response = await apiClient.post(`${V2_API_BASE}/pre-reserva`, payload);
            return {
                holdId: response.data.id_hold || response.data.holdId,
                preReservaId: response.data.pre_reserva_id || response.data.preReservaId,
                fechaExpiracion: response.data.fechaExpiracion,
                estado: response.data.estado || 'Pendiente',
                mensaje: response.data.mensaje || 'Pre-reserva creada'
            };
        } catch (error: any) {
            console.error('Pre-Reserva error:', error);
            throw new Error(error.response?.data?.detalle || error.response?.data?.message || 'Failed to create pre-reserva');
        }
    },

    /**
     * Confirm reservation after payment
     * Calls: POST /api/v2/paquetes/reserva
     */
    async confirmReserva(data: ConfirmReservaData): Promise<ReservaResponse> {
        try {
            const payload = {
                preReservaId: data.preReservaId,
                idPaquete: data.idPaquete,
                correo: data.correo,
                paymentStatus: 'paid',
                turistas: data.turistas || []
            };

            const response = await apiClient.post(`${V2_API_BASE}/reserva`, payload);
            return {
                reservaId: response.data.id_reserva || response.data.reservaId,
                codigo: response.data.codigo,
                estado: response.data.estado || 'Confirmada',
                uriFactura: response.data.uri_factura
            };
        } catch (error: any) {
            console.error('Confirm Reserva error:', error);
            throw new Error(error.response?.data?.detalle || error.response?.data?.message || 'Failed to confirm reservation');
        }
    },

    /**
     * Create invoice for a reservation
     * Calls: POST /api/v2/paquetes/invoices
     */
    async createInvoice(idReserva: string, correo: string, nombre: string, valor: number): Promise<any> {
        try {
            const payload = {
                idReserva,
                correo,
                nombre,
                valor
            };

            const response = await apiClient.post(`${V2_API_BASE}/invoices`, payload);
            return response.data;
        } catch (error: any) {
            console.error('Invoice error:', error);
            throw new Error(error.response?.data?.detalle || 'Failed to create invoice');
        }
    },

    /**
     * Process bank transfer/payment
     * Uses the configured Banca service endpoint
     */
    async processBankPayment(cuentaOrigen: string, monto: number): Promise<{ success: boolean; transactionId?: string }> {
        try {
            // Using the Finanzas/Banca endpoint
            const bancaUrl = 'https://finanzaswa.runasp.net/api/banca/transferir';
            const payload = {
                cuentaOrigen: parseInt(cuentaOrigen),
                cuentaDestino: 1, // Agency's account
                monto: monto
            };

            const response = await apiClient.post(bancaUrl, payload);
            return {
                success: response.data.exito || true,
                transactionId: response.data.idTransaccion || response.data.transactionId
            };
        } catch (error: any) {
            console.error('Bank payment error:', error);
            throw new Error(error.response?.data?.mensaje || 'Failed to process payment');
        }
    },

    // Legacy methods for backwards compatibility
    /**
     * @deprecated Use createPreReserva instead
     */
    async hold(data: HoldData): Promise<any> {
        return this.createPreReserva(data);
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
            await apiClient.post(`${V2_API_BASE}/cancelar`, { id_reserva: reservationId });
        } catch (error: any) {
            console.error('Cancel reservation error:', error);
            throw new Error(error.response?.data?.message || 'Failed to cancel reservation');
        }
    }
};

