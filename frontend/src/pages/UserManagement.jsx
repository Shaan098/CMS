import { useEffect, useState } from 'react';
import { getAllUsers, updateUserRole, deleteUser } from '../services/userService';
import { useNotification } from '../context/NotificationContext';
import Layout from '../components/Layout';
import { motion } from 'framer-motion';
import { Users, Trash2, Shield, User as UserIcon, MoreHorizontal } from 'lucide-react';
import { Reveal, StaggerContainer, StaggerItem } from '../components/animations/MotionWrapper';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const { showNotification } = useNotification();

    useEffect(() => { fetchUsers(); }, []);
    const fetchUsers = async () => {
        try {
            const res = await getAllUsers();
            setUsers(res.users || res.data || []);
        } catch { showNotification('Failed to load users', 'error'); }
        setLoading(false);
    };

    const handleRoleChange = async (userId, newRole) => {
        try {
            await updateUserRole(userId, newRole);
            showNotification('User authorization level updated', 'success');
            fetchUsers();
        } catch { showNotification('Failed to update role', 'error'); }
    };

    const handleDelete = async (userId) => {
        if (!window.confirm('Are you sure you want to delete this user?')) return;
        try {
            await deleteUser(userId);
            showNotification('User node terminated from system', 'success');
            fetchUsers();
        } catch (err) {
            showNotification(err.response?.data?.message || 'Termination failed', 'error');
        }
    };

    if (loading) return <Layout title="Society Matrix">
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                style={{ width: '40px', height: '40px', border: '3px solid var(--color-primary)', borderTopColor: 'transparent', borderRadius: '50%' }}
            />
        </div>
    </Layout>;

    return (
        <Layout title="Society Management">
            <Reveal>
                <div style={{ marginBottom: '3rem', display: 'flex', alignItems: 'center', gap: '1.5rem', background: 'var(--color-primary)05', padding: '2rem', borderRadius: '24px', border: '1px solid var(--color-primary)20' }}>
                    <div style={{
                        width: '56px',
                        height: '56px',
                        borderRadius: '16px',
                        background: 'var(--color-primary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#000',
                        boxShadow: 'var(--glow-primary)'
                    }}>
                        <Users size={28} />
                    </div>
                    <div>
                        <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Population Control</h2>
                        <p style={{ color: 'var(--color-text-secondary)' }}>
                            Managing <span style={{ color: 'var(--color-primary)', fontWeight: 700 }}>{users.length}</span> active consciousness nodes in the ecosystem.
                        </p>
                    </div>
                </div>
            </Reveal>

            <StaggerContainer staggerChildren={0.05}>
                <div className="card" style={{ padding: '0', overflowX: 'auto', border: '1px solid var(--color-border)' }}>
                    <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0', minWidth: '800px' }}>
                        <thead>
                            <tr style={{ background: 'rgba(255,255,255,0.02)' }}>
                                <th style={{ padding: '1.25rem 1.5rem', textAlign: 'left', fontSize: '0.75rem', color: 'var(--color-text-secondary)', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Entity</th>
                                <th style={{ padding: '1.25rem 1.5rem', textAlign: 'left', fontSize: '0.75rem', color: 'var(--color-text-secondary)', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Communication Channel</th>
                                <th style={{ padding: '1.25rem 1.5rem', textAlign: 'left', fontSize: '0.75rem', color: 'var(--color-text-secondary)', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Authorization</th>
                                <th style={{ padding: '1.25rem 1.5rem', textAlign: 'right', fontSize: '0.75rem', color: 'var(--color-text-secondary)', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.1em' }}>System Ops</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((u) => (
                                <StaggerItem key={u._id} animateType="scale">
                                    <tr className="table-row-hover" style={{ borderBottom: '1px solid var(--color-border)' }}>
                                        <td style={{ padding: '1.5rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                                <div style={{
                                                    width: '40px',
                                                    height: '40px',
                                                    borderRadius: '12px',
                                                    background: 'var(--color-primary)15',
                                                    color: 'var(--color-primary)',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    fontWeight: 800,
                                                    fontSize: '1rem'
                                                }}>
                                                    {u.name.charAt(0).toUpperCase()}
                                                </div>
                                                <div style={{ fontWeight: 700, color: 'var(--color-text-primary)' }}>{u.name}</div>
                                            </div>
                                        </td>
                                        <td style={{ padding: '1.5rem', color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>{u.email}</td>
                                        <td style={{ padding: '1.5rem' }}>
                                            <div style={{ position: 'relative', width: 'fit-content' }}>
                                                <Shield size={14} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-primary)' }} />
                                                <select
                                                    value={u.role}
                                                    onChange={(e) => handleRoleChange(u._id, e.target.value)}
                                                    className="input-field"
                                                    style={{ padding: '0.5rem 1rem 0.5rem 2.5rem', fontSize: '0.85rem', minWidth: '140px', cursor: 'pointer' }}
                                                >
                                                    <option value="User">User</option>
                                                    <option value="Admin">Admin</option>
                                                </select>
                                            </div>
                                        </td>
                                        <td style={{ padding: '1.5rem', textAlign: 'right' }}>
                                            <button
                                                onClick={() => handleDelete(u._id)}
                                                className="btn"
                                                style={{
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    gap: '0.5rem',
                                                    fontSize: '0.8rem',
                                                    color: 'var(--color-error)',
                                                    background: 'rgba(244, 63, 94, 0.05)',
                                                    border: '1px solid rgba(244, 63, 94, 0.1)'
                                                }}
                                            >
                                                <Trash2 size={14} /> Terminate
                                            </button>
                                        </td>
                                    </tr>
                                </StaggerItem>
                            ))}
                        </tbody>
                    </table>
                </div>
            </StaggerContainer>
        </Layout>
    );
};

export default UserManagement;

