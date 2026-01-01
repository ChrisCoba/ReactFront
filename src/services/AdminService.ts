import { apiClient } from './config';
import type { Tour } from '../types/Tour';
import type { Reservation } from '../types/Reservation';

interface Invoice {
    IdFactura: string;
    IdReserva: string;
    Subtotal: number;
    IVA: number;
    Total: number;
    FechaEmision: string;
}

export const AdminService = {
    // Users
    async getUsers() {
        const response = await apiClient.get('/usuarios/list');
        return response.data;
    },

    async createUser(userData: any) {
        const response = await apiClient.post('/usuarios', userData);
        return response.data;
    },

    async updateUser(id: number, userData: any) {
        const response = await apiClient.put(`/usuarios/${id}`, userData);
        return response.data;
    },

    async deleteUser(id: number) {
        const response = await apiClient.delete(`/usuarios/${id}`);
        return response.data;
    },

    // Tours
    async getTours(): Promise<Tour[]> {
        const response = await apiClient.get('/search');
        return response.data;
    },

    async createTour(tourData: Partial<Tour>): Promise<Tour> {
        const response = await apiClient.post('/', tourData);
        return response.data;
    },

    async updateTour(id: string, tourData: Partial<Tour>): Promise<Tour> {
        const response = await apiClient.put(`/${id}`, tourData);
        return response.data;
    },

    async deleteTour(id: string) {
        const response = await apiClient.delete(`/${id}`);
        return response.data;
    },

    // Reservations
    async getReservations(): Promise<Reservation[]> {
        const response = await apiClient.get('/reservas');
        return response.data;
    },

    async getReservationDetails(id: string) {
        // Construct Admin URL
        const adminUrl = apiClient.defaults.baseURL!.replace('integracion', 'admin');
        const response = await apiClient.get(`${adminUrl}/reservas/${id}/detalles`);
        return response.data;
    },

    async updateReservation(id: string, reservationData: any) {
        const response = await apiClient.put(`/reservas/${id}`, reservationData);
        return response.data;
    },

    async cancelReservation(id: string) {
        const response = await apiClient.post('/cancelar', {
            id_reserva: id.toString(),
        });
        return response.data;
    },

    // Invoices
    async getInvoices(): Promise<Invoice[]> {
        const response = await apiClient.get('/invoices/list');
        return response.data;
    },
};
