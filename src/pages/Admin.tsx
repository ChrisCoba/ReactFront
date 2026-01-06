import React, { useEffect, useState } from 'react';
import { useQuery } from '@apollo/client';
import { GET_ADMIN_DASHBOARD } from '../graphql/queries';
import LoadingSpinner from '../components/LoadingSpinner';
import { UsersTable } from '../components/Admin/UsersTable';
import { ToursTable } from '../components/Admin/ToursTable';
import { ReservationsTable } from '../components/Admin/ReservationsTable';

const Admin: React.FC = () => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const { data, loading, error, refetch } = useQuery(GET_ADMIN_DASHBOARD, {
        fetchPolicy: 'network-only'
    });

    useEffect(() => {
        if (activeTab === 'dashboard') {
            refetch();
        }
    }, [refetch, activeTab]);

    if (loading) return <LoadingSpinner />;

    const stats = data?.dashboardStats || {
        totalUsers: 0,
        totalReservations: 0,
        totalRevenue: 0,
        recentBookings: [],
        topPackages: []
    };

    const renderDashboard = () => (
        <>
            {/* Stats Grid */}
            <div className="row mb-4">
                <div className="col-md-4 mb-3">
                    <div className="card text-center shadow-sm h-100 border-primary">
                        <div className="card-body">
                            <i className="bi bi-people-fill display-4 text-primary mb-2"></i>
                            <h3 className="card-title display-6">{stats.totalUsers}</h3>
                            <p className="card-text text-muted">Usuarios Registrados</p>
                        </div>
                    </div>
                </div>
                {/* ... other stats ... */}
                <div className="col-md-4 mb-3">
                    <div className="card text-center shadow-sm h-100 border-success">
                        <div className="card-body">
                            <i className="bi bi-calendar-check-fill display-4 text-success mb-2"></i>
                            <h3 className="card-title display-6">{stats.totalReservations}</h3>
                            <p className="card-text text-muted">Total Reservas</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-4 mb-3">
                    <div className="card text-center shadow-sm h-100 border-warning">
                        <div className="card-body">
                            <i className="bi bi-cash-coin display-4 text-warning mb-2"></i>
                            <h3 className="card-title display-6">${stats.totalRevenue.toFixed(2)}</h3>
                            <p className="card-text text-muted">Ingresos Totales</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row">
                {/* Recent Deliveries */}
                <div className="col-lg-8">
                    <div className="card shadow-sm mb-4">
                        <div className="card-header bg-white py-3">
                            <h5 className="mb-0">Reservas Recientes</h5>
                        </div>
                        <div className="card-body p-0">
                            <div className="table-responsive">
                                <table className="table table-hover mb-0">
                                    <thead className="table-light">
                                        <tr>
                                            <th>Cód</th>
                                            <th>Cliente</th>
                                            <th>Tour</th>
                                            <th>Fecha</th>
                                            <th>Total</th>
                                            <th>Estado</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {stats.recentBookings.length > 0 ? (
                                            stats.recentBookings.map((booking: any) => (
                                                <tr key={booking.codigo}>
                                                    <td><small>{booking.codigo}</small></td>
                                                    <td>{booking.cliente?.email}</td>
                                                    <td>{booking.package?.nombre}</td>
                                                    <td>{new Date(booking.fechaReserva).toLocaleDateString()}</td>
                                                    <td>${booking.total.toFixed(2)}</td>
                                                    <td>
                                                        <span className={`badge ${booking.estado === 'Confirmado' ? 'bg-success' : 'bg-warning'}`}>
                                                            {booking.estado}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr><td colSpan={6} className="text-center p-3">No hay reservas recientes</td></tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Top Packages */}
                <div className="col-lg-4">
                    <div className="card shadow-sm">
                        <div className="card-header bg-white py-3">
                            <h5 className="mb-0">Tours Populares</h5>
                        </div>
                        <ul className="list-group list-group-flush">
                            {stats.topPackages.length > 0 ? (
                                stats.topPackages.map((pkg: any, index: number) => (
                                    <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                                        <div>
                                            <strong>{pkg.nombre}</strong>
                                            <div className="small text-muted">{pkg.ciudad}</div>
                                        </div>
                                        <span className="badge bg-primary rounded-pill">${pkg.precio}</span>
                                    </li>
                                ))
                            ) : (
                                <li className="list-group-item text-center text-muted">No hay datos disponibles</li>
                            )}
                        </ul>
                    </div>
                </div>
            </div>
        </>
    );

    return (
        <section className="admin section">
            <div className="container">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2>Panel de Administración</h2>
                    {error && activeTab === 'dashboard' && (
                        <button className="btn btn-outline-danger btn-sm" onClick={() => refetch()}>
                            <i className="bi bi-arrow-clockwise"></i> Reintentar
                        </button>
                    )}
                </div>

                {/* Tabs */}
                <ul className="nav nav-tabs mb-4">
                    <li className="nav-item">
                        <button
                            className={`nav-link ${activeTab === 'dashboard' ? 'active' : ''}`}
                            onClick={() => setActiveTab('dashboard')}
                        >
                            <i className="bi bi-speedometer2 me-2"></i> Dashboard
                        </button>
                    </li>
                    <li className="nav-item">
                        <button
                            className={`nav-link ${activeTab === 'users' ? 'active' : ''}`}
                            onClick={() => setActiveTab('users')}
                        >
                            <i className="bi bi-people me-2"></i> Users
                        </button>
                    </li>
                    <li className="nav-item">
                        <button
                            className={`nav-link ${activeTab === 'tours' ? 'active' : ''}`}
                            onClick={() => setActiveTab('tours')}
                        >
                            <i className="bi bi-geo-alt me-2"></i> Tours (Packages)
                        </button>
                    </li>
                    <li className="nav-item">
                        <button
                            className={`nav-link ${activeTab === 'reservations' ? 'active' : ''}`}
                            onClick={() => setActiveTab('reservations')}
                        >
                            <i className="bi bi-calendar-check me-2"></i> Reservations
                        </button>
                    </li>
                </ul>

                {/* Tab Content */}
                <div className="tab-content">
                    {activeTab === 'dashboard' && renderDashboard()}
                    {activeTab === 'users' && <UsersTable />}
                    {activeTab === 'tours' && <ToursTable />}
                    {activeTab === 'reservations' && <ReservationsTable />}
                </div>
            </div>
        </section>
    );
};

export default Admin;
