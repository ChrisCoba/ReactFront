import React from 'react';

interface LoadingSpinnerProps {
    size?: 'sm' | 'md' | 'lg';
    variant?: 'primary' | 'secondary' | 'light' | 'dark';
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 'md', variant = 'primary' }) => {
    const sizeClass = size === 'sm' ? 'spinner-border-sm' : '';

    return (
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
            <div className={`spinner-border text-${variant} ${sizeClass}`} role="status">
                <span className="visually-hidden">Cargando...</span>
            </div>
        </div>
    );
};

export default LoadingSpinner;
