import React, { useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { GET_USER_DASHBOARD } from '../graphql/queries';
import { useAuth } from '../hooks/useAuth';
import { AuthService } from '../services/AuthService';
import { useToast } from '../context/ToastContext';
import LoadingSpinner from '../components/LoadingSpinner';

const UserProfile: React.FC = () => {
    const { user } = useAuth();
    const { showSuccess, showError } = useToast();
    const [isEditing, setIsEditing] = React.useState(false);
    const [editForm, setEditForm] = React.useState({
        Nombre: '',
        Apellido: '',
        Telefono: '',
        password: ''
    });
    const [currentPage, setCurrentPage] = React.useState(1);
    const [statusFilter, setStatusFilter] = React.useState('all');
    const [searchTerm, setSearchTerm] = React.useState('');
    const PAGE_SIZE = 10;

    // Use GraphQL to fetch enriched profile data (total spent, bookings)
    const { data, loading, error, refetch } = useQuery(GET_USER_DASHBOARD, {
        variables: { userId: user?.Id || 0 },
        skip: !user?.Id
    });

    useEffect(() => {
        if (user?.Email) {
            refetch();
        }
    }, [user, refetch]);

    if (loading) return <LoadingSpinner />;
    if (error) return <div className="text-danger p-5">Error cargando perfil: {error.message}</div>;

    const userData = data?.user;
    const allBookings = userData?.bookings || [];

    // Filter bookings
    const filteredBookings = allBookings.filter((b: any) => {
        const matchesStatus = statusFilter === 'all' ||
            (statusFilter === 'confirmada' && (b.estado === 'Confirmada' || b.estado === 'Confirmado')) ||
            (statusFilter === 'pendiente' && b.estado.toLowerCase().includes('pendiente')) ||
            (statusFilter === 'cancelada' && b.estado.toLowerCase().includes('cancel'));

        const matchesSearch = searchTerm === '' ||
            b.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
            b.package?.nombre?.toLowerCase().includes(searchTerm.toLowerCase());

        return matchesStatus && matchesSearch;
    });

    // Paginate
    const totalPages = Math.ceil(filteredBookings.length / PAGE_SIZE);
    const paginatedBookings = filteredBookings.slice(
        (currentPage - 1) * PAGE_SIZE,
        currentPage * PAGE_SIZE
    );

    const bookings = paginatedBookings;

    const handleEditClick = () => {
        setEditForm({
            Nombre: userData?.profile?.nombre || '',
            Apellido: userData?.profile?.apellido || '',
            Telefono: userData?.profile?.telefono || '',
            password: ''
        });
        setIsEditing(true);
    };

    const handleSaveProfile = async () => {
        try {
            if (!user?.Id) return;
            await AuthService.updateProfile(user.Id, editForm);
            showSuccess('Perfil actualizado con éxito');
            setIsEditing(false);
            refetch();
        } catch (err: any) {
            showError(err.message || 'Error al actualizar perfil');
        }
    };

    return (
        <section className="profile section">
            <div className="container">
                <div className="row">
                    {/* Sidebar Profile Info */}
                    <div className="col-lg-4 mb-4">
                        {/* ... Existing Sidebar ... */}
                        <div className="card shadow-sm h-100">
                            <div className="card-body text-center p-4">
                                <div className="mb-3">
                                    <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center mx-auto"
                                        style={{ width: '80px', height: '80px', fontSize: '2rem' }}>
                                        {userData?.profile?.nombre?.charAt(0) || 'U'}
                                    </div>
                                </div>
                                <h4>{userData?.profile?.nombre} {userData?.profile?.apellido}</h4>
                                <p className="text-muted">{user?.Email}</p>
                                <div className="d-grid gap-2 mt-3">
                                    <span className="badge bg-success p-2">
                                        Total Gastado: ${userData?.totalSpent?.toFixed(2) || '0.00'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="col-lg-8">
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
                                            <div className="col-sm-3 col-form-label">Nombre</div>
                                            <div className="col-sm-9">
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    value={editForm.Nombre}
                                                    onChange={(e) => setEditForm({ ...editForm, Nombre: e.target.value })}
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="row mb-3">
                                            <div className="col-sm-3 col-form-label">Apellido</div>
                                            <div className="col-sm-9">
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    value={editForm.Apellido}
                                                    onChange={(e) => setEditForm({ ...editForm, Apellido: e.target.value })}
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="row mb-3">
                                            <div className="col-sm-3 col-form-label">Teléfono</div>
                                            <div className="col-sm-9">
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    value={editForm.Telefono}
                                                    onChange={(e) => setEditForm({ ...editForm, Telefono: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                        <div className="row mb-3">
                                            <div className="col-sm-3 col-form-label">Nueva Contraseña</div>
                                            <div className="col-sm-9">
                                                <input
                                                    type="password"
                                                    className="form-control"
                                                    placeholder="Dejar vacía para mantener la actual"
                                                    value={editForm.password}
                                                    onChange={(e) => setEditForm({ ...editForm, password: e.target.value })}
                                                />
                                                <small className="text-muted">Min. 6 caracteres si se cambia.</small>
                                            </div>
                                        </div>
                                        <div className="text-end">
                                            <button type="button" className="btn btn-secondary me-2" onClick={() => setIsEditing(false)}>Cancelar</button>
                                            <button type="submit" className="btn btn-primary">Guardar Cambios</button>
                                        </div>
                                    </form>
                                ) : (
                                    <>
                                        <div className="row mb-3">
                                            <div className="col-sm-3"><strong>Nombre:</strong></div>
                                            <div className="col-sm-9">{userData?.profile?.nombre}</div>
                                        </div>
                                        <div className="row mb-3">
                                            <div className="col-sm-3"><strong>Apellido:</strong></div>
                                            <div className="col-sm-9">{userData?.profile?.apellido}</div>
                                        </div>
                                        <div className="row mb-3">
                                            <div className="col-sm-3"><strong>Teléfono:</strong></div>
                                            <div className="col-sm-9">{userData?.profile?.telefono || 'No registrado'}</div>
                                        </div>
                                        <div className="row mb-3">
                                            <div className="col-sm-3"><strong>Fecha Registro:</strong></div>
                                            <div className="col-sm-9">
                                                {userData?.profile?.fechaRegistro
                                                    ? new Date(userData.profile.fechaRegistro).toLocaleDateString()
                                                    : 'N/A'}
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        <div className="card shadow-sm">
                            <div className="card-header bg-white py-3">
                                <h5 className="mb-0">Mis Reservas Recientes</h5>
                            </div>
                            <div className="card-body p-0">
                                {bookings.length > 0 ? (
                                    <div className="table-responsive">
                                        <table className="table table-hover mb-0">
                                            <thead className="table-light">
                                                <tr>
                                                    <th>Cód</th>
                                                    <th>Tour</th>
                                                    <th>Fecha Tour</th>
                                                    <th>Total</th>
                                                    <th>Estado</th>
                                                    <th>Factura</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {bookings.map((b: any) => (
                                                    <tr key={b.codigo}>
                                                        <td><small>{b.codigo}</small></td>
                                                        <td>{b.package?.nombre}</td>
                                                        <td>{b.fechaInicio ? new Date(b.fechaInicio).toLocaleDateString() : 'N/A'}</td>
                                                        <td>${b.total.toFixed(2)}</td>
                                                        <td>
                                                            <span className={`badge ${b.estado === 'Confirmado' ? 'bg-success' : 'bg-warning'}`}>
                                                                {b.estado}
                                                            </span>
                                                        </td>
                                                        <td>
                                                            {b.facturaId && (
                                                                <button
                                                                    className="btn btn-sm btn-outline-primary"
                                                                    onClick={async () => {
                                                                        try {
                                                                            const { FacturasService } = await import('../services/FacturasService');
                                                                            await FacturasService.downloadInvoicePdf(b.facturaId);
                                                                        } catch (error) {
                                                                            showError('Error al descargar factura');
                                                                        }
                                                                    }}
                                                                    title="Descargar factura PDF"
                                                                >
                                                                    <i className="bi bi-file-earmark-pdf"></i> PDF
                                                                </button>
                                                            )}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                        {/* Pagination */}
                                        {totalPages > 1 && (
                                            <nav className="mt-3">
                                                <ul className="pagination justify-content-center mb-0">
                                                    <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                                        <button className="page-link" onClick={() => setCurrentPage(currentPage - 1)}>
                                                            &laquo; Anterior
                                                        </button>
                                                    </li>
                                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                                        <li key={page} className={`page-item ${currentPage === page ? 'active' : ''}`}>
                                                            <button className="page-link" onClick={() => setCurrentPage(page)}>
                                                                {page}
                                                            </button>
                                                        </li>
                                                    ))}
                                                    <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                                                        <button className="page-link" onClick={() => setCurrentPage(currentPage + 1)}>
                                                            Siguiente &raquo;
                                                        </button>
                                                    </li>
                                                </ul>
                                            </nav>
                                        )}
                                    </div>
                                ) : (
                                    <div className="p-4 text-center text-muted">No tienes reservas recientes.</div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default UserProfile;
