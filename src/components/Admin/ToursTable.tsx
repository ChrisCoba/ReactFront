import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TourModal } from './TourModal';

interface Tour {
    id: number;
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

export const ToursTable: React.FC = () => {
    const [tours, setTours] = useState<Tour[]>([]);
    const [selectedTour, setSelectedTour] = useState<Tour | undefined>(undefined);
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(true);

    const fetchTours = async () => {
        try {
            const response = await axios.get('https://worldagencycatalogo.runasp.net/api/servicios');
            // Helper to ensure data structure matches
            const data = response.data.map((t: any) => ({
                ...t,
                precio: t.precioBase || t.precio, // Handle potential property name diffs
                capacidad: t.cupoMaximo || t.capacidad
            }));
            setTours(data);
        } catch (error) {
            console.error('Error fetching tours:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTours();
    }, []);

    const handleEdit = (tour: Tour) => {
        setSelectedTour(tour);
        setShowModal(true);
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('Are you sure you want to delete this tour?')) {
            try {
                await axios.delete(`https://worldagencycatalogo.runasp.net/api/servicios/${id}`);
                fetchTours();
            } catch (error) {
                console.error('Error deleting tour:', error);
                alert('Error deleting tour');
            }
        }
    };

    const handleCreate = () => {
        setSelectedTour(undefined);
        setShowModal(true);
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="card shadow mb-4">
            <div className="card-header py-3 d-flex justify-content-between align-items-center">
                <h6 className="m-0 font-weight-bold text-primary text-uppercase">Tours Management</h6>
                <button className="btn btn-primary btn-sm" onClick={handleCreate}>
                    <i className="bi bi-plus-lg me-1"></i> New Tour
                </button>
            </div>
            <div className="card-body">
                <div className="table-responsive">
                    <table className="table table-bordered">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Image</th>
                                <th>Name</th>
                                <th>Price</th>
                                <th>Duration</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tours.map(tour => (
                                <tr key={tour.id}>
                                    <td>{tour.id}</td>
                                    <td>
                                        <img src={tour.imagen} alt={tour.nombre} style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }} />
                                    </td>
                                    <td>{tour.nombre}</td>
                                    <td>${tour.precio}</td>
                                    <td>{tour.duracion} days</td>
                                    <td>
                                        <span className={`badge ${tour.estado ? 'bg-success' : 'bg-secondary'}`}>
                                            {tour.estado ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td>
                                        <button className="btn btn-sm btn-info me-2" onClick={() => handleEdit(tour)}>
                                            <i className="bi bi-pencil"></i>
                                        </button>
                                        <button className="btn btn-sm btn-danger" onClick={() => handleDelete(tour.id)}>
                                            <i className="bi bi-trash"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <TourModal
                show={showModal}
                onHide={() => setShowModal(false)}
                tour={selectedTour}
                onSave={fetchTours}
            />
        </div>
    );
};
