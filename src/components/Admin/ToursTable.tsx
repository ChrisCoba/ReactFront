import React, { useState, useMemo } from 'react';
import { useQuery } from '@apollo/client';
import { GET_PACKAGES } from '../../graphql/queries';
import { TourModal } from './TourModal';
import axios from 'axios';

interface Tour {
    id: number;
    nombre: string;
    precio: number;
    duracion: number;
    ciudad: string;
    pais?: string;
    tipoActividad?: string;
    estado?: boolean;
}

const PAGE_SIZE = 15;

export const ToursTable: React.FC = () => {
    const [selectedTour, setSelectedTour] = useState<Tour | undefined>(undefined);
    const [showModal, setShowModal] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');

    const { data, loading, error, refetch } = useQuery(GET_PACKAGES, {
        fetchPolicy: 'network-only'
    });

    const tours: Tour[] = data?.packages || [];

    // Filter tours based on search term and status
    const filteredTours = useMemo(() => {
        return tours.filter(tour => {
            const matchesSearch =
                tour.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                tour.id.toString().includes(searchTerm) ||
                tour.ciudad?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                tour.tipoActividad?.toLowerCase().includes(searchTerm.toLowerCase());

            const isActive = tour.estado !== false; // Default to active if not specified
            const matchesStatus = statusFilter === 'all' ||
                (statusFilter === 'active' && isActive) ||
                (statusFilter === 'inactive' && !isActive);

            return matchesSearch && matchesStatus;
        });
    }, [tours, searchTerm, statusFilter]);

    const totalPages = Math.ceil(filteredTours.length / PAGE_SIZE);
    const paginatedTours = filteredTours.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

    const handleEdit = (tour: Tour) => {
        setSelectedTour(tour);
        setShowModal(true);
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('Are you sure you want to delete this tour?')) {
            try {
                await axios.delete(`https://worldagencyadmin.runasp.net/api/admin/servicios/${id}`);
                alert('Tour deleted successfully');
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

    // Reset to page 1 when search/filter changes
    const handleSearchChange = (value: string) => {
        setSearchTerm(value);
        setCurrentPage(1);
    };

    const handleStatusFilterChange = (value: string) => {
        setStatusFilter(value);
        setCurrentPage(1);
    };

    if (loading) return <div className="text-center p-4"><div className="spinner-border" role="status"></div></div>;
    if (error) return <div className="alert alert-danger">Error loading tours: {error.message}</div>;

    return (
        <div className="card shadow mb-4">
            <div className="card-header py-3 d-flex justify-content-between align-items-center">
                <h6 className="m-0 font-weight-bold text-primary text-uppercase">Tours Management ({filteredTours.length} of {tours.length})</h6>
                <button className="btn btn-primary btn-sm" onClick={handleCreate}>
                    <i className="bi bi-plus-lg me-1"></i> New Tour
                </button>
            </div>
            <div className="card-body">
                {/* Search and Filter Bar */}
                <div className="row mb-3">
                    <div className="col-md-8">
                        <div className="input-group">
                            <span className="input-group-text"><i className="bi bi-search"></i></span>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Search by name, ID, city, or type..."
                                value={searchTerm}
                                onChange={(e) => handleSearchChange(e.target.value)}
                            />
                            {searchTerm && (
                                <button className="btn btn-outline-secondary" onClick={() => handleSearchChange('')}>
                                    <i className="bi bi-x"></i>
                                </button>
                            )}
                        </div>
                    </div>
                    <div className="col-md-4">
                        <select
                            className="form-select"
                            value={statusFilter}
                            onChange={(e) => handleStatusFilterChange(e.target.value)}
                        >
                            <option value="all">All Status</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>
                    </div>
                </div>

                <div className="table-responsive">
                    <table className="table table-bordered table-hover">
                        <thead className="table-light">
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>City</th>
                                <th>Price</th>
                                <th>Duration</th>
                                <th>Status</th>
                                <th>Type</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedTours.length > 0 ? paginatedTours.map(tour => (
                                <tr key={tour.id}>
                                    <td>{tour.id}</td>
                                    <td>{tour.nombre}</td>
                                    <td>{tour.ciudad}</td>
                                    <td>${tour.precio}</td>
                                    <td>{tour.duracion} days</td>
                                    <td>
                                        <span className={`badge ${tour.estado !== false ? 'bg-success' : 'bg-secondary'}`}>
                                            {tour.estado !== false ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td>{tour.tipoActividad || 'N/A'}</td>
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
                                <tr><td colSpan={8} className="text-center p-3">No tours found</td></tr>
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
