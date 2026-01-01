import React from 'react';

const About: React.FC = () => {
    return (
        <section className="about section">
            <div className="container">
                <div className="row mb-4">
                    <div className="col-12 text-center">
                        <h2>Sobre Nosotros</h2>
                        <p className="lead">Conoce más sobre WorldAgency y nuestra pasión por los viajes</p>
                    </div>
                </div>

                <div className="row align-items-center mb-5">
                    <div className="col-lg-6">
                        <img
                            src="/assets/img/travel/about.jpg"
                            alt="Sobre Nosotros"
                            className="img-fluid rounded"
                        />
                    </div>
                    <div className="col-lg-6">
                        <h3>Nuestra Historia</h3>
                        <p>
                            WorldAgency es una agencia de viajes con años de experiencia en la industria turística. Nos
                            especializamos en crear experiencias inolvidables para nuestros clientes, ofreciendo tours
                            personalizados a los destinos más exóticos y hermosos del mundo.
                        </p>
                        <p>
                            Nuestro equipo está compuesto por expertos locales que conocen cada rincón de los destinos que
                            ofrecemos, garantizando así la mejor experiencia posible para nuestros viajeros.
                        </p>
                    </div>
                </div>

                <div className="row text-center">
                    <div className="col-lg-4 mb-4">
                        <div className="feature-card p-4">
                            <i className="bi bi-award-fill display-4 text-primary mb-3"></i>
                            <h4>Experiencia</h4>
                            <p>Más de 10 años en la industria turística</p>
                        </div>
                    </div>
                    <div className="col-lg-4 mb-4">
                        <div className="feature-card p-4">
                            <i className="bi bi-people-fill display-4 text-primary mb-3"></i>
                            <h4>Clientes Satisfechos</h4>
                            <p>Miles de viajeros felices cada año</p>
                        </div>
                    </div>
                    <div className="col-lg-4 mb-4">
                        <div className="feature-card p-4">
                            <i className="bi bi-globe display-4 text-primary mb-3"></i>
                            <h4>Destinos</h4>
                            <p>Tours a más de 50 países en todo el mundo</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default About;
