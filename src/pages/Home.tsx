import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PaquetesService } from '../services/PaquetesService';
import type { Tour } from '../types/Tour';

const Home: React.FC = () => {
    const [destinations, setDestinations] = useState<string[]>([]);
    const [featuredTours, setFeaturedTours] = useState<Tour[]>([]);
    const [selectedDestination, setSelectedDestination] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        loadFeaturedTours();
        loadDestinations();
    }, []);

    const loadFeaturedTours = async () => {
        try {
            const tours = await PaquetesService.search({});
            setFeaturedTours(tours.slice(0, 4));
        } catch (error) {
            console.error('Failed to load featured tours:', error);
        }
    };

    const loadDestinations = async () => {
        try {
            const tours = await PaquetesService.search({});
            const cities = [...new Set(tours.map((tour) => tour.Ciudad))].sort();
            setDestinations(cities);
        } catch (error) {
            console.error('Failed to load destinations:', error);
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedDestination) {
            navigate(`/tours?destination=${selectedDestination}`);
        } else {
            navigate('/tours');
        }
    };

    return (
        <>
            {/* Hero Section */}
            <section id="travel-hero" className="travel-hero section dark-background">
                <div className="hero-background">
                    <video autoPlay muted loop>
                        <source src="/assets/img/travel/video-2.mp4" type="video/mp4" />
                    </video>
                    <div className="hero-overlay"></div>
                </div>

                <div className="container position-relative">
                    <div className="row align-items-center">
                        <div className="col-lg-7">
                            <div className="hero-text" data-aos="fade-up" data-aos-delay="100">
                                <h1 className="hero-title">Descubre Tú Viaje Perfecto</h1>
                                <p className="hero-subtitle">Las experiencias inolvidables están a solo un clic.</p>
                                <div className="hero-buttons">
                                    <a href="#featured-destinations" className="btn btn-primary me-3">
                                        Destinos
                                    </a>
                                    <a href="/tours" className="btn btn-outline">
                                        Tours
                                    </a>
                                </div>
                            </div>
                        </div>

                        <div className="col-lg-5">
                            <div className="booking-form-wrapper" data-aos="fade-left" data-aos-delay="200">
                                <div className="booking-form">
                                    <h3 className="form-title">Planea Tu Viaje</h3>
                                    <form onSubmit={handleSearch}>
                                        <div className="form-group mb-3">
                                            <label htmlFor="destination">Destinos</label>
                                            <select
                                                name="destination"
                                                id="destination"
                                                className="form-select"
                                                value={selectedDestination}
                                                onChange={(e) => setSelectedDestination(e.target.value)}
                                            >
                                                <option value="">Elige tu destino</option>
                                                {destinations.map((city) => (
                                                    <option key={city} value={city}>
                                                        {city}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <button type="submit" className="btn btn-primary w-100">
                                            Buscar Tours
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Why Us Section */}
            <section id="why-us" className="why-us section">
                <div className="container" data-aos="fade-up" data-aos-delay="100">
                    <div className="why-choose-section">
                        <div className="row justify-content-center">
                            <div className="col-lg-8 text-center mb-5">
                                <h3>Porqué Elegirnos Para Tú Próxima Aventura</h3>
                                <p>Somos una agencia de viajes con mucha experiencia en el mercado y confianza con nuestros clientes.</p>
                            </div>
                        </div>

                        <div className="row g-4">
                            <div className="col-lg-4 col-md-6">
                                <div className="feature-card">
                                    <div className="feature-icon">
                                        <i className="bi bi-people-fill"></i>
                                    </div>
                                    <h4>Expertos Locales</h4>
                                    <p>Contamos con expertos locales que te ayudarán a planificar tu viaje.</p>
                                </div>
                            </div>

                            <div className="col-lg-4 col-md-6">
                                <div className="feature-card">
                                    <div className="feature-icon">
                                        <i className="bi bi-shield-check"></i>
                                    </div>
                                    <h4>Salvo & Seguro</h4>
                                    <p>Aseguramos tus viajes con la mejor cobertura.</p>
                                </div>
                            </div>

                            <div className="col-lg-4 col-md-6">
                                <div className="feature-card">
                                    <div className="feature-icon">
                                        <i className="bi bi-cash"></i>
                                    </div>
                                    <h4>Mejores Precios</h4>
                                    <p>Contamos con los mejores precios para tus viajes.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Destinations Section */}
            <section id="featured-destinations" className="featured-destinations section">
                <div className="container section-title" data-aos="fade-up">
                    <h2>Destinos Destacados</h2>
                    <div>
                        <span>Conoce</span> <span className="description-title">Destinos Destacados</span>
                    </div>
                </div>

                <div className="container" data-aos="fade-up" data-aos-delay="100">
                    <div className="row">
                        {featuredTours.map((tour) => (
                            <div key={tour.IdPaquete} className="col-lg-3 col-md-6 mb-4" data-aos="fade-up">
                                <div className="card h-100 shadow-sm border-0">
                                    <div className="position-relative">
                                        <img
                                            src={tour.ImagenUrl || '/assets/img/travel/tour-1.webp'}
                                            className="card-img-top rounded-top"
                                            alt={tour.Nombre}
                                            style={{ height: '200px', objectFit: 'cover' }}
                                            loading="lazy"
                                        />
                                        <div className="position-absolute top-0 end-0 m-2 badge bg-primary">
                                            ${tour.PrecioActual}
                                        </div>
                                    </div>
                                    <div className="card-body">
                                        <h5 className="card-title fw-bold text-truncate">{tour.Nombre}</h5>
                                        <p className="card-text small text-muted mb-2">
                                            <i className="bi bi-geo-alt-fill text-danger"></i> {tour.Ciudad}, {tour.Pais}
                                        </p>
                                        <p className="card-text text-truncate small">
                                            {tour.Descripcion || `Experience ${tour.Ciudad}`}
                                        </p>
                                        <a href="/tours" className="btn btn-sm btn-outline-primary w-100 mt-2">
                                            Ver Detalles
                                        </a>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
};

export default Home;
