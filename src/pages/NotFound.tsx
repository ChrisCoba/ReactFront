import React from 'react';
import { Link } from 'react-router-dom';

const NotFound: React.FC = () => {
    return (
        <section className="not-found section">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-lg-6 text-center">
                        <h1 className="display-1">404</h1>
                        <h2>Página No Encontrada</h2>
                        <p className="lead">Lo sentimos, la página que buscas no existe.</p>
                        <Link to="/" className="btn btn-primary">
                            Volver al Inicio
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default NotFound;
