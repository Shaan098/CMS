import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginAdmin = () => {
  const { loginAdmin } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      setError('');
      await loginAdmin(form.email, form.password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Admin login failed');
    }
  };

  return (
    <div className="auth-wrap">
      <form className="card" onSubmit={onSubmit}>
        <h2 className="auth-title">Admin Login</h2>
        <p className="muted">Sign in with an admin account.</p>
        <input
          placeholder="Admin Email"
          type="email"
          value={form.email}
          onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
        />
        <input
          placeholder="Password"
          type="password"
          value={form.password}
          onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
        />
        {error && <p className="error">{error}</p>}
        <button type="submit">Sign In as Admin</button>
        <p className="muted">
          Not an admin? <Link to="/login/user">Go to User Login</Link>
        </p>
      </form>
    </div>
  );
};

export default LoginAdmin;
