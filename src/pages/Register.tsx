import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Register: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [nombre, setNombre] = useState('');
    const [apellido, setApellido] = useState('');
    const [claveAdmin, setClaveAdmin] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await register({ email, password, nombre, apellido, claveAdmin });
            navigate('/');
        } catch (err: any) {
            setError(err.message || 'Error al registrarse');
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="register section">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-lg-6 col-md-8">
                        <div className="card shadow">
                            <div className="card-body p-5">
                                <h2 className="text-center mb-4">Crear Cuenta</h2>

                                {error && (
                                    <div className="alert alert-danger" role="alert">
                                        {error}
                                    </div>
                                )}

                                <form onSubmit={handleSubmit}>
                                    <div className="row mb-3">
                                        <div className="col-md-6">
                                            <label htmlFor="nombre" className="form-label">
                                                Nombre
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="nombre"
                                                value={nombre}
                                                onChange={(e) => setNombre(e.target.value)}
                                                required
                                            />
                                        </div>
                                        <div className="col-md-6">
                                            <label htmlFor="apellido" className="form-label">
                                                Apellido
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="apellido"
                                                value={apellido}
                                                onChange={(e) => setApellido(e.target.value)}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="email" className="form-label">
                                            Correo Electrónico
                                        </label>
                                        <input
                                            type="email"
                                            className="form-control"
                                            id="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="password" className="form-label">
                                            Contraseña
                                        </label>
                                        <input
                                            type="password"
                                            className="form-control"
                                            id="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                            minLength={6}
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="claveAdmin" className="form-label">
                                            Clave de Administrador (opcional)
                                        </label>
                                        <input
                                            type="password"
                                            className="form-control"
                                            id="claveAdmin"
                                            value={claveAdmin}
                                            onChange={(e) => setClaveAdmin(e.target.value)}
                                        />
                                        <small className="form-text text-muted">
                                            Solo si deseas registrarte como administrador
                                        </small>
                                    </div>

                                    <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                                        {loading ? 'Creando cuenta...' : 'Registrarse'}
                                    </button>
                                </form>

                                <div className="text-center mt-3">
                                    <p>
                                        ¿Ya tienes cuenta? <Link to="/login">Inicia sesión aquí</Link>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Register;
