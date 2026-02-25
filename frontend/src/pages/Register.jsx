import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../services/authService';
import ParticlesBackground from '../components/ParticlesBackground';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'User'
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const result = await register(formData);

            if (result.success) {
                setSuccess(true);
                setTimeout(() => {
                    navigate('/');
                }, 2000);
            } else {
                setError(result.message || 'Registration failed');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        }

        setLoading(false);
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'var(--spacing-md)' }}>
            <ParticlesBackground />

            <div className="glass-card scale-in" style={{ maxWidth: '500px', width: '100%', padding: 'var(--spacing-xl)' }}>
                <h1 className="text-center mb-md" style={{ fontSize: '2.5rem' }}>
                    <span className="text-gradient">Join Us</span>
                </h1>
                <p className="text-center mb-xl" style={{ color: 'var(--color-text-secondary)' }}>
                    Create your CMS account
                </p>

                {error && (
                    <div style={{
                        padding: 'var(--spacing-sm)',
                        background: 'rgba(239, 68, 68, 0.1)',
                        borderRadius: 'var(--radius-sm)',
                        marginBottom: 'var(--spacing-md)',
                        border: '1px solid rgba(239, 68, 68, 0.3)',
                        color: '#fca5a5'
                    }}>
                        ⚠️ {error}
                    </div>
                )}

                {success && (
                    <div style={{
                        padding: 'var(--spacing-sm)',
                        background: 'rgba(34, 197, 94, 0.1)',
                        borderRadius: 'var(--radius-sm)',
                        marginBottom: 'var(--spacing-md)',
                        border: '1px solid rgba(34, 197, 94, 0.3)',
                        color: '#86efac'
                    }}>
                        ✅ Registration successful! Redirecting to login...
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label className="input-label">Full Name</label>
                        <input
                            type="text"
                            name="name"
                            className="input-field"
                            placeholder="John Doe"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="input-group">
                        <label className="input-label">Email Address</label>
                        <input
                            type="email"
                            name="email"
                            className="input-field"
                            placeholder="you@example.com"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="input-group">
                        <label className="input-label">Password</label>
                        <input
                            type="password"
                            name="password"
                            className="input-field"
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            minLength={6}
                        />
                    </div>

                    <div className="input-group">
                        <label className="input-label">Role</label>
                        <select
                            name="role"
                            className="input-field"
                            value={formData.role}
                            onChange={handleChange}
                            style={{ cursor: 'pointer' }}
                        >
                            <option value="User">User</option>
                            <option value="Admin">Admin</option>
                        </select>
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary"
                        style={{ width: '100%', marginTop: 'var(--spacing-md)' }}
                        disabled={loading || success}
                    >
                        {loading ? '🔄 Registering...' : '✨ Create Account'}
                    </button>
                </form>

                <p className="text-center mt-md" style={{ color: 'var(--color-text-muted)' }}>
                    Already have an account?{' '}
                    <Link to="/" style={{ color: 'var(--color-accent-primary)', textDecoration: 'none', fontWeight: '600' }}>
                        Login here
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
