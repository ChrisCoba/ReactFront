import React, { useState, useEffect } from 'react';
import { ReservasService } from '../services/ReservasService';
import type { ReservaDetalle } from '../services/ReservasService';

interface ReservationDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    reservationId: number | null;
}

const ReservationDetailsModal: React.FC<ReservationDetailsModalProps> = ({ isOpen, onClose, reservationId }) => {
    const [detalles, setDetalles] = useState<ReservaDetalle[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen && reservationId) {
            loadDetalles();
        }
    }, [isOpen, reservationId]);

    const loadDetalles = async () => {
        if (!reservationId) return;
        setLoading(true);
        setError(null);
        try {
            const data = await ReservasService.getDetalles(reservationId);
            setDetalles(data);
        } catch (err: any) {
            setError(err.message || 'Error al cargar detalles');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} onClick={onClose}>
            <div className="modal-dialog modal-lg" onClick={e => e.stopPropagation()}>
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">
                            <i className="bi bi-list-ul me-2"></i>
                            Detalles de Reserva #{reservationId}
                        </h5>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>
                    <div className="modal-body">
                        {loading && (
                            <div className="text-center py-4">
                                <div className="spinner-border text-primary" role="status">
                                    <span className="visually-hidden">Cargando...</span>
                                </div>
                            </div>
                        )}
                        {error && (
                            <div className="alert alert-danger">{error}</div>
                        )}
                        {!loading && !error && detalles.length === 0 && (
                            <div className="text-center text-muted py-4">
                                No se encontraron detalles para esta reserva.
                            </div>
                        )}
                        {!loading && !error && detalles.length > 0 && (
                            <div className="table-responsive">
                                <table className="table table-striped">
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>Servicio ID</th>
                                            <th>Cantidad</th>
                                            <th>Precio Unitario</th>
                                            <th>Subtotal</th>
                                            <th>Fecha Inicio</th>
                                            <th>Fecha Fin</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {detalles.map((d) => (
                                            <tr key={d.id}>
                                                <td>{d.id}</td>
                                                <td>{d.servicioId}</td>
                                                <td>{d.cantidad}</td>
                                                <td>${d.precioUnitario?.toFixed(2) || '0.00'}</td>
                                                <td>${d.subtotal?.toFixed(2) || '0.00'}</td>
                                                <td>{d.fechaInicio || 'N/A'}</td>
                                                <td>{d.fechaFin || 'N/A'}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>
                            Cerrar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReservationDetailsModal;
