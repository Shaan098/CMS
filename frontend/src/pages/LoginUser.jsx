import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginUser = () => {
  const { loginUser } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      setError('');
      await loginUser(form.email, form.password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'User login failed');
    }
  };

  return (
    <div className="auth-wrap">
      <form className="card" onSubmit={onSubmit}>
        <h2 className="auth-title">User Login</h2>
        <p className="muted">Sign in with a non-admin account.</p>
        <input
          placeholder="User Email"
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
        <button type="submit">Sign In as User</button>
        <p className="muted">
          Admin account? <Link to="/login/admin">Go to Admin Login</Link>
        </p>
      </form>
    </div>
  );
};

export default LoginUser;
