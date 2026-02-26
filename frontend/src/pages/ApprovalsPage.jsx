import { useEffect, useState } from 'react';
import api from '../services/api';

const ApprovalsPage = () => {
  const [pending, setPending] = useState([]);

  const load = async () => {
    const { data } = await api.get('/content');
    setPending(data.filter((item) => item.status === 'pending'));
  };

  useEffect(() => {
    load();
  }, []);

  const decide = async (id, approve) => {
    await api.post(`/content/${id}/approve`, { approve });
    load();
  };

  return (
    <div className="page">
      <h1 className="page-header">Pending Approvals</h1>
      <div className="card">
        {pending.length === 0 && <p className="empty">No pending content.</p>}
        {pending.map((item) => (
          <div key={item._id} className="list-item">
            <div>
              <div className="item-title">{item.title}</div>
              <div className="item-meta">{item.type}</div>
            </div>
            <div className="row">
              <button onClick={() => decide(item._id, true)}>Approve</button>
              <button onClick={() => decide(item._id, false)} className="danger">Reject</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ApprovalsPage;
