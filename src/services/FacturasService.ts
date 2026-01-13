import { apiClient } from './config';

export const FacturasService = {
    async downloadInvoicePdf(facturaId: number): Promise<void> {
        try {
            const response = await apiClient.get(`https://worldagencyfinanzas.runasp.net/api/facturas/${facturaId}/pdf`, {
                responseType: 'blob'
            });

            // Create blob link to download
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `factura-${facturaId}.pdf`);
            document.body.appendChild(link);
            link.click();

            // Cleanup
            link.parentNode?.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error: any) {
            console.error('Error downloading invoice PDF:', error);
            throw new Error(error.response?.data?.error || 'Error al descargar la factura');
        }
    },

    async getInvoiceUrl(facturaId: number): Promise<string> {
        return `https://worldagencyfinanzas.runasp.net/api/facturas/${facturaId}/pdf`;
    }
};
