import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import { GET_PACKAGES } from '../../graphql/queries';
import { TourModal } from './TourModal';
import axios from 'axios';

interface Tour {
    id: number;
    nombre: string;
    descripcion: string;
    precio: number;
    duracion: number;
    capacidad?: number;
    cuposDisponibles?: number;
    imagen: string;
    ciudad: string;
    tipoActividad?: string;
}

const PAGE_SIZE = 15;

export const ToursTable: React.FC = () => {
    const [selectedTour, setSelectedTour] = useState<Tour | undefined>(undefined);
    const [showModal, setShowModal] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);

    const { data, loading, error, refetch } = useQuery(GET_PACKAGES, {
        fetchPolicy: 'network-only'
    });

    const tours: Tour[] = data?.packages || [];
    const totalPages = Math.ceil(tours.length / PAGE_SIZE);
    const paginatedTours = tours.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

    const handleEdit = (tour: Tour) => {
        setSelectedTour({
            ...tour,
            capacidad: tour.cuposDisponibles || tour.capacidad || 10
        });
        setShowModal(true);
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('Are you sure you want to delete this tour?')) {
            try {
                await axios.delete(`https://worldagencycatalogo.runasp.net/api/servicios/${id}`);
                refetch();
            } catch (err) {
                console.error('Error deleting tour:', err);
                alert('Error deleting tour');
            }
        }
    };

    const handleCreate = () => {
        setSelectedTour(undefined);
        setShowModal(true);
    };

    if (loading) return <div className="text-center p-4"><div className="spinner-border" role="status"></div></div>;
    if (error) return <div className="alert alert-danger">Error loading tours: {error.message}</div>;

    return (
        <div className="card shadow mb-4">
            <div className="card-header py-3 d-flex justify-content-between align-items-center">
                <h6 className="m-0 font-weight-bold text-primary text-uppercase">Tours Management ({tours.length} total)</h6>
                <button className="btn btn-primary btn-sm" onClick={handleCreate}>
                    <i className="bi bi-plus-lg me-1"></i> New Tour
                </button>
            </div>
            <div className="card-body">
                <div className="table-responsive">
                    <table className="table table-bordered table-hover">
                        <thead className="table-light">
                            <tr>
                                <th>ID</th>
                                <th>Image</th>
                                <th>Name</th>
                                <th>City</th>
                                <th>Price</th>
                                <th>Duration</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedTours.length > 0 ? paginatedTours.map(tour => (
                                <tr key={tour.id}>
                                    <td>{tour.id}</td>
                                    <td>
                                        <img src={tour.imagen} alt={tour.nombre} style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }} />
                                    </td>
                                    <td>{tour.nombre}</td>
                                    <td>{tour.ciudad}</td>
                                    <td>${tour.precio}</td>
                                    <td>{tour.duracion} days</td>
                                    <td>
                                        <button className="btn btn-sm btn-info me-2" onClick={() => handleEdit(tour)}>
                                            <i className="bi bi-pencil"></i>
                                        </button>
                                        <button className="btn btn-sm btn-danger" onClick={() => handleDelete(tour.id)}>
                                            <i className="bi bi-trash"></i>
                                        </button>
                                    </td>
                                </tr>
                            )) : (
                                <tr><td colSpan={7} className="text-center p-3">No tours found</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <nav aria-label="Tours pagination">
                        <ul className="pagination justify-content-center mb-0">
                            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                <button className="page-link" onClick={() => setCurrentPage(p => p - 1)}>Previous</button>
                            </li>
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                <li key={page} className={`page-item ${currentPage === page ? 'active' : ''}`}>
                                    <button className="page-link" onClick={() => setCurrentPage(page)}>{page}</button>
                                </li>
                            ))}
                            <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                                <button className="page-link" onClick={() => setCurrentPage(p => p + 1)}>Next</button>
                            </li>
                        </ul>
                    </nav>
                )}
            </div>
            <TourModal
                show={showModal}
                onHide={() => setShowModal(false)}
                tour={selectedTour as any}
                onSave={() => refetch()}
            />
        </div>
    );
};
