import React, { useState } from 'react';
import type { Tour } from '../types/Tour';
import { useToast } from '../context/ToastContext';

interface TourCardProps {
    tour: Tour;
    onAddToCart: (tourId: string, adults: number, children: number, date: string) => Promise<void>;
}

const DEFAULT_TOUR_IMAGE = 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=300&fit=crop';

const TourCard: React.FC<TourCardProps> = ({ tour, onAddToCart }) => {
    const [adults, setAdults] = useState(1);
    const [children, setChildren] = useState(0);
    const [date, setDate] = useState('');
    const [loading, setLoading] = useState(false);
    const [imageError, setImageError] = useState(false);
    const { showError, showWarning } = useToast();

    const handleAddToCart = async () => {
        if (!date) {
            showWarning('Por favor selecciona una fecha para tu reserva.');
            return;
        }

        const today = new Date().toISOString().split('T')[0];
        if (date < today) {
            showWarning('No puedes seleccionar una fecha pasada.');
            return;
        }

        setLoading(true);
        try {
            await onAddToCart(tour.IdPaquete, adults, children, date);
        } catch (error: any) {
            showError('Error al agregar al carrito. Por favor intenta de nuevo.');
        } finally {
            setLoading(false);
        }
    };

    const handleImageError = () => {
        setImageError(true);
    };

    const getImageSrc = () => {
        if (imageError) return DEFAULT_TOUR_IMAGE;
        if (!tour.ImagenUrl || tour.ImagenUrl === '' || tour.ImagenUrl === 'asset') {
            return DEFAULT_TOUR_IMAGE;
        }
        return tour.ImagenUrl;
    };

    const today = new Date().toISOString().split('T')[0];

    return (
        <div className="col-lg-4 col-md-6 mb-4">
            <div className="tour-card">
                <div className="tour-image">
                    <img
                        src={getImageSrc()}
                        alt={tour.Nombre}
                        className="img-fluid"
                        style={{ height: '250px', objectFit: 'cover', width: '100%' }}
                        loading="lazy"
                        onError={handleImageError}
                    />
                    <div className="tour-price">${tour.PrecioActual}</div>
                </div>
                <div className="tour-content">
                    <h4>{tour.Nombre}</h4>
                    <p>{tour.Descripcion || `Experience ${tour.Ciudad}, ${tour.Pais}`}</p>
                    <div className="tour-details mb-3">
                        <span>
                            <i className="bi bi-clock"></i> {tour.Duracion} Días
                        </span>
                        <span>
                            <i className="bi bi-geo-alt"></i> {tour.Ciudad}
                        </span>
                    </div>

                    <div className="mb-3">
                        <label className="form-label small mb-1">Fecha de Reserva</label>
                        <input
                            type="date"
                            className="form-control form-control-sm"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            min={today}
                        />
                    </div>

                    <div className="row mb-3">
                        <div className="col-6">
                            <div className="form-group">
                                <label className="form-label small mb-1">Adultos</label>
                                <select
                                    className="form-select form-select-sm"
                                    value={adults}
                                    onChange={(e) => setAdults(Number(e.target.value))}
                                >
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                    <option value="4">4+</option>
                                </select>
                            </div>
                        </div>
                        <div className="col-6">
                            <div className="form-group">
                                <label className="form-label small mb-1">Niños</label>
                                <select
                                    className="form-select form-select-sm"
                                    value={children}
                                    onChange={(e) => setChildren(Number(e.target.value))}
                                >
                                    <option value="0">0</option>
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3+</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <button
                        className="btn btn-primary w-100"
                        onClick={handleAddToCart}
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <span className="spinner-border spinner-border-sm me-2"></span>
                                Procesando...
                            </>
                        ) : (
                            <>
                                <i className="bi bi-cart-plus"></i> Reservar
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TourCard;
