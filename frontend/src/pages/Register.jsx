import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { motion } from 'framer-motion';
import { User, Mail, Lock, UserPlus, Sparkles } from 'lucide-react';

const Register = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const { register } = useAuth();
    const navigate = useNavigate();
    const { showNotification } = useNotification();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            console.log('📤 Submitting registration node:', formData);
            const res = await register(formData);
            if (res.success) {
                showNotification('Account initialized successfully', 'success');
                navigate('/dashboard');
            } else {
                showNotification(res.message, 'error');
            }
        } catch (err) {
            showNotification(err.response?.data?.message || 'Synchronization failed', 'error');
        }
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-bg)', padding: '1rem' }}>
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
                className="card"
                style={{ width: '100%', maxWidth: '480px', padding: '3.5rem' }}
            >
                <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    <motion.div
                        initial={{ rotate: 20, scale: 0.8 }}
                        animate={{ rotate: 0, scale: 1 }}
                        transition={{ delay: 0.3, duration: 0.5, type: "spring" }}
                        style={{
                            width: '64px',
                            height: '64px',
                            background: 'var(--color-secondary)',
                            borderRadius: '16px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 1.5rem',
                            color: '#000',
                            boxShadow: 'var(--glow-secondary)'
                        }}
                    >
                        <Sparkles size={32} />
                    </motion.div>
                    <h1 style={{ fontSize: '2.2rem', fontWeight: 800, letterSpacing: '-1px' }}>New Existence</h1>
                    <p style={{ color: 'var(--color-text-secondary)', fontSize: '1rem', marginTop: '0.5rem' }}>Define your node profile below.</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', color: 'var(--color-text-secondary)', fontSize: '0.9rem', fontWeight: 600 }}>
                            <User size={16} /> Public Identity
                        </label>
                        <input
                            type="text"
                            className="input-field"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                            placeholder="John Doe"
                        />
                    </div>

                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', color: 'var(--color-text-secondary)', fontSize: '0.9rem', fontWeight: 600 }}>
                            <Mail size={16} /> Spectral Email
                        </label>
                        <input
                            type="email"
                            className="input-field"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            required
                            placeholder="user@ecosystem.net"
                        />
                    </div>

                    <div style={{ marginBottom: '3rem' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', color: 'var(--color-text-secondary)', fontSize: '0.9rem', fontWeight: 600 }}>
                            <Lock size={16} /> Encryption Key
                        </label>
                        <input
                            type="password"
                            className="input-field"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            required
                            placeholder="••••••••"
                        />
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '1rem', borderRadius: '12px', background: 'var(--color-secondary)', borderColor: 'var(--color-secondary)' }}>
                        <UserPlus size={18} style={{ marginRight: '0.5rem' }} /> Create Node
                    </button>
                </form>

                <div style={{ marginTop: '2.5rem', textAlign: 'center', fontSize: '0.95rem', color: 'var(--color-text-secondary)' }}>
                    Established? <Link to="/" style={{ color: 'var(--color-secondary)', textDecoration: 'none', fontWeight: '700' }}>Synchronize Link</Link>
                </div>
            </motion.div>
        </div>
    );
};

export default Register;

