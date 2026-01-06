import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Tour {
    id?: number;
    nombre: string;
    descripcion: string;
    precio: number;
    duracion: number;
    capacidad: number;
    estado: boolean;
    imagen: string;
    ciudadId: number;
    categoriaId: number;
}

interface TourModalProps {
    show: boolean;
    onHide: () => void;
    tour?: Tour;
    onSave: () => void;
}

export const TourModal: React.FC<TourModalProps> = ({ show, onHide, tour, onSave }) => {
    const [formData, setFormData] = useState<Tour>({
        nombre: '',
        descripcion: '',
        precio: 0,
        duracion: 1,
        capacidad: 10,
        estado: true,
        imagen: '',
        ciudadId: 1, // Default or select
        categoriaId: 1 // Default or select
    });

    useEffect(() => {
        if (tour) {
            setFormData(tour);
        } else {
            setFormData({
                nombre: '',
                descripcion: '',
                precio: 0,
                duracion: 1,
                capacidad: 10,
                estado: true,
                imagen: '',
                ciudadId: 1,
                categoriaId: 1
            });
        }
    }, [tour, show]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked :
                type === 'number' ? Number(value) : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (tour?.id) {
                // Edit
                await axios.put(`https://worldagencycatalogo.runasp.net/api/servicios/${tour.id}`, formData);
            } else {
                // Create
                // Note: Backend Create expects 'CrearServicioDto', mapping is similar
                await axios.post('https://worldagencycatalogo.runasp.net/api/servicios', {
                    ...formData,
                    precioBase: formData.precio, // Map to dto expected field if different
                    cupoMaximo: formData.capacidad // Map to dto expected field
                });
            }
            onSave();
            onHide();
        } catch (error) {
            console.error('Error saving tour:', error);
            alert('Error saving tour');
        }
    };

    if (!show) return null;

    return (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-lg">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">{tour ? 'Edit Tour' : 'New Tour'}</h5>
                        <button type="button" className="btn-close" onClick={onHide}></button>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="modal-body">
                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Name</label>
                                    <input type="text" className="form-control" name="nombre" value={formData.nombre} onChange={handleChange} required />
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Price</label>
                                    <input type="number" className="form-control" name="precio" value={formData.precio} onChange={handleChange} required />
                                </div>
                                <div className="col-12 mb-3">
                                    <label className="form-label">Description</label>
                                    <textarea className="form-control" name="descripcion" value={formData.descripcion} onChange={handleChange} rows={3} required />
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Duration (days)</label>
                                    <input type="number" className="form-control" name="duracion" value={formData.duracion} onChange={handleChange} required />
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Capacity</label>
                                    <input type="number" className="form-control" name="capacidad" value={formData.capacidad} onChange={handleChange} required />
                                </div>
                                <div className="col-12 mb-3">
                                    <label className="form-label">Image URL</label>
                                    <input type="text" className="form-control" name="imagen" value={formData.imagen} onChange={handleChange} />
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Status</label>
                                    <select className="form-select" name="estado" value={formData.estado ? 'true' : 'false'} onChange={(e) => setFormData(p => ({ ...p, estado: e.target.value === 'true' }))}>
                                        <option value="true">Active</option>
                                        <option value="false">Inactive</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={onHide}>Close</button>
                            <button type="submit" className="btn btn-primary">Save Changes</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};
