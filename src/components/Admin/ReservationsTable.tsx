import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import { GET_RESERVATIONS_LIST } from '../../graphql/queries';
import axios from 'axios';

interface Reservation {
    id: number;
    codigo: string;
    fechaReserva: string;
    total: number;
    estado: string;
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

    const { data, loading, error, refetch } = useQuery(GET_RESERVATIONS_LIST, {
        variables: { limit: 100 },
        fetchPolicy: 'network-only'
    });

    const reservations: Reservation[] = data?.reservations || [];
    const totalPages = Math.ceil(reservations.length / PAGE_SIZE);
    const paginatedReservations = reservations.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

    const handleCancel = async (id: number) => {
        const reason = prompt('Please enter a reason for cancellation:');
        if (reason) {
            try {
                await axios.post(`https://worldagencyadmin.runasp.net/api/admin/reservas/${id}/cancelar`, JSON.stringify(reason), {
                    headers: { 'Content-Type': 'application/json' }
                });
                refetch();
            } catch (err) {
                console.error('Error cancelling reservation:', err);
                alert('Error cancelling reservation');
            }
        }
    };

    if (loading) return <div className="text-center p-4"><div className="spinner-border" role="status"></div></div>;
    if (error) return <div className="alert alert-danger">Error loading reservations: {error.message}</div>;

    return (
        <div className="card shadow mb-4">
            <div className="card-header py-3">
                <h6 className="m-0 font-weight-bold text-primary text-uppercase">Reservations Management ({reservations.length} total)</h6>
            </div>
            <div className="card-body">
                <div className="table-responsive">
                    <table className="table table-bordered table-hover">
                        <thead className="table-light">
                            <tr>
                                <th>ID</th>
                                <th>Code</th>
                                <th>Client</th>
                                <th>Package</th>
                                <th>Date</th>
                                <th>Total</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedReservations.length > 0 ? paginatedReservations.map(res => (
                                <tr key={res.id}>
                                    <td>{res.id}</td>
                                    <td><code>{res.codigo}</code></td>
                                    <td>
                                        {res.cliente?.profile?.nombre} {res.cliente?.profile?.apellido}
                                        <br />
                                        <small className="text-muted">{res.cliente?.email}</small>
                                    </td>
                                    <td>
                                        {res.package?.nombre}
                                        <br />
                                        <small className="text-muted">{res.package?.ciudad}</small>
                                    </td>
                                    <td>{new Date(res.fechaReserva).toLocaleDateString()}</td>
                                    <td>${res.total.toFixed(2)}</td>
                                    <td>
                                        <span className={`badge ${res.estado === 'Confirmada' || res.estado === 'Confirmado' ? 'bg-success' :
                                            res.estado === 'Pendiente' ? 'bg-warning text-dark' :
                                                res.estado === 'Cancelada' || res.estado === 'Cancelado' ? 'bg-danger' : 'bg-secondary'
                                            }`}>
                                            {res.estado}
                                        </span>
                                    </td>
                                    <td>
                                        {res.estado !== 'Cancelada' && res.estado !== 'Cancelado' && (
                                            <button className="btn btn-sm btn-danger" onClick={() => handleCancel(res.id)} title="Cancel">
                                                <i className="bi bi-x-circle"></i>
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            )) : (
                                <tr><td colSpan={8} className="text-center p-3">No reservations found</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <nav aria-label="Reservations pagination">
                        <ul className="pagination justify-content-center mb-0">
                            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                <button className="page-link" onClick={() => setCurrentPage(p => p - 1)}>Previous</button>
                            </li>
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                <li key={page} className={`page-item ${currentPage === page ? 'active' : ''}`}>
                                    <button className="page-link" onClick={() => setCurrentPage(page)}>{page}</button>
                                </li>
                            ))}
                            <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                                <button className="page-link" onClick={() => setCurrentPage(p => p + 1)}>Next</button>
                            </li>
                        </ul>
                    </nav>
                )}
            </div>
        </div>
    );
};
