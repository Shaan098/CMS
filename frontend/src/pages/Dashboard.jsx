import { useEffect, useState } from 'react';
import api from '../services/api';

const Dashboard = () => {
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    const run = async () => {
      try {
        const { data } = await api.get('/reports/summary');
        setSummary(data);
      } catch {
        setSummary(null);
      }
    };
    run();
  }, []);

  return (
    <div className="page">
      <h1 className="page-header">Dashboard</h1>
      {!summary ? (
        <p className="muted">Summary report is available for approver/admin roles.</p>
      ) : (
        <div className="grid">
          <div className="card stat-card"><h3>Users</h3><p className="stat-value">{summary.users}</p></div>
          <div className="card stat-card"><h3>Content</h3><p className="stat-value">{summary.content}</p></div>
          <div className="card stat-card"><h3>Pending</h3><p className="stat-value">{summary.pending}</p></div>
          <div className="card stat-card"><h3>Approved</h3><p className="stat-value">{summary.approved}</p></div>
          <div className="card stat-card"><h3>Media</h3><p className="stat-value">{summary.media}</p></div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
