import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
    return (
        <footer id="footer" className="footer position-relative dark-background">
            <div className="container footer-top">
                <div className="row gy-4">
                    <div className="col-lg-4 col-md-6 footer-about">
                        <Link to="/" className="d-flex align-items-center">
                            <span className="sitename">WorldAgency</span>
                        </Link>
                        <div className="footer-contact pt-3">
                            <p>Av. 9 de Octubre</p>
                            <p>Guayaquil, Ecuador</p>
                            <p className="mt-3">
                                <strong>Teléfono:</strong> <span>+593 987654321</span>
                            </p>
                            <p>
                                <strong>Correo:</strong> <span>worldagency@gmail.com</span>
                            </p>
                        </div>
                    </div>

                    <div className="col-lg-2 col-md-3 footer-links">
                        <h4>Enlaces Útiles</h4>
                        <ul>
                            <li>
                                <i className="bi bi-chevron-right"></i> <Link to="/">Inicio</Link>
                            </li>
                            <li>
                                <i className="bi bi-chevron-right"></i> <Link to="/about">Sobre Nosotros</Link>
                            </li>
                            <li>
                                <i className="bi bi-chevron-right"></i> <Link to="/destinations">Destinos</Link>
                            </li>
                            <li>
                                <i className="bi bi-chevron-right"></i> <Link to="/tours">Tours</Link>
                            </li>
                        </ul>
                    </div>

                    <div className="col-lg-6 col-md-12">
                        <h4>Síguenos</h4>
                        <p>Nuestros canales de redes sociales</p>
                        <div className="social-links d-flex">
                            <a href="#">
                                <i className="bi bi-twitter-x"></i>
                            </a>
                            <a href="#">
                                <i className="bi bi-facebook"></i>
                            </a>
                            <a href="#">
                                <i className="bi bi-instagram"></i>
                            </a>
                            <a href="#">
                                <i className="bi bi-linkedin"></i>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
