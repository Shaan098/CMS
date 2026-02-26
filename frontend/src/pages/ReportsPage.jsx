import { useEffect, useState } from 'react';
import api from '../services/api';

const ReportsPage = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const run = async () => {
      try {
        const response = await api.get('/reports/summary');
        setData(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Not authorized for reports');
      }
    };
    run();
  }, []);

  return (
    <div className="page">
      <h1 className="page-header">Reports</h1>
      {error && <p className="error">{error}</p>}
      {data && (
        <div className="card">
          <h3>Summary</h3>
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default ReportsPage;
