import { useEffect, useState } from 'react';
import api from '../services/api';

const MediaPage = () => {
  const [items, setItems] = useState([]);
  const [file, setFile] = useState(null);

  const load = async () => {
    const { data } = await api.get('/media');
    setItems(data);
  };

  useEffect(() => {
    load();
  }, []);

  const upload = async (e) => {
    e.preventDefault();
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    await api.post('/media', formData);
    setFile(null);
    load();
  };

  return (
    <div className="page">
      <h1 className="page-header">Media</h1>
      <form className="card" onSubmit={upload}>
        <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} />
        <button type="submit">Upload</button>
      </form>
      <div className="card">
        {items.length === 0 && <p className="empty">No media uploaded yet.</p>}
        {items.map((item) => (
          <div key={item._id} className="list-item">
            <div>
              <div className="item-title">{item.originalName}</div>
              <div className="item-meta">{item.mimeType}</div>
            </div>
            <a href={`http://localhost:5000${item.path}`} target="_blank" rel="noreferrer">Open</a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MediaPage;
