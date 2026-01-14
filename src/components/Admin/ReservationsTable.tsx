import React, { useState, useMemo } from 'react';
import { useQuery } from '@apollo/client';
import { GET_RESERVATIONS_LIST } from '../../graphql/queries';
import axios from 'axios';
import ReservationDetailsModal from '../ReservationDetailsModal';

interface Reservation {
    id: number;
    codigo: string;
    fechaReserva: string;
    total: number;
    estado: string;
    facturaId?: number; // For invoice PDF download
    cliente?: {
        email: string;
        profile?: {
            nombre: string;
            apellido: string;
        };
    };
    package?: {
        nombre: string;
        ciudad: string;
    };
}

const PAGE_SIZE = 15;

export const ReservationsTable: React.FC = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [selectedReservationId, setSelectedReservationId] = useState<number | null>(null);

    const { data, loading, error, refetch } = useQuery(GET_RESERVATIONS_LIST, {
        variables: { limit: 100 },
        fetchPolicy: 'network-only'
    });

    const reservations: Reservation[] = data?.reservations || [];

    const filteredReservations = useMemo(() => {
        return reservations.filter(res => {
            const clientName = `${res.cliente?.profile?.nombre || ''} ${res.cliente?.profile?.apellido || ''}`.toLowerCase();
            const matchesSearch =
                clientName.includes(searchTerm.toLowerCase()) ||
                res.id.toString().includes(searchTerm) ||
                res.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                res.cliente?.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                res.package?.nombre.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesStatus = statusFilter === 'all' ||
                (statusFilter === 'confirmado' && (res.estado === 'Confirmada' || res.estado === 'Confirmado')) ||
                (statusFilter === 'pendiente' && res.estado === 'Pendiente') ||
                (statusFilter === 'cancelado' && (res.estado === 'Cancelada' || res.estado === 'Cancelado'));

            return matchesSearch && matchesStatus;
        }).sort((a, b) => b.id - a.id); // Sort by ID descending (newest first)
    }, [reservations, searchTerm, statusFilter]);

    const totalPages = Math.ceil(filteredReservations.length / PAGE_SIZE);
    const paginatedReservations = filteredReservations.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

    const handleCancel = async (id: number) => {
        const reason = prompt('Por favor ingrese el motivo de la cancelación:');
        if (reason) {
            try {
                await axios.post(`https://worldagencyadmin.runasp.net/api/admin/reservas/${id}/cancelar`, JSON.stringify(reason), {
                    headers: { 'Content-Type': 'application/json' }
                });
                alert('Reserva cancelada exitosamente');
                refetch();
            } catch (err) {
                console.error('Error al cancelar reserva:', err);
                alert('Error al cancelar reserva');
            }
        }
    };

    const handleSearchChange = (value: string) => {
        setSearchTerm(value);
        setCurrentPage(1);
    };

    const handleStatusFilterChange = (value: string) => {
        setStatusFilter(value);
        setCurrentPage(1);
    };

    if (loading) return <div className="text-center p-4"><div className="spinner-border" role="status"></div></div>;
    if (error) return <div className="alert alert-danger">Error al cargar reservas: {error.message}</div>;

    return (
        <div className="card shadow mb-4">
            <div className="card-header py-3">
                <h6 className="m-0 font-weight-bold text-primary text-uppercase">Gestión de Reservas ({filteredReservations.length} de {reservations.length})</h6>
            </div>
            <div className="card-body">
                {/* Barra de Búsqueda y Filtro */}
                <div className="row mb-3">
                    <div className="col-md-8">
                        <div className="input-group">
                            <span className="input-group-text"><i className="bi bi-search"></i></span>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Buscar por código, ID, cliente o paquete..."
                                value={searchTerm}
                                onChange={(e) => handleSearchChange(e.target.value)}
                            />
                            {searchTerm && (
                                <button className="btn btn-outline-secondary" onClick={() => handleSearchChange('')}>
                                    <i className="bi bi-x"></i>
                                </button>
                            )}
                        </div>
                    </div>
                    <div className="col-md-4">
                        <select
                            className="form-select"
                            value={statusFilter}
                            onChange={(e) => handleStatusFilterChange(e.target.value)}
                        >
                            <option value="all">Todos los Estados</option>
                            <option value="confirmado">Confirmado</option>
                            <option value="pendiente">Pendiente</option>
                            <option value="cancelado">Cancelado</option>
                        </select>
                    </div>
                </div>

                <div className="table-responsive">
                    <table className="table table-bordered table-hover">
                        <thead className="table-light">
                            <tr>
                                <th>ID</th>
                                <th>Código</th>
                                <th>Total</th>
                                <th>Estado</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedReservations.length > 0 ? paginatedReservations.map(res => (
                                <tr key={res.id}>
                                    <td>{res.id}</td>
                                    <td><code>{res.codigo}</code></td>
                                    <td>${res.total.toFixed(2)}</td>
                                    <td>
                                        <span className={`badge ${res.estado === 'Confirmada' || res.estado === 'Confirmado' ? 'bg-success' :
                                            res.estado === 'Completada' || res.estado === 'Completado' ? 'bg-info' :
                                                res.estado === 'Pendiente' ? 'bg-warning text-dark' :
                                                    res.estado === 'Cancelada' || res.estado === 'Cancelado' ? 'bg-danger' : 'bg-secondary'
                                            }`}>
                                            {res.estado}
                                        </span>
                                    </td>
                                    <td>
                                        {/* Ver Detalles button (eye icon) */}
                                        <button
                                            className="btn btn-sm btn-outline-secondary me-1"
                                            onClick={() => {
                                                setSelectedReservationId(res.id);
                                                setShowDetailsModal(true);
                                            }}
                                            title="Ver Detalles"
                                        >
                                            <i className="bi bi-eye"></i>
                                        </button>
                                        {/* Factura button (document icon) */}
                                        <button
                                            className={`btn btn-sm me-1 ${res.facturaId ? 'btn-outline-primary' : 'btn-outline-secondary'}`}
                                            onClick={async () => {
                                                if (res.facturaId) {
                                                    try {
                                                        const { FacturasService } = await import('../../services/FacturasService');
                                                        await FacturasService.downloadInvoicePdf(res.facturaId);
                                                    } catch (error) {
                                                        alert('Error al descargar factura');
                                                    }
                                                } else {
                                                    alert('No hay factura disponible para esta reserva');
                                                }
                                            }}
                                            title={res.facturaId ? 'Descargar Factura PDF' : 'Sin factura'}
                                            disabled={!res.facturaId}
                                        >
                                            <i className="bi bi-file-earmark-text"></i>
                                        </button>
                                        {/* Cancel button */}
                                        {res.estado !== 'Cancelada' && res.estado !== 'Cancelado' && (
                                            <button className="btn btn-sm btn-danger" onClick={() => handleCancel(res.id)} title="Cancelar">
                                                <i className="bi bi-x-circle"></i>
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            )) : (
                                <tr><td colSpan={5} className="text-center p-3">No se encontraron reservas</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Paginación */}
                {totalPages > 1 && (
                    <nav aria-label="Paginación de reservas">
                        <ul className="pagination justify-content-center mb-0">
                            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                <button className="page-link" onClick={() => setCurrentPage(p => p - 1)}>Anterior</button>
                            </li>
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                <li key={page} className={`page-item ${currentPage === page ? 'active' : ''}`}>
                                    <button className="page-link" onClick={() => setCurrentPage(page)}>{page}</button>
                                </li>
                            ))}
                            <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                                <button className="page-link" onClick={() => setCurrentPage(p => p + 1)}>Siguiente</button>
                            </li>
                        </ul>
                    </nav>
                )}

                {/* Reservation Details Modal */}
                <ReservationDetailsModal
                    isOpen={showDetailsModal}
                    onClose={() => setShowDetailsModal(false)}
                    reservationId={selectedReservationId}
                />
            </div>
        </div>
    );
};
