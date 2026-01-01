import React from 'react';

const Destinations: React.FC = () => {
    return (
        <section className="destinations section">
            <div className="container">
                <div className="row">
                    <div className="col-12 text-center">
                        <h2>Destinos Populares</h2>
                        <p>Para ver todos nuestros tours disponibles, visita la página de Tours.</p>
                        <a href="/tours" className="btn btn-primary mt-3">
                            Ver Todos los Tours
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Destinations;
