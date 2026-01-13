import React, { useState } from 'react';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../context/ToastContext';
import { useNavigate } from 'react-router-dom';
import { ReservasService } from '../services/ReservasService';

const Cart: React.FC = () => {
    const { cart, removeFromCart, totals, clearCart } = useCart();
    const { isAuthenticated, user } = useAuth();
    const { showWarning, showSuccess, showError } = useToast();
    const navigate = useNavigate();
    const [isProcessing, setIsProcessing] = useState(false);

    // Payment form state
    const [nroCuenta, setNroCuenta] = useState('');
    const [showPaymentForm, setShowPaymentForm] = useState(false);

    const handleOpenPaymentForm = () => {
        if (!isAuthenticated || !user) {
            showWarning('Debes iniciar sesión para proceder al pago.');
            navigate('/login');
            return;
        }
        setShowPaymentForm(true);
    };

    const handleCheckout = async () => {
        // Validation
        if (!nroCuenta.trim()) {
            showError('Por favor ingresa tu ID de cuenta bancaria.');
            return;
        }

        const cuentaOrigen = parseInt(nroCuenta);
        if (isNaN(cuentaOrigen)) {
            showError('ID de cuenta inválido.');
            return;
        }

        setIsProcessing(true);

        try {
            showSuccess('Procesando pagos...');

            for (const item of cart) {
                const preReservaId = parseInt(item.reservationId || '0');

                if (!preReservaId) {
                    throw new Error(`No se encontró la pre-reserva para "${item.name}"`);
                }

                showSuccess(`Procesando pago para ${item.name}...`);

                const payResponse = await ReservasService.payPreReserva(
                    preReservaId,
                    cuentaOrigen,
                    item.price
                );

                showSuccess(`✓ ${item.name} - Reserva #${payResponse.reservaId} confirmada`);
            }

            showSuccess('¡Todas las reservas procesadas y pagadas con éxito!');
            clearCart();
            setShowPaymentForm(false);
            navigate('/profile');
        } catch (error: any) {
            showError(`Error en el proceso: ${error.message}`);
        } finally {
            setIsProcessing(false);
        }
    };

    if (cart.length === 0) {
        return (
            <section className="cart section">
                <div className="container">
                    <div className="row">
                        <div className="col-12 text-center py-5">
                            <i className="bi bi-cart-x" style={{ fontSize: '4rem', color: '#ccc' }}></i>
                            <h2 className="mt-3">Tu Carrito está Vacío</h2>
                            <p className="text-muted">¡Explora nuestros tours y agrega algunos a tu carrito!</p>
                            <a href="/tours" className="btn btn-primary btn-lg mt-3">
                                <i className="bi bi-compass me-2"></i>Ver Tours
                            </a>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="cart section">
            <div className="container">
                <div className="row">
                    <div className="col-12">
                        <h2><i className="bi bi-cart3 me-2"></i>Mi Carrito</h2>
                    </div>
                </div>

                <div className="row mt-4">
                    <div className="col-lg-8">
                        {cart.map((item, index) => (
                            <div key={index} className="card mb-3 shadow-sm">
                                <div className="card-body">
                                    <div className="row align-items-center">
                                        <div className="col-md-3">
                                            <img
                                                src={item.image || '/assets/img/travel/tour-1.webp'}
                                                alt={item.name}
                                                className="img-fluid rounded"
                                                style={{ maxHeight: '120px', objectFit: 'cover', width: '100%' }}
                                            />
                                        </div>
                                        <div className="col-md-6">
                                            <h5 className="mb-2">{item.name}</h5>
                                            <p className="mb-1 text-muted">
                                                <i className="bi bi-calendar3 me-1"></i>
                                                <strong>Fecha:</strong> {item.date}
                                            </p>
                                            <p className="mb-1 text-muted">
                                                <i className="bi bi-people me-1"></i>
                                                <strong>Personas:</strong> {item.adults} adulto(s), {item.children} niño(s)
                                            </p>
                                            <p className="mb-0 text-muted">
                                                <i className="bi bi-clock me-1"></i>
                                                <strong>Duración:</strong> {item.duration} días
                                            </p>
                                        </div>
                                        <div className="col-md-2 text-end">
                                            <p className="h5 text-primary mb-0">${item.price.toFixed(2)}</p>
                                        </div>
                                        <div className="col-md-1 text-end">
                                            <button
                                                className="btn btn-outline-danger btn-sm"
                                                onClick={() => removeFromCart(index)}
                                                title="Eliminar"
                                            >
                                                <i className="bi bi-trash"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="col-lg-4">
                        {/* Order Summary Card */}
                        <div className="card shadow-sm mb-4">
                            <div className="card-header bg-primary text-white">
                                <h5 className="mb-0"><i className="bi bi-receipt me-2"></i>Resumen del Pedido</h5>
                            </div>
                            <div className="card-body">
                                <div className="d-flex justify-content-between mb-2">
                                    <span>Subtotal:</span>
                                    <span>${totals.subtotal}</span>
                                </div>
                                <div className="d-flex justify-content-between mb-2">
                                    <span>Impuestos (12%):</span>
                                    <span>${totals.taxes}</span>
                                </div>
                                <hr />
                                <div className="d-flex justify-content-between mb-3">
                                    <strong className="h5 mb-0">Total:</strong>
                                    <strong className="h5 mb-0 text-primary">${totals.total}</strong>
                                </div>
                            </div>
                        </div>

                        {/* Payment Form Card */}
                        {showPaymentForm ? (
                            <div className="card shadow-sm border-success">
                                <div className="card-header bg-success text-white">
                                    <h5 className="mb-0"><i className="bi bi-credit-card me-2"></i>Datos de Pago</h5>
                                </div>
                                <div className="card-body">
                                    <div className="mb-3">
                                        <label htmlFor="nroCuenta" className="form-label">
                                            <i className="bi bi-bank me-1"></i>ID de Cuenta Bancaria
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="nroCuenta"
                                            placeholder="Ej: 200"
                                            value={nroCuenta}
                                            onChange={(e) => setNroCuenta(e.target.value)}
                                            disabled={isProcessing}
                                        />
                                        <small className="text-muted">
                                            Ingresa el ID de tu cuenta bancaria (no el número de cuenta)
                                        </small>
                                    </div>
                                    <div className="alert alert-info py-2 small">
                                        <i className="bi bi-shield-lock me-1"></i>
                                        Tu pago será procesado de forma segura a través de nuestro banco asociado.
                                    </div>
                                    <button
                                        className="btn btn-success w-100 mb-2"
                                        onClick={handleCheckout}
                                        disabled={isProcessing}
                                    >
                                        {isProcessing ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2"></span>
                                                Procesando...
                                            </>
                                        ) : (
                                            <>
                                                <i className="bi bi-lock me-2"></i>
                                                Confirmar Pago - ${totals.total}
                                            </>
                                        )}
                                    </button>
                                    <button
                                        className="btn btn-outline-secondary w-100"
                                        onClick={() => setShowPaymentForm(false)}
                                        disabled={isProcessing}
                                    >
                                        Cancelar
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="card shadow-sm">
                                <div className="card-body">
                                    <button
                                        className="btn btn-primary w-100 btn-lg mb-2"
                                        onClick={handleOpenPaymentForm}
                                    >
                                        <i className="bi bi-credit-card me-2"></i>
                                        Proceder al Pago
                                    </button>
                                    <button
                                        className="btn btn-outline-danger w-100"
                                        onClick={clearCart}
                                    >
                                        <i className="bi bi-trash me-2"></i>
                                        Vaciar Carrito
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Cart;
