import { useEffect, useState, useRef } from 'react';
import api from '../services/api';
import { useToast } from '../context/ToastContext';

const MediaPage = () => {
  const [items, setItems] = useState([]);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [progress, setProgress] = useState(0);
  const dropRef = useRef(null);
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
      await api.post('/media', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (ev) => {
          if (ev.total) setProgress(Math.round((ev.loaded / ev.total) * 100));
        }
      });
      setFile(null);
      setPreview(null);
      setProgress(0);
      load();
      addToast('Media uploaded', { type: 'success' });
    } catch (err) {
      setProgress(0);
      addToast('Upload failed', { type: 'error' });
    }
  };

  // drag and drop
  useEffect(() => {
    const el = dropRef.current;
    if (!el) return;
    const onDragOver = (e) => { e.preventDefault(); el.classList.add('dragover'); };
    const onDragLeave = () => el.classList.remove('dragover');
    const onDrop = (e) => {
      e.preventDefault();
      el.classList.remove('dragover');
      const f = e.dataTransfer.files?.[0];
      if (f) setFile(f);
    };
    el.addEventListener('dragover', onDragOver);
    el.addEventListener('dragleave', onDragLeave);
    el.addEventListener('drop', onDrop);
    return () => {
      el.removeEventListener('dragover', onDragOver);
      el.removeEventListener('dragleave', onDragLeave);
      el.removeEventListener('drop', onDrop);
    };
  }, []);

  useEffect(() => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  return (
    <div className="page">
      <h1 className="page-header">Media</h1>
      <form className="card" onSubmit={upload} ref={dropRef}>
        <div style={{display: 'grid', gap: 8}}>
          <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} />
          <div className="drop-hint">Or drag files here</div>
          {preview && (
            <div style={{marginTop: 8}}>
              {file?.type?.startsWith('image') ? (
                <img src={preview} alt="preview" style={{maxWidth: 240, borderRadius: 10, border: '1px solid var(--border)'}} />
              ) : (
                <video src={preview} controls style={{maxWidth: 240, borderRadius: 10, border: '1px solid var(--border)'}} />
              )}
            </div>
          )}
          {progress > 0 && (
            <div className="progress" style={{height: 8}}>
              <div className="progress-bar" style={{width: `${progress}%`}} />
            </div>
          )}
          <button type="submit">Upload</button>
        </div>
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
