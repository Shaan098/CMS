import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import ParticlesBackground from '../components/ParticlesBackground';
import { getAllUsers, updateUserRole, deleteUser } from '../services/userService';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const data = await getAllUsers();
            setUsers(data.users || []);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
        setLoading(false);
    };

    const handleRoleChange = async (userId, currentRole) => {
        const newRole = currentRole === 'Admin' ? 'User' : 'Admin';
        if (window.confirm(`Change role to ${newRole}?`)) {
            try {
                await updateUserRole(userId, newRole);
                fetchUsers();
            } catch (error) {
                alert('Error updating role');
            }
        }
    };

    const handleDelete = async (userId) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                await deleteUser(userId);
                fetchUsers();
            } catch (error) {
                alert('Error deleting user');
            }
        }
    };

    return (
        <>
            <Navbar />
            <ParticlesBackground />

            <div className="container fade-in">
                <h1 className="text-gradient mb-lg" style={{ fontSize: '3rem', marginTop: 'var(--spacing-xl)' }}>
                    👥 User Management
                </h1>

                {loading ? (
                    <div className="spinner"></div>
                ) : (
                    <div className="glass-card" style={{ padding: 'var(--spacing-lg)', overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ borderBottom: '2px solid var(--glass-border)' }}>
                                    <th style={{ padding: 'var(--spacing-sm)', textAlign: 'left', color: 'var(--color-accent-primary)' }}>Name</th>
                                    <th style={{ padding: 'var(--spacing-sm)', textAlign: 'left', color: 'var(--color-accent-primary)' }}>Email</th>
                                    <th style={{ padding: 'var(--spacing-sm)', textAlign: 'left', color: 'var(--color-accent-primary)' }}>Role</th>
                                    <th style={{ padding: 'var(--spacing-sm)', textAlign: 'center', color: 'var(--color-accent-primary)' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user) => (
                                    <tr key={user._id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                                        <td style={{ padding: 'var(--spacing-sm)' }}>{user.name}</td>
                                        <td style={{ padding: 'var(--spacing-sm)', color: 'var(--color-text-secondary)' }}>{user.email}</td>
                                        <td style={{ padding: 'var(--spacing-sm)' }}>
                                            <span style={{
                                                padding: '0.25rem 0.75rem',
                                                borderRadius: 'var(--radius-sm)',
                                                background: user.role === 'Admin' ? 'var(--gradient-primary)' : 'rgba(255, 255, 255, 0.1)',
                                                fontSize: '0.85rem'
                                            }}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td style={{ padding: 'var(--spacing-sm)', textAlign: 'center' }}>
                                            <button onClick={() => handleRoleChange(user._id, user.role)} className="btn btn-secondary" style={{ marginRight: '0.5rem', padding: '0.4rem 0.8rem' }}>
                                                🔄 Toggle Role
                                            </button>
                                            <button onClick={() => handleDelete(user._id)} className="btn" style={{ padding: '0.4rem 0.8rem', background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)' }}>
                                                🗑️ Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </>
    );
};

export default UserManagement;
