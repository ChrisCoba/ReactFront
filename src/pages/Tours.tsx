import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { PaquetesService } from '../services/PaquetesService';
import { ReservasService } from '../services/ReservasService';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../hooks/useCart';
import TourCard from '../components/TourCard';
import LoadingSpinner from '../components/LoadingSpinner';
import type { Tour } from '../types/Tour';

const Tours: React.FC = () => {
    const [tours, setTours] = useState<Tour[]>([]);
    const [filteredTours, setFilteredTours] = useState<Tour[]>([]);
    const [destinations, setDestinations] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
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
        loadTours();
    }, []);

    useEffect(() => {
        applyFilters();
    }, [tours, filterDestination, filterType, filterPrice, filterDuration]);

    const loadTours = async () => {
        try {
            setLoading(true);
            const allTours = await PaquetesService.search({});
            setTours(allTours);

            // Extract unique destinations
            const cities = [...new Set(allTours.map((tour) => tour.Ciudad))].sort();
            setDestinations(cities);
        } catch (error) {
            console.error('Failed to load tours:', error);
        } finally {
            setLoading(false);
        }
    };

    const applyFilters = () => {
        let filtered = [...tours];

        // Filter by destination
        if (filterDestination) {
            filtered = filtered.filter((tour) => tour.Ciudad === filterDestination);
        }

        // Filter by type
        if (filterType) {
            filtered = filtered.filter((tour) => tour.TipoActividad === filterType);
        }

        // Filter by price
        if (filterPrice) {
            const maxPrice = parseInt(filterPrice);
            filtered = filtered.filter((tour) => tour.PrecioActual <= maxPrice);
        }

        // Filter by duration
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

        // Find the tour
        const tour = tours.find((t) => t.IdPaquete === tourId);
        if (!tour) {
            throw new Error('Tour no encontrado');
        }

        const user = JSON.parse(localStorage.getItem('user') || '{}');

        // Create hold + reservation
        const totalPersonas = adults + children;

        const holdData = {
            IdPaquete: tourId,
            BookingUserId: user.Email,
            FechaInicio: date,
            Personas: totalPersonas,
            DuracionHoldSegundos: 600, // 10 minutes
        };

        const holdResponse = await ReservasService.hold(holdData);

        // Book the reservation
        const bookData = {
            IdPaquete: tourId,
            HoldId: holdResponse.HoldId,
            BookingUserId: user.Email,
            MetodoPago: 'Pendiente',
            Turistas: [],
        };

        const reserva = await ReservasService.book(bookData);

        // Add to cart
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
    };

    if (loading) {
        return <LoadingSpinner />;
    }

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
                                <option key={city} value={city}>
                                    {city}
                                </option>
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
