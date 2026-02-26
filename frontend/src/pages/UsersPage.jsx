import { useEffect, useState } from 'react';
import api from '../services/api';

const roles = ['viewer', 'editor', 'approver', 'admin'];

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');

  const load = async () => {
    try {
      setError('');
      const { data } = await api.get('/users');
      setUsers(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Not authorized');
    }
  };

  useEffect(() => {
    load();
  }, []);

  const updateRole = async (id, role) => {
    await api.put(`/users/${id}/role`, { role });
    load();
  };

  return (
    <div className="page">
      <h1 className="page-header">Users</h1>
      {error && <p className="error">{error}</p>}
      <div className="card">
        {users.length === 0 && !error && <p className="empty">No users found.</p>}
        {users.map((user) => (
          <div key={user._id} className="list-item">
            <div>
              <div className="item-title">{user.name}</div>
              <div className="item-meta">{user.email}</div>
            </div>
            <select value={user.role} onChange={(e) => updateRole(user._id, e.target.value)}>
              {roles.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UsersPage;
