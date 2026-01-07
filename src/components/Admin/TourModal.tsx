import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Tour {
    id?: number;
    nombre: string;
    descripcion: string;
    precio: number | string;
    duracion: number | string;
    capacidad: number | string;
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
        precio: '',
        duracion: '',
        capacidad: '',
        estado: true,
        imagen: '',
        ciudadId: 1,
        categoriaId: 1
    });

    useEffect(() => {
        if (tour) {
            setFormData({
                ...tour,
                precio: tour.precio?.toString() || '',
                duracion: tour.duracion?.toString() || '',
                capacidad: tour.capacidad?.toString() || ''
            });
        } else {
            setFormData({
                nombre: '',
                descripcion: '',
                precio: '',
                duracion: '',
                capacidad: '',
                estado: true,
                imagen: '',
                ciudadId: 1,
                categoriaId: 1
            });
        }
    }, [tour, show]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        if (type === 'checkbox') {
            setFormData(prev => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // Convert string values to numbers for submission
            const submitData = {
                ...formData,
                precio: Number(formData.precio) || 0,
                duracion: Number(formData.duracion) || 1,
                capacidad: Number(formData.capacidad) || 10
            };

            if (tour?.id) {
                await axios.put(`https://worldagencyadmin.runasp.net/api/admin/servicios/${tour.id}`, submitData);
            } else {
                await axios.post('https://worldagencyadmin.runasp.net/api/admin/servicios', {
                    ...submitData,
                    precioBase: submitData.precio,
                    cupoMaximo: submitData.capacidad
                });
            }
            onSave();
            onHide();
        } catch (error) {
            console.error('Error al guardar tour:', error);
            alert('Error al guardar tour');
        }
    };

    if (!show) return null;

    return (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-lg">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">{tour ? 'Editar Tour' : 'Nuevo Tour'}</h5>
                        <button type="button" className="btn-close" onClick={onHide}></button>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="modal-body">
                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Nombre</label>
                                    <input type="text" className="form-control" name="nombre" value={formData.nombre} onChange={handleChange} required />
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Precio</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="precio"
                                        value={formData.precio}
                                        onChange={handleChange}
                                        placeholder="Ej: 150.00"
                                        required
                                    />
                                </div>
                                <div className="col-12 mb-3">
                                    <label className="form-label">Descripción</label>
                                    <textarea className="form-control" name="descripcion" value={formData.descripcion} onChange={handleChange} rows={3} required />
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Duración (días)</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="duracion"
                                        value={formData.duracion}
                                        onChange={handleChange}
                                        placeholder="Ej: 5"
                                        required
                                    />
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Capacidad</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="capacidad"
                                        value={formData.capacidad}
                                        onChange={handleChange}
                                        placeholder="Ej: 20"
                                        required
                                    />
                                </div>
                                <div className="col-12 mb-3">
                                    <label className="form-label">URL de Imagen</label>
                                    <input type="text" className="form-control" name="imagen" value={formData.imagen} onChange={handleChange} />
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Estado</label>
                                    <select className="form-select" name="estado" value={formData.estado ? 'true' : 'false'} onChange={(e) => setFormData(p => ({ ...p, estado: e.target.value === 'true' }))}>
                                        <option value="true">Activo</option>
                                        <option value="false">Inactivo</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={onHide}>Cerrar</button>
                            <button type="submit" className="btn btn-primary">Guardar</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};
