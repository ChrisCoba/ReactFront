import React, { useEffect, useState, useMemo } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_USER_DASHBOARD, GET_RESERVATIONS_LIST } from '../graphql/queries';
import { UPDATE_USER_PROFILE } from '../graphql/mutations';
import axios from 'axios';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../context/ToastContext';
import ReservationDetailsModal from '../components/ReservationDetailsModal';

interface UserProfile {
    Nombre: string;
    Apellido: string;
    Telefono: string;
    FechaRegistro?: string;
}

const UserProfile: React.FC = () => {
    const { user } = useAuth();
    const { showToast, showError } = useToast();
    const [isEditing, setIsEditing] = useState(false);

    // Status filter state
    const [statusFilter, setStatusFilter] = useState('all');

    const [editForm, setEditForm] = useState<UserProfile>({
        Nombre: '',
        Apellido: '',
        Telefono: ''
    });

    const [currentPage, setCurrentPage] = useState(1);
    const PAGE_SIZE = 10;

    const [selectedReservationId, setSelectedReservationId] = useState<number | null>(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);

    // Get user dashboard data
    const { data: userDataResponse, loading: userLoading, refetch: refetchUser } = useQuery(GET_USER_DASHBOARD, {
        variables: { userId: user?.Id ? Number(user.Id) : 0 },
        skip: !user?.Id,
        fetchPolicy: 'network-only'
    });

    const [updateProfile] = useMutation(UPDATE_USER_PROFILE);

    // Query for all reservations (Admin style)
    const { data: reservationsData, refetch: refetchReservations } = useQuery(GET_RESERVATIONS_LIST, {
        variables: { limit: 100 },
        fetchPolicy: 'network-only'
    });

    useEffect(() => {
        if (user?.Email) {
            refetchUser();
        }
    }, [user, refetchUser]);

    const userData = userDataResponse?.user;

    const handleEditClick = () => {
        if (userData?.profile) {
            setEditForm({
                Nombre: userData.profile.nombre || '',
                Apellido: userData.profile.apellido || '',
                Telefono: userData.profile.telefono || ''
            });
            setIsEditing(true);
        }
    };

    const handleSaveProfile = async () => {
        try {
            await updateProfile({
                variables: {
                    input: {
                        nombre: editForm.Nombre,
                        apellido: editForm.Apellido,
                        telefono: editForm.Telefono
                    }
                }
            });
            showToast('Perfil actualizado exitosamente', 'success');
            setIsEditing(false);
            refetchUser();
        } catch (error) {
            console.error('Error updating profile:', error);
            showError('Error al actualizar el perfil');
        }
    };

    const allReservations = reservationsData?.reservations || [];
    const userEmail = user?.Email || '';

    // Filter bookings
    const filteredBookings = useMemo(() => {
        return allReservations.filter((res: any) => {
            // STRICT FILTER: Only show reservations for this user's email
            if (!userEmail || !res.cliente?.email || res.cliente.email.toLowerCase() !== userEmail.toLowerCase()) {
                return false;
            }

            const matchesStatus = statusFilter === 'all' ||
                (statusFilter === 'confirmada' && (res.estado === 'Confirmada' || res.estado === 'Confirmado')) ||
                (statusFilter === 'completada' && (res.estado === 'Completada' || res.estado === 'Completado')) ||
                (statusFilter === 'pendiente' && res.estado === 'Pendiente') ||
                (statusFilter === 'cancelada' && (res.estado === 'Cancelada' || res.estado === 'Cancelado'));

            return matchesStatus;
        }).sort((a: any, b: any) => b.id - a.id);
    }, [allReservations, userEmail, statusFilter]);

    const totalPages = Math.ceil(filteredBookings.length / PAGE_SIZE);
    const paginatedBookings = filteredBookings.slice(
        (currentPage - 1) * PAGE_SIZE,
        currentPage * PAGE_SIZE
    );

    if (userLoading) return <div className="text-center p-5"><div className="spinner-border text-primary" role="status"></div></div>;

    return (
        <div className="container-fluid py-4">
            <div className="row">
                {/* Sidebar Profile */}
                <div className="col-lg-3 mb-4">
                    <div className="card shadow-sm h-100">
                        <div className="card-body text-center p-4">
                            <div className="mb-3">
                                <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center mx-auto"
                                    style={{ width: '80px', height: '80px', fontSize: '2rem' }}>
                                    {userData?.profile?.nombre?.charAt(0) || 'U'}
                                </div>
                            </div>
                            <h4>{userData?.profile?.nombre} {userData?.profile?.apellido}</h4>
                            <p className="text-muted">{user?.Email || user?.email}</p>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="col-lg-9">
                    {/* Profile Info Section */}
                    <div className="card shadow-sm mb-4">
                        <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center">
                            <h5 className="mb-0">Información Personal</h5>
                            {!isEditing && (
                                <button className="btn btn-outline-primary btn-sm" onClick={handleEditClick}>
                                    <i className="bi bi-pencil-square me-2"></i>Editar
                                </button>
                            )}
                        </div>
                        <div className="card-body">
                            {isEditing ? (
                                <form onSubmit={(e) => { e.preventDefault(); handleSaveProfile(); }}>
                                    <div className="row mb-3">
                                        <div className="col-md-6">
                                            <label className="form-label">Nombre</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={editForm.Nombre}
                                                onChange={(e) => setEditForm({ ...editForm, Nombre: e.target.value })}
                                            />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label">Apellido</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={editForm.Apellido}
                                                onChange={(e) => setEditForm({ ...editForm, Apellido: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Teléfono</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={editForm.Telefono}
                                            onChange={(e) => setEditForm({ ...editForm, Telefono: e.target.value })}
                                        />
                                    </div>
                                    <div className="d-flex gap-2">
                                        <button type="submit" className="btn btn-primary">Guardar</button>
                                        <button type="button" className="btn btn-secondary" onClick={() => setIsEditing(false)}>Cancelar</button>
                                    </div>
                                </form>
                            ) : (
                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label className="text-muted small">Nombre Completo</label>
                                        <p className="mb-0 fw-bold">{userData?.profile?.nombre} {userData?.profile?.apellido}</p>
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label className="text-muted small">Teléfono</label>
                                        <p className="mb-0 fw-bold">{userData?.profile?.telefono || 'No registrado'}</p>
                                    </div>
                                    <div className="col-md-6">
                                        <label className="text-muted small">Miembro desde</label>
                                        <p className="mb-0 fw-bold">{userData?.profile?.fechaRegistro ? new Date(userData.profile.fechaRegistro).toLocaleDateString() : '-'}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Reservations Table Section */}
                    <div className="card shadow-sm">
                        <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center">
                            <h5 className="mb-0">Mis Reservas</h5>
                            <div className="w-auto">
                                <select
                                    className="form-select form-select-sm"
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                >
                                    <option value="all">Todos los Estados</option>
                                    <option value="confirmada">Confirmada</option>
                                    <option value="completada">Completada</option>
                                    <option value="pendiente">Pendiente</option>
                                    <option value="cancelada">Cancelada</option>
                                </select>
                            </div>
                        </div>
                        <div className="card-body p-0">
                            <div className="table-responsive">
                                <table className="table table-hover mb-0">
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
                                        {paginatedBookings.length > 0 ? paginatedBookings.map((booking: any) => (
                                            <tr key={booking.id}>
                                                <td>{booking.id}</td>
                                                <td><code>{booking.codigo}</code></td>
                                                <td>${booking.total.toFixed(2)}</td>
                                                <td>
                                                    <span className={`badge ${booking.estado === 'Confirmada' || booking.estado === 'Confirmado' ? 'bg-success' :
                                                        booking.estado === 'Completada' || booking.estado === 'Completado' ? 'bg-info' :
                                                            booking.estado === 'Pendiente' ? 'bg-warning text-dark' :
                                                                booking.estado === 'Cancelada' || booking.estado === 'Cancelado' ? 'bg-danger' : 'bg-secondary'
                                                        }`}>
                                                        {booking.estado}
                                                    </span>
                                                </td>
                                                <td>
                                                    <div className="btn-group">
                                                        <button
                                                            className="btn btn-sm btn-outline-secondary"
                                                            onClick={() => {
                                                                setSelectedReservationId(booking.id);
                                                                setShowDetailsModal(true);
                                                            }}
                                                            title="Ver Detalles"
                                                        >
                                                            <i className="bi bi-eye"></i>
                                                        </button>
                                                        {booking.estado !== 'Cancelada' && booking.estado !== 'Cancelado' && (
                                                            <button
                                                                className="btn btn-sm btn-danger ms-1"
                                                                onClick={async () => {
                                                                    const reason = prompt('Por favor ingrese el motivo de la cancelación:');
                                                                    if (reason) {
                                                                        try {
                                                                            await axios.post(`https://worldagencyadmin.runasp.net/api/admin/reservas/${booking.id}/cancelar`, JSON.stringify(reason), {
                                                                                headers: { 'Content-Type': 'application/json' }
                                                                            });
                                                                            alert('Reserva cancelada exitosamente');
                                                                            refetchReservations();
                                                                        } catch (err) {
                                                                            console.error('Error al cancelar reserva:', err);
                                                                            alert('Error al cancelar reserva');
                                                                        }
                                                                    }
                                                                }}
                                                                title="Cancelar"
                                                            >
                                                                <i className="bi bi-x-circle"></i>
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        )) : (
                                            <tr><td colSpan={5} className="text-center p-3">No tienes reservas registradas</td></tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        {totalPages > 1 && (
                            <div className="card-footer bg-white border-top-0">
                                <nav>
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
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <ReservationDetailsModal
                isOpen={showDetailsModal}
                onClose={() => setShowDetailsModal(false)}
                reservationId={selectedReservationId}
            />
        </div>
    );
};

export default UserProfile;
