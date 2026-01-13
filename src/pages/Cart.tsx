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

    const handleCheckout = async () => {
        console.log('🛒 ===== CHECKOUT INICIADO =====');
        console.log('Usuario:', user);
        console.log('Carrito:', cart);

        if (!isAuthenticated || !user) {
            console.log('❌ Usuario no autenticado');
            showWarning('Debes iniciar sesión para proceder al pago.');
            navigate('/login');
            return;
        }

        const account = window.prompt("Ingrese su Número de Cuenta para el débito:", "1234567890");
        if (!account) {
            console.log('❌ Usuario canceló ingreso de cuenta');
            return;
        }
        console.log('💳 Cuenta ingresada:', account);

        setIsProcessing(true);

        try {
            showSuccess('Procesando pagos...');
            console.log('🔄 Procesando', cart.length, 'items del carrito');

            // Process each item in cart
            for (const item of cart) {
                console.log('📦 ===== PROCESANDO ITEM =====');
                console.log('Item:', item);
                console.log('Pre-Reserva ID:', item.reservationId);

                // The pre-reserva was already created in Tours.tsx
                // Now we just need to pay it
                const preReservaId = parseInt(item.reservationId || '0');

                if (!preReservaId) {
                    console.error('❌ No hay ID de pre-reserva para este item');
                    throw new Error(`No se encontró la pre-reserva para "${item.name}"`);
                }

                console.log('💰 Pagando pre-reserva:', preReservaId, 'Monto:', item.price);
                showSuccess(`Procesando pago para ${item.name}...`);

                const payResponse = await ReservasService.payPreReserva(
                    preReservaId,
                    parseInt(account),
                    item.price  // Monto del carrito
                );

                console.log('📥 Respuesta de pago:', payResponse);
                console.log('✅ Pago procesado - Reserva confirmada:', payResponse.reservaId);
                showSuccess(`✓ ${item.name} - Reserva #${payResponse.reservaId} confirmada`);
            }

            console.log('🎉 ===== CHECKOUT COMPLETADO =====');
            showSuccess('¡Todas las reservas procesadas y pagadas con éxito!');
            clearCart();
            navigate('/profile');
        } catch (error: any) {
            console.error('❌ ===== CHECKOUT ERROR =====');
            console.error('Error completo:', error);
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
                        <div className="col-12 text-center">
                            <h2>Tu Carrito está Vacío</h2>
                            <p>¡Explora nuestros tours y agrega algunos a tu carrito!</p>
                            <a href="/tours" className="btn btn-primary">
                                Ver Tours
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
                        <h2>Mi Carrito</h2>
                    </div>
                </div>

                <div className="row mt-4">
                    <div className="col-lg-8">
                        {cart.map((item, index) => (
                            <div key={index} className="card mb-3">
                                <div className="card-body">
                                    <div className="row align-items-center">
                                        <div className="col-md-3">
                                            <img
                                                src={item.image || '/assets/img/travel/tour-1.webp'}
                                                alt={item.name}
                                                className="img-fluid rounded"
                                            />
                                        </div>
                                        <div className="col-md-6">
                                            <h5>{item.name}</h5>
                                            <p className="mb-1">
                                                <strong>Fecha:</strong> {item.date}
                                            </p>
                                            <p className="mb-1">
                                                <strong>Personas:</strong> {item.adults} adulto(s), {item.children} niño(s)
                                            </p>
                                            <p className="mb-1">
                                                <strong>Duración:</strong> {item.duration} días
                                            </p>
                                        </div>
                                        <div className="col-md-2 text-end">
                                            <p className="h5">${(item.price * item.adults + item.price * 0.5 * item.children).toFixed(2)}</p>
                                        </div>
                                        <div className="col-md-1 text-end">
                                            <button
                                                className="btn btn-danger btn-sm"
                                                onClick={() => removeFromCart(index)}
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
                        <div className="card">
                            <div className="card-body">
                                <h4>Resumen del Pedido</h4>
                                <hr />
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
                                    <strong>Total:</strong>
                                    <strong>${totals.total}</strong>
                                </div>
                                <button
                                    className="btn btn-primary w-100 mb-2"
                                    onClick={handleCheckout}
                                    disabled={isProcessing}
                                >
                                    {isProcessing ? 'Procesando...' : 'Proceder al Pago'}
                                </button>
                                <button className="btn btn-outline-secondary w-100" onClick={clearCart}>
                                    Vaciar Carrito
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Cart;
