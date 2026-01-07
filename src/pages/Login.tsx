import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await login({ email, password });
            navigate('/');
        } catch (err: any) {
            setError(err.message || 'Error al iniciar sesión');
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="auth-section">
            <div className="auth-container">
                {/* Left Side - Illustration */}
                <div className="auth-illustration">
                    <div className="auth-illustration-content">
                        <div className="auth-blob auth-blob-1"></div>
                        <div className="auth-blob auth-blob-2"></div>
                        <div className="auth-illustration-icon">
                            <i className="bi bi-person-circle"></i>
                        </div>
                        <h3>¡Bienvenido de vuelta!</h3>
                        <p>Explora los mejores destinos del mundo con WorldAgency</p>
                    </div>
                </div>

                {/* Right Side - Form */}
                <div className="auth-form-side">
                    <div className="auth-form-container">
                        <h2>Inicio de Sesión</h2>

                        {error && (
                            <div className="alert alert-danger" role="alert">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit}>
                            <div className="auth-input-group">
                                <label htmlFor="email">
                                    <i className="bi bi-envelope"></i> Correo Electrónico
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="tu@correo.com"
                                    required
                                />
                            </div>

                            <div className="auth-input-group">
                                <label htmlFor="password">
                                    <i className="bi bi-lock"></i> Contraseña
                                </label>
                                <input
                                    type="password"
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                />
                            </div>

                            <button type="submit" className="auth-submit-btn" disabled={loading}>
                                {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                            </button>
                        </form>

                        <div className="auth-footer">
                            <p>
                                ¿No tienes cuenta? <Link to="/register">Regístrate aquí</Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Login;
