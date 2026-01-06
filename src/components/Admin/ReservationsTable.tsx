import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Reservation {
    id: number;
    codigo: string;
    fechaReserva: string;
    total: number;
    estado: string;
    clienteId: number;
    usuarioId: number;
    // Included purely for display if backend returns populated data, otherwise ID is shown
    cliente?: { nombre: string; apellido: string; email: string };
    package?: { nombre: string };
}

export const ReservationsTable: React.FC = () => {
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchReservations = async () => {
        try {
            const response = await axios.get('https://worldagencyreservas.runasp.net/api/reservas');
            setReservations(response.data);
        } catch (error) {
            console.error('Error fetching reservations:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReservations();
    }, []);

    const handleCancel = async (id: number) => {
        const reason = prompt('Please enter a reason for cancellation:');
        if (reason) {
            try {
                await axios.post(`https://worldagencyreservas.runasp.net/api/reservas/${id}/cancelar`, JSON.stringify(reason), {
                    headers: { 'Content-Type': 'application/json' }
                });
                fetchReservations();
            } catch (error) {
                console.error('Error cancelling reservation:', error);
                alert('Error cancelling reservation');
            }
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="card shadow mb-4">
            <div className="card-header py-3">
                <h6 className="m-0 font-weight-bold text-primary text-uppercase">Reservations Management</h6>
            </div>
            <div className="card-body">
                <div className="table-responsive">
                    <table className="table table-bordered">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Code</th>
                                <th>Date</th>
                                <th>Total</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reservations.map(res => (
                                <tr key={res.id}>
                                    <td>{res.id}</td>
                                    <td>{res.codigo}</td>
                                    <td>{new Date(res.fechaReserva).toLocaleDateString()}</td>
                                    <td>${res.total}</td>
                                    <td>
                                        <span className={`badge ${res.estado === 'Confirmada' ? 'bg-success' :
                                                res.estado === 'Pendiente' ? 'bg-warning text-dark' :
                                                    res.estado === 'Cancelada' ? 'bg-danger' : 'bg-secondary'
                                            }`}>
                                            {res.estado}
                                        </span>
                                    </td>
                                    <td>
                                        {res.estado !== 'Cancelada' && (
                                            <button className="btn btn-sm btn-danger" onClick={() => handleCancel(res.id)} title="Cancel Reservation">
                                                <i className="bi bi-x-circle"></i> Cancel
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
