import React, { useState } from 'react';
import { ReservasService } from '../services/ReservasService';

interface CompletionModalProps {
    isOpen: boolean;
    onClose: () => void;
    reservations: { name: string; reservaId: number }[];
    onComplete: () => void;
    onCancel: () => void;
}

const CompletionModal: React.FC<CompletionModalProps> = ({
    isOpen,
    onClose,
    reservations,
    onComplete,
    onCancel
}) => {
    const [processing, setProcessing] = useState(false);
    const [action, setAction] = useState<'complete' | 'cancel' | null>(null);

    if (!isOpen) return null;

    const handleComplete = async () => {
        setProcessing(true);
        setAction('complete');
        try {
            for (const res of reservations) {
                await ReservasService.completarReservation(res.reservaId);
            }
            onComplete();
        } catch (error) {
            console.error('Error completing reservations:', error);
        } finally {
            setProcessing(false);
        }
    };

    const handleCancel = async () => {
        setProcessing(true);
        setAction('cancel');
        try {
            for (const res of reservations) {
                await ReservasService.revertirReservation(res.reservaId);
            }
            onCancel();
        } catch (error) {
            console.error('Error reverting reservations:', error);
        } finally {
            setProcessing(false);
        }
    };

    return (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header bg-success text-white">
                        <h5 className="modal-title">
                            <i className="bi bi-check-circle me-2"></i>
                            ¡Pago Exitoso!
                        </h5>
                    </div>
                    <div className="modal-body text-center py-4">
                        <div className="mb-4">
                            <i className="bi bi-credit-card-2-front text-success" style={{ fontSize: '3rem' }}></i>
                        </div>
                        <h5 className="mb-3">El pago ha sido procesado correctamente</h5>
                        <p className="text-muted mb-4">
                            ¿Deseas completar la reserva ahora o dejarla pendiente para más tarde?
                        </p>

                        <div className="bg-light rounded p-3 mb-4">
                            <strong>Reservas confirmadas:</strong>
                            <ul className="list-unstyled mb-0 mt-2">
                                {reservations.map(r => (
                                    <li key={r.reservaId}>
                                        ✓ {r.name} - #{r.reservaId}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                    <div className="modal-footer justify-content-center">
                        <button
                            type="button"
                            className="btn btn-outline-secondary btn-lg"
                            onClick={handleCancel}
                            disabled={processing}
                        >
                            {processing && action === 'cancel' ? (
                                <span className="spinner-border spinner-border-sm me-2"></span>
                            ) : (
                                <i className="bi bi-x-circle me-2"></i>
                            )}
                            Dejar Pendiente
                        </button>
                        <button
                            type="button"
                            className="btn btn-success btn-lg"
                            onClick={handleComplete}
                            disabled={processing}
                        >
                            {processing && action === 'complete' ? (
                                <span className="spinner-border spinner-border-sm me-2"></span>
                            ) : (
                                <i className="bi bi-check-circle me-2"></i>
                            )}
                            Completar Reserva
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CompletionModal;
