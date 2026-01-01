import React from 'react';

const Admin: React.FC = () => {
    return (
        <section className="admin section">
            <div className="container">
                <div className="row">
                    <div className="col-12">
                        <h2>Panel de Administración</h2>
                        <div className="alert alert-info mt-4">
                            <i className="bi bi-info-circle me-2"></i>
                            El panel de administración completo estará disponible próximamente.
                            Incluirá gestión de tours, usuarios, reservas y facturas.
                        </div>

                        <div className="row mt-4">
                            <div className="col-md-3 mb-3">
                                <div className="card text-center">
                                    <div className="card-body">
                                        <i className="bi bi-people-fill display-4 text-primary"></i>
                                        <h5 className="mt-3">Usuarios</h5>
                                        <p className="text-muted">Gestionar clientes</p>
                                    </div>
                                </div>
                            </div>

                            <div className="col-md-3 mb-3">
                                <div className="card text-center">
                                    <div className="card-body">
                                        <i className="bi bi-map-fill display-4 text-success"></i>
                                        <h5 className="mt-3">Tours</h5>
                                        <p className="text-muted">Gestionar paquetes</p>
                                    </div>
                                </div>
                            </div>

                            <div className="col-md-3 mb-3">
                                <div className="card text-center">
                                    <div className="card-body">
                                        <i className="bi bi-calendar-check-fill display-4 text-warning"></i>
                                        <h5 className="mt-3">Reservas</h5>
                                        <p className="text-muted">Ver reservaciones</p>
                                    </div>
                                </div>
                            </div>

                            <div className="col-md-3 mb-3">
                                <div className="card text-center">
                                    <div className="card-body">
                                        <i className="bi bi-receipt-cutoff display-4 text-danger"></i>
                                        <h5 className="mt-3">Facturas</h5>
                                        <p className="text-muted">Gestionar pagos</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Admin;
