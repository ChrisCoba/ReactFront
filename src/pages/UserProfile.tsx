import React, { useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { GET_USER_DASHBOARD } from '../graphql/queries';
import { useAuth } from '../hooks/useAuth';
import LoadingSpinner from '../components/LoadingSpinner';

const UserProfile: React.FC = () => {
    const { user } = useAuth();

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
    const bookings = userData?.bookings || [];

    return (
        <section className="profile section">
            <div className="container">
                <div className="row">
                    {/* Sidebar Profile Info */}
                    <div className="col-lg-4 mb-4">
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
                            <div className="card-header bg-white py-3">
                                <h5 className="mb-0">Información Personal</h5>
                            </div>
                            <div className="card-body">
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
                                                    <th>Fecha</th>
                                                    <th>Total</th>
                                                    <th>Estado</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {bookings.map((b: any) => (
                                                    <tr key={b.codigo}>
                                                        <td><small>{b.codigo}</small></td>
                                                        <td>{b.package?.nombre}</td>
                                                        <td>{new Date(b.fechaReserva).toLocaleDateString()}</td>
                                                        <td>${b.total.toFixed(2)}</td>
                                                        <td>
                                                            <span className={`badge ${b.estado === 'Confirmado' ? 'bg-success' : 'bg-warning'}`}>
                                                                {b.estado}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
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
