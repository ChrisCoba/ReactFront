import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Register: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [nombre, setNombre] = useState('');
    const [apellido, setApellido] = useState('');
    const [cedula, setCedula] = useState('');
    const [error, setError] = useState('');
    const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    // Validate only letters (including Spanish characters)
    const validateOnlyLetters = (value: string): boolean => {
        const lettersOnly = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/;
        return lettersOnly.test(value) || value === '';
    };

    // Validate email format
    const validateEmail = (value: string): boolean => {
        const atCount = (value.match(/@/g) || []).length;
        if (atCount > 1) return false;
        if (atCount === 1 && !value.endsWith('.com')) return false;
        return true;
    };

    // Validate password - min 6 chars + special character
    const validatePassword = (value: string): boolean => {
        const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(value);
        return value.length >= 6 && hasSpecialChar;
    };

    // Validate cedula - only numbers, max 13 chars
    const validateCedula = (value: string): boolean => {
        const numbersOnly = /^[0-9]*$/;
        return numbersOnly.test(value) && value.length <= 13;
    };

    const handleCedulaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (validateCedula(value)) {
            setCedula(value);
            setFieldErrors(prev => ({ ...prev, cedula: '' }));
        } else {
            setFieldErrors(prev => ({ ...prev, cedula: 'Solo números, máximo 13 dígitos' }));
        }
    };

    const handleNombreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (validateOnlyLetters(value)) {
            setNombre(value);
            setFieldErrors(prev => ({ ...prev, nombre: '' }));
        } else {
            setFieldErrors(prev => ({ ...prev, nombre: 'Solo se permiten letras' }));
        }
    };

    const handleApellidoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (validateOnlyLetters(value)) {
            setApellido(value);
            setFieldErrors(prev => ({ ...prev, apellido: '' }));
        } else {
            setFieldErrors(prev => ({ ...prev, apellido: 'Solo se permiten letras' }));
        }
    };

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.toLowerCase();
        setEmail(value);

        if (!validateEmail(value)) {
            setFieldErrors(prev => ({ ...prev, email: 'El correo debe tener un solo @ y terminar en .com' }));
        } else {
            setFieldErrors(prev => ({ ...prev, email: '' }));
        }
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setPassword(value);

        if (value.length > 0 && !validatePassword(value)) {
            setFieldErrors(prev => ({ ...prev, password: 'Mínimo 6 caracteres y un carácter especial (!@#$%^&*...)' }));
        } else {
            setFieldErrors(prev => ({ ...prev, password: '' }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // Final validations
        if (!validateOnlyLetters(nombre) || nombre.trim() === '') {
            setError('El nombre solo debe contener letras');
            return;
        }
        if (!validateOnlyLetters(apellido) || apellido.trim() === '') {
            setError('El apellido solo debe contener letras');
            return;
        }
        if (!email.includes('@') || !email.endsWith('.com')) {
            setError('El correo debe contener @ y terminar en .com');
            return;
        }
        if ((email.match(/@/g) || []).length !== 1) {
            setError('El correo debe tener exactamente un @');
            return;
        }
        if (!validatePassword(password)) {
            setError('La contraseña debe tener mínimo 6 caracteres y un carácter especial');
            return;
        }

        setLoading(true);

        try {
            await register({ email, password, nombre, apellido, cedula });
            navigate('/');
        } catch (err: any) {
            setError(err.message || 'Error al registrarse');
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
                            <i className="bi bi-person-plus"></i>
                        </div>
                        <h3>¡Únete a WorldAgency!</h3>
                        <p>Crea tu cuenta y comienza a explorar destinos increíbles</p>
                    </div>
                </div>

                {/* Right Side - Form */}
                <div className="auth-form-side">
                    <div className="auth-form-container">
                        <h2>Crear Cuenta</h2>

                        {error && (
                            <div className="alert alert-danger" role="alert">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit}>
                            <div className="auth-input-row">
                                <div className="auth-input-group">
                                    <label htmlFor="nombre">
                                        <i className="bi bi-person"></i> Nombre
                                    </label>
                                    <input
                                        type="text"
                                        id="nombre"
                                        value={nombre}
                                        onChange={handleNombreChange}
                                        placeholder="Tu nombre"
                                        className={fieldErrors.nombre ? 'input-error' : ''}
                                        required
                                    />
                                    {fieldErrors.nombre && <span className="field-error">{fieldErrors.nombre}</span>}
                                </div>
                                <div className="auth-input-group">
                                    <label htmlFor="apellido">
                                        <i className="bi bi-person"></i> Apellido
                                    </label>
                                    <input
                                        type="text"
                                        id="apellido"
                                        value={apellido}
                                        onChange={handleApellidoChange}
                                        placeholder="Tu apellido"
                                        className={fieldErrors.apellido ? 'input-error' : ''}
                                        required
                                    />
                                    {fieldErrors.apellido && <span className="field-error">{fieldErrors.apellido}</span>}
                                </div>
                            </div>

                            <div className="auth-input-group">
                                <label htmlFor="cedula">
                                    <i className="bi bi-card-text"></i> Número de CI/Pasaporte
                                </label>
                                <input
                                    type="text"
                                    id="cedula"
                                    value={cedula}
                                    onChange={handleCedulaChange}
                                    placeholder="Ej: 1234567890"
                                    className={fieldErrors.cedula ? 'input-error' : ''}
                                    maxLength={13}
                                    required
                                />
                                {fieldErrors.cedula && <span className="field-error">{fieldErrors.cedula}</span>}
                            </div>

                            <div className="auth-input-group">
                                <label htmlFor="email">
                                    <i className="bi bi-envelope"></i> Correo Electrónico
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={handleEmailChange}
                                    placeholder="tu@correo.com"
                                    className={fieldErrors.email ? 'input-error' : ''}
                                    required
                                />
                                {fieldErrors.email && <span className="field-error">{fieldErrors.email}</span>}
                            </div>

                            <div className="auth-input-group">
                                <label htmlFor="password">
                                    <i className="bi bi-lock"></i> Contraseña
                                </label>
                                <input
                                    type="password"
                                    id="password"
                                    value={password}
                                    onChange={handlePasswordChange}
                                    placeholder="Mínimo 6 caracteres + especial"
                                    className={fieldErrors.password ? 'input-error' : ''}
                                    required
                                />
                                {fieldErrors.password && <span className="field-error">{fieldErrors.password}</span>}
                            </div>

                            <button type="submit" className="auth-submit-btn" disabled={loading}>
                                {loading ? 'Creando cuenta...' : 'Registrarse'}
                            </button>
                        </form>

                        <div className="auth-footer">
                            <p>
                                ¿Ya tienes cuenta? <Link to="/login">Inicia sesión aquí</Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Register;
