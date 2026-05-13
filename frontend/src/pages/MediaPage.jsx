import { useEffect, useState } from 'react';
import api from '../services/api';
import { useToast } from '../context/ToastContext';

const MediaPage = () => {
  const [items, setItems] = useState([]);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const { addToast } = useToast();

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
    try {
      await api.post('/media', formData);
      setFile(null);
      setPreview(null);
      load();
      addToast('Media uploaded', { type: 'success' });
    } catch (err) {
      addToast('Upload failed', { type: 'error' });
    }
  };

  useEffect(() => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  return (
    <div className="page">
      <h1 className="page-header">Media</h1>
      <form className="card" onSubmit={upload}>
        <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} />
        {preview && (
          <div style={{marginTop: 8}}>
            {file?.type?.startsWith('image') ? (
              <img src={preview} alt="preview" style={{maxWidth: 240, borderRadius: 10, border: '1px solid var(--border)'}} />
            ) : (
              <video src={preview} controls style={{maxWidth: 240, borderRadius: 10, border: '1px solid var(--border)'}} />
            )}
          </div>
        )}
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
