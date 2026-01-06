import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface User {
    id?: number;
    nombre: string;
    apellido: string;
    email: string;
    password?: string;
    telefono?: string;
}

interface UserModalProps {
    show: boolean;
    onHide: () => void;
    user?: User;
    onSave: () => void;
}

export const UserModal: React.FC<UserModalProps> = ({ show, onHide, user, onSave }) => {
    const [formData, setFormData] = useState<User>({
        nombre: '',
        apellido: '',
        email: '',
        password: '',
        telefono: ''
    });

    useEffect(() => {
        if (user) {
            setFormData({
                ...user,
                password: '' // Don't show password
            });
        } else {
            setFormData({
                nombre: '',
                apellido: '',
                email: '',
                password: '',
                telefono: ''
            });
        }
    }, [user, show]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (user?.id) {
                // Edit
                await axios.put(`https://worldagencyidentidad.runasp.net/api/usuarios/${user.id}`, formData);
            } else {
                // Create (Register)
                await axios.post('https://worldagencyidentidad.runasp.net/api/auth/register', formData);
            }
            onSave();
            onHide();
        } catch (error) {
            console.error('Error saving user:', error);
            alert('Error saving user');
        }
    };

    if (!show) return null;

    return (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">{user ? 'Edit User' : 'New User'}</h5>
                        <button type="button" className="btn-close" onClick={onHide}></button>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="modal-body">
                            <div className="mb-3">
                                <label className="form-label">First Name</label>
                                <input type="text" className="form-control" name="nombre" value={formData.nombre} onChange={handleChange} required />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Last Name</label>
                                <input type="text" className="form-control" name="apellido" value={formData.apellido} onChange={handleChange} required />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Email</label>
                                <input type="email" className="form-control" name="email" value={formData.email} onChange={handleChange} required disabled={!!user} />
                            </div>
                            {!user && (
                                <div className="mb-3">
                                    <label className="form-label">Password</label>
                                    <input type="password" className="form-control" name="password" value={formData.password} onChange={handleChange} required />
                                </div>
                            )}
                            <div className="mb-3">
                                <label className="form-label">Phone</label>
                                <input type="text" className="form-control" name="telefono" value={formData.telefono || ''} onChange={handleChange} />
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
