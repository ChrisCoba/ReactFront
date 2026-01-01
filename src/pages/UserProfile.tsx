import React from 'react';
import { useAuth } from '../hooks/useAuth';

const UserProfile: React.FC = () => {
    const { user } = useAuth();

    return (
        <section className="profile section">
            <div className="container">
                <div className="row">
                    <div className="col-lg-8 mx-auto">
                        <div className="card">
                            <div className="card-body p-5">
                                <h2 className="mb-4">Mi Perfil</h2>

                                <div className="mb-3">
                                    <label className="form-label"><strong>Nombre:</strong></label>
                                    <p>{user?.Nombre}</p>
                                </div>

                                <div className="mb-3">
                                    <label className="form-label"><strong>Apellido:</strong></label>
                                    <p>{user?.Apellido}</p>
                                </div>

                                <div className="mb-3">
                                    <label className="form-label"><strong>Correo Electrónico:</strong></label>
                                    <p>{user?.Email}</p>
                                </div>

                                <div className="mb-3">
                                    <label className="form-label"><strong>Tipo de Cuenta:</strong></label>
                                    <p>{user?.EsAdmin ? 'Administrador' : 'Usuario'}</p>
                                </div>

                                <div className="alert alert-info">
                                    <i className="bi bi-info-circle me-2"></i>
                                    La funcionalidad de editar perfil estará disponible próximamente.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default UserProfile;
