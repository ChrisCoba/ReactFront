import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useCart } from '../../hooks/useCart';

const Header: React.FC = () => {
    const { user, logout, isAuthenticated } = useAuth();
    const { cartCount } = useCart();
    const [isMobileNavActive, setIsMobileNavActive] = useState(false);
    const location = useLocation();

    const toggleMobileNav = () => {
        setIsMobileNavActive(!isMobileNavActive);
        document.body.classList.toggle('mobile-nav-active');
    };

    const closeMobileNav = () => {
        setIsMobileNavActive(false);
        document.body.classList.remove('mobile-nav-active');
    };

    return (
        <header id="header" className={`header d-flex align-items-center fixed-top ${location.pathname !== '/' ? 'header-inner-pages' : ''}`}>
            <div className="header-container container-fluid container-xl position-relative d-flex align-items-center justify-content-between">
                <Link to="/" className="logo d-flex align-items-center me-auto me-xl-0" onClick={closeMobileNav}>
                    <h1 className="sitename">WorldAgency</h1>
                </Link>

                <nav id="navmenu" className={`navmenu ${isMobileNavActive ? 'mobile-nav-active' : ''}`}>
                    <ul>
                        <li>
                            <Link to="/" className={location.pathname === '/' ? 'active' : ''} onClick={closeMobileNav}>Inicio</Link>
                        </li>
                        <li>
                            <Link to="/about" className={location.pathname === '/about' ? 'active' : ''} onClick={closeMobileNav}>Sobre Nosotros</Link>
                        </li>
                        <li>
                            <Link to="/destinations" className={location.pathname === '/destinations' ? 'active' : ''} onClick={closeMobileNav}>Destinos</Link>
                        </li>
                        <li>
                            <Link to="/tours" className={location.pathname === '/tours' ? 'active' : ''} onClick={closeMobileNav}>Tours</Link>
                        </li>
                        {isAuthenticated && (
                            <li className="dropdown">
                                <a href="#">
                                    <span>Hola, {user?.Nombre || 'Usuario'}</span>{' '}
                                    <i className="bi bi-chevron-down toggle-dropdown"></i>
                                </a>
                                <ul>
                                    <li>
                                        <Link to="/profile" onClick={closeMobileNav}>Mi Perfil</Link>
                                    </li>
                                    {user?.EsAdmin && (
                                        <li>
                                            <Link to="/admin" onClick={closeMobileNav}>Panel Admin</Link>
                                        </li>
                                    )}
                                    <li>
                                        <a href="#" onClick={(e) => { e.preventDefault(); logout(); closeMobileNav(); }}>
                                            Cerrar Sesión
                                        </a>
                                    </li>
                                </ul>
                            </li>
                        )}
                    </ul>
                </nav>
            </div>

            {/* Right side buttons - fixed to top right */}
            <div className="header-actions">
                {/* Mobile Toggle */}
                <i className={`mobile-nav-toggle d-xl-none bi ${isMobileNavActive ? 'bi-x' : 'bi-list'}`} onClick={toggleMobileNav}></i>

                {!isAuthenticated ? (
                    <div className="d-flex gap-2">
                        <Link className="btn-auth btn-auth-outline d-none d-md-block" to="/login">
                            Iniciar Sesión
                        </Link>
                        <Link className="btn-auth btn-auth-filled d-none d-md-block" to="/register">
                            Registrarse
                        </Link>
                    </div>
                ) : (
                    <a
                        className="btn-auth btn-auth-filled d-none d-md-block"
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

            {/* Floating Cart Button - top right corner (below auth buttons) */}
            <Link className="floating-cart-btn" to="/cart" onClick={closeMobileNav}>
                <i className="bi bi-cart"></i>
                {cartCount > 0 && <span className="badge bg-danger">{cartCount}</span>}
            </Link>
        </header>
    );
};

export default Header;
