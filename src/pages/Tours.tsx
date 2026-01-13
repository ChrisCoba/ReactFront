import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { GET_PACKAGES } from '../graphql/queries';
import { ReservasService } from '../services/ReservasService';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../hooks/useCart';
import { useToast } from '../context/ToastContext';
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
    const { showSuccess, showError, showWarning } = useToast();

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
                ImagenUrl: pkg.imagen || 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=300&fit=crop',
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
            const [minPrice, maxPrice] = filterPrice.split('-').map(Number);
            filtered = filtered.filter((tour) => tour.PrecioActual >= minPrice && tour.PrecioActual <= maxPrice);
        }

        if (filterDuration) {
            const [min, max] = filterDuration.split('-').map(Number);
            filtered = filtered.filter((tour) => tour.Duracion >= min && tour.Duracion <= max);
        }

        setFilteredTours(filtered);
    };

    const handleAddToCart = async (tourId: string, adults: number, children: number, date: string) => {
        console.log('🎫 ===== RESERVAR CLICK =====');
        console.log('TourId:', tourId);
        console.log('Adultos:', adults, 'Niños:', children);
        console.log('Fecha:', date);

        if (!isAuthenticated) {
            console.log('❌ Usuario no autenticado');
            showWarning('Debes iniciar sesión para hacer una reserva.');
            navigate('/login');
            return;
        }

        const tour = tours.find((t) => t.IdPaquete === tourId);
        if (!tour) {
            console.log('❌ Tour no encontrado:', tourId);
            showError('Tour no encontrado.');
            return;
        }
        console.log('Tour encontrado:', tour);

        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const totalPersonas = adults + children;
        console.log('Usuario:', user);
        console.log('Total personas:', totalPersonas);

        try {
            // Create Pre-Reserva (pending, 300s to pay)
            const preReservaData = {
                UsuarioId: user.Id || 0,
                PaqueteId: parseInt(tourId),
                FechaInicio: date,
                Personas: totalPersonas,
            };
            console.log('📤 Enviando PRE-RESERVA request:', preReservaData);

            const preReservaResponse = await ReservasService.createPreReserva(preReservaData);
            console.log('📥 PRE-RESERVA response:', preReservaResponse);

            // Add to cart with pre-reserva ID (payment happens in Cart)
            addToCart(
                tourId,
                tour.Nombre,
                tour.PrecioActual,
                tour.Duracion,
                adults,
                children,
                date,
                tour.ImagenUrl,
                preReservaResponse.id.toString() // Pre-reserva ID as holdId for cart
            );
            console.log('✅ Agregado al carrito con PreReservaId:', preReservaResponse.id);

            showSuccess(`"${tour.Nombre}" agregado al carrito. Tienes 5 minutos para completar el pago.`);
            navigate('/cart');
        } catch (err: any) {
            console.error('❌ ===== ERROR EN RESERVAR =====');
            console.error('Error completo:', err);
            console.error('Error message:', err.message);
            showError(`Error al reservar: ${err.message || 'Por favor intenta de nuevo.'}`);
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
                            <option value="Interiores">Interiores</option>
                            <option value="Aire Libre">Aire Libre</option>
                        </select>
                    </div>
                    <div className="col-md-3">
                        <select
                            className="form-select"
                            value={filterPrice}
                            onChange={(e) => setFilterPrice(e.target.value)}
                        >
                            <option value="">Rango de precio</option>
                            <option value="0-50">Hasta $50</option>
                            <option value="51-80">$51 - $80</option>
                            <option value="81-150">$81 - $150</option>
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
