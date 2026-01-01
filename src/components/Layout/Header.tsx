import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useCart } from '../../hooks/useCart';

const Header: React.FC = () => {
    const { user, logout, isAuthenticated } = useAuth();
    const { cartCount } = useCart();

    return (
        <header id="header" className="header d-flex align-items-center fixed-top">
            <div className="header-container container-fluid container-xl position-relative d-flex align-items-center justify-content-between">
                <Link to="/" className="logo d-flex align-items-center me-auto me-xl-0">
                    <h1 className="sitename">WorldAgency</h1>
                </Link>

                <nav id="navmenu" className="navmenu">
                    <ul>
                        <li>
                            <Link to="/">Inicio</Link>
                        </li>
                        <li>
                            <Link to="/about">Sobre Nosotros</Link>
                        </li>
                        <li>
                            <Link to="/destinations">Destinos</Link>
                        </li>
                        <li>
                            <Link to="/tours">Tours</Link>
                        </li>
                        {!isAuthenticated ? (
                            <li>
                                <Link to="/login">Iniciar Sesión</Link>
                            </li>
                        ) : (
                            <li className="dropdown">
                                <a href="#">
                                    <span>Hola, {user?.Nombre || 'Usuario'}</span>{' '}
                                    <i className="bi bi-chevron-down toggle-dropdown"></i>
                                </a>
                                <ul>
                                    <li>
                                        <Link to="/profile">Mi Perfil</Link>
                                    </li>
                                    {user?.EsAdmin && (
                                        <li>
                                            <Link to="/admin">Panel Admin</Link>
                                        </li>
                                    )}
                                    <li>
                                        <a href="#" onClick={(e) => { e.preventDefault(); logout(); }}>
                                            Cerrar Sesión
                                        </a>
                                    </li>
                                </ul>
                            </li>
                        )}
                    </ul>
                    <i className="mobile-nav-toggle d-xl-none bi bi-list"></i>
                </nav>

                <Link className="btn-shopping-cart" to="/cart">
                    <i className="bi bi-cart"></i>
                    {cartCount > 0 && <span className="badge bg-danger">{cartCount}</span>}
                </Link>

                {!isAuthenticated ? (
                    <Link className="btn-getstarted" to="/register">
                        Registrarse
                    </Link>
                ) : (
                    <a
                        className="btn-getstarted"
                        href="#"
                        onClick={(e) => {
                            e.preventDefault();
                            logout();
                        }}
                    >
                        Cerrar Sesión
                    </a>
                )}
            </div>
        </header>
    );
};

export default Header;
