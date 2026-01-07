import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { GET_PACKAGES } from '../graphql/queries';
import { ReservasService } from '../services/ReservasService';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../hooks/useCart';
import TourCard from '../components/TourCard';
import LoadingSpinner from '../components/LoadingSpinner';
import type { Tour } from '../types/Tour';

const Tours: React.FC = () => {
    const { loading, error, data } = useQuery(GET_PACKAGES);
    const [tours, setTours] = useState<Tour[]>([]);
    const [filteredTours, setFilteredTours] = useState<Tour[]>([]);
    const [destinations, setDestinations] = useState<string[]>([]);

    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const { addToCart } = useCart();

    // Filters
    const [filterDestination, setFilterDestination] = useState(searchParams.get('destination') || '');
    const [filterType, setFilterType] = useState('');
    const [filterPrice, setFilterPrice] = useState('');
    const [filterDuration, setFilterDuration] = useState('');

    useEffect(() => {
        if (data && data.packages) {
            // Filter only active tours (activo !== false)
            const activePackages = data.packages.filter((pkg: any) => pkg.activo !== false);

            const mappedTours: Tour[] = activePackages.map((pkg: any) => ({
                IdPaquete: pkg.id,
                Nombre: pkg.nombre,
                Ciudad: pkg.ciudad,
                Pais: pkg.pais,
                Descripcion: pkg.descripcion,
                PrecioActual: pkg.precio,
                Duracion: pkg.duracion,
                ImagenUrl: pkg.imagen || 'https://via.placeholder.com/400x300?text=Tour',
                FechaInicio: pkg.fechaInicio,
                TipoActividad: pkg.tipoActividad,
                CuposDisponibles: pkg.cuposDisponibles,
                Estado: 1
            }));
            setTours(mappedTours);

            const cities = [...new Set(mappedTours.map((tour) => tour.Ciudad))].sort();
            setDestinations(cities);
        }
    }, [data]);

    useEffect(() => {
        applyFilters();
    }, [tours, filterDestination, filterType, filterPrice, filterDuration]);

    const applyFilters = () => {
        let filtered = [...tours];

        if (filterDestination) {
            filtered = filtered.filter((tour) => tour.Ciudad === filterDestination);
        }

        if (filterType) {
            filtered = filtered.filter((tour) => tour.TipoActividad === filterType);
        }

        if (filterPrice) {
            const maxPrice = parseInt(filterPrice);
            filtered = filtered.filter((tour) => tour.PrecioActual <= maxPrice);
        }

        if (filterDuration) {
            const [min, max] = filterDuration.split('-').map(Number);
            filtered = filtered.filter((tour) => tour.Duracion >= min && tour.Duracion <= max);
        }

        setFilteredTours(filtered);
    };

    const handleAddToCart = async (tourId: string, adults: number, children: number, date: string) => {
        if (!isAuthenticated) {
            alert('Debes iniciar sesión para hacer una reserva.');
            navigate('/login');
            return;
        }

        const tour = tours.find((t) => t.IdPaquete === tourId);
        if (!tour) throw new Error('Tour no encontrado');

        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const totalPersonas = adults + children;

        try {
            // Keep using REST for writes (Mutations not available yet)
            const holdData = {
                IdPaquete: tourId,
                BookingUserId: user.Email,
                FechaInicio: date,
                Personas: totalPersonas,
                DuracionHoldSegundos: 600,
            };

            const holdResponse = await ReservasService.hold(holdData);

            const bookData = {
                IdPaquete: tourId,
                HoldId: holdResponse.HoldId,
                BookingUserId: user.Email,
                MetodoPago: 'Pendiente',
                Turistas: [],
            };

            const reserva = await ReservasService.book(bookData);

            addToCart(
                tourId,
                tour.Nombre,
                tour.PrecioActual,
                tour.Duracion,
                adults,
                children,
                date,
                tour.ImagenUrl,
                reserva.IdReserva
            );

            const availabilityMsg = holdResponse.CuposDisponibles !== undefined
                ? `\n\nCupos disponibles para esta fecha: ${holdResponse.CuposDisponibles}`
                : '';

            if (confirm(`Agregado al carrito: ${tour.Nombre} para ${date}${availabilityMsg}\n¿Deseas ver tu carrito?`)) {
                navigate('/cart');
            }
        } catch (err: any) {
            alert(`Error al reservar: ${err.message}`);
        }
    };

    if (loading) return <LoadingSpinner />;
    if (error) return <div className="text-center mt-5 text-danger">Error cargando tours: {error.message}</div>;

    return (
        <section className="tours-list section">
            <div className="container">
                <div className="row mb-4">
                    <div className="col-12">
                        <h2>Tours Disponibles</h2>
                    </div>
                </div>

                {/* Filters */}
                <div className="row mb-4">
                    <div className="col-md-3">
                        <select
                            className="form-select"
                            value={filterDestination}
                            onChange={(e) => setFilterDestination(e.target.value)}
                        >
                            <option value="">Todos los destinos</option>
                            {destinations.map((city) => (
                                <option key={city} value={city}>{city}</option>
                            ))}
                        </select>
                    </div>
                    <div className="col-md-3">
                        <select
                            className="form-select"
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                        >
                            <option value="">Tipo de actividad</option>
                            <option value="Aventura">Aventura</option>
                            <option value="Cultural">Cultural</option>
                            <option value="Relajación">Relajación</option>
                            <option value="Naturaleza">Naturaleza</option>
                            <option value="Gastronomía">Gastronomía</option>
                        </select>
                    </div>
                    <div className="col-md-3">
                        <select
                            className="form-select"
                            value={filterPrice}
                            onChange={(e) => setFilterPrice(e.target.value)}
                        >
                            <option value="">Rango de precio</option>
                            <option value="100">Hasta $100</option>
                            <option value="300">Hasta $300</option>
                            <option value="500">Hasta $500</option>
                            <option value="1000">Hasta $1000</option>
                        </select>
                    </div>
                    <div className="col-md-3">
                        <select
                            className="form-select"
                            value={filterDuration}
                            onChange={(e) => setFilterDuration(e.target.value)}
                        >
                            <option value="">Duración</option>
                            <option value="1-3">1-3 días</option>
                            <option value="4-7">4-7 días</option>
                            <option value="8-14">8-14 días</option>
                        </select>
                    </div>
                </div>

                {/* Tours List */}
                <div className="row">
                    {filteredTours.length > 0 ? (
                        filteredTours.map((tour) => (
                            <TourCard key={tour.IdPaquete} tour={tour} onAddToCart={handleAddToCart} />
                        ))
                    ) : (
                        <div className="col-12 text-center">
                            <p>No se encontraron tours que coincidan con tus criterios.</p>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default Tours;
