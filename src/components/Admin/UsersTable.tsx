import React, { useState, useMemo } from 'react';
import { useQuery } from '@apollo/client';
import { GET_USERS_LIST } from '../../graphql/queries';
import { UserModal } from './UserModal';
import axios from 'axios';

interface UserProfile {
    nombre: string;
    apellido: string;
    telefono?: string;
}

interface User {
    id: number;
    email: string;
    profile?: UserProfile;
    totalSpent?: number;
    activo?: boolean;
}

const PAGE_SIZE = 15;

export const UsersTable: React.FC = () => {
    const [selectedUser, setSelectedUser] = useState<User | undefined>(undefined);
    const [showModal, setShowModal] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');

    const { data, loading, error, refetch } = useQuery(GET_USERS_LIST, {
        variables: { limit: 100 },
        fetchPolicy: 'network-only'
    });

    const users: User[] = data?.users || [];

    // Filter users based on search term and status
    const filteredUsers = useMemo(() => {
        return users.filter(user => {
            const fullName = `${user.profile?.nombre || ''} ${user.profile?.apellido || ''}`.toLowerCase();
            const matchesSearch =
                fullName.includes(searchTerm.toLowerCase()) ||
                user.id.toString().includes(searchTerm) ||
                user.email.toLowerCase().includes(searchTerm.toLowerCase());

            const isActive = user.activo !== false; // Default to active if not specified
            const matchesStatus = statusFilter === 'all' ||
                (statusFilter === 'active' && isActive) ||
                (statusFilter === 'inactive' && !isActive);

            return matchesSearch && matchesStatus;
        });
    }, [users, searchTerm, statusFilter]);

    const totalPages = Math.ceil(filteredUsers.length / PAGE_SIZE);
    const paginatedUsers = filteredUsers.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

    const handleEdit = (user: User) => {
        setSelectedUser({
            id: user.id,
            email: user.email,
            nombre: user.profile?.nombre || '',
            apellido: user.profile?.apellido || '',
            telefono: user.profile?.telefono
        } as any);
        setShowModal(true);
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                await axios.delete(`https://worldagencyadmin.runasp.net/api/admin/usuarios/${id}`);
                alert('User deleted successfully');
                refetch();
            } catch (err) {
                console.error('Error deleting user:', err);
                alert('Error deleting user');
            }
        }
    };

    const handleCreate = () => {
        setSelectedUser(undefined);
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
    if (error) return <div className="alert alert-danger">Error loading users: {error.message}</div>;

    return (
        <div className="card shadow mb-4">
            <div className="card-header py-3 d-flex justify-content-between align-items-center">
                <h6 className="m-0 font-weight-bold text-primary text-uppercase">Users Management ({filteredUsers.length} of {users.length})</h6>
                <button className="btn btn-primary btn-sm" onClick={handleCreate}>
                    <i className="bi bi-plus-lg me-1"></i> New User
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
                                placeholder="Search by name, ID, or email..."
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
                                <th>Email</th>
                                <th>Status</th>
                                <th>Total Spent</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedUsers.length > 0 ? paginatedUsers.map(user => (
                                <tr key={user.id}>
                                    <td>{user.id}</td>
                                    <td>{user.profile?.nombre} {user.profile?.apellido}</td>
                                    <td>{user.email}</td>
                                    <td>
                                        <span className={`badge ${user.activo !== false ? 'bg-success' : 'bg-secondary'}`}>
                                            {user.activo !== false ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td>${user.totalSpent?.toFixed(2) || '0.00'}</td>
                                    <td>
                                        <button className="btn btn-sm btn-info me-2" onClick={() => handleEdit(user)}>
                                            <i className="bi bi-pencil"></i>
                                        </button>
                                        <button className="btn btn-sm btn-danger" onClick={() => handleDelete(user.id)}>
                                            <i className="bi bi-trash"></i>
                                        </button>
                                    </td>
                                </tr>
                            )) : (
                                <tr><td colSpan={6} className="text-center p-3">No users found</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <nav aria-label="Users pagination">
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
            <UserModal
                show={showModal}
                onHide={() => setShowModal(false)}
                user={selectedUser as any}
                onSave={() => refetch()}
            />
        </div>
    );
};
