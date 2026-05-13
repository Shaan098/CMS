import { useEffect, useState, useMemo } from 'react';
import api from '../services/api';
import { useToast } from '../context/ToastContext';

const initialForm = { title: '', body: '', type: 'post' };

const ContentPage = () => {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [search, setSearch] = useState('');
  const { addToast } = useToast();

  const load = async () => {
    try {
      const { data } = await api.get('/content');
      setItems(data);
    } catch (err) {
      addToast('Failed to load content', { type: 'error' });
    }
  };

  useEffect(() => {
    load();
  }, []);

  // Poll for live updates every 8 seconds
  useEffect(() => {
    const id = setInterval(() => {
      load();
    }, 8000);
    return () => clearInterval(id);
  }, []);

  const createItem = async (e) => {
    e.preventDefault();
    try {
      await api.post('/content', form);
      setForm(initialForm);
      load();
      addToast('Draft saved', { type: 'success' });
    } catch (err) {
      addToast('Failed to save draft', { type: 'error' });
    }
  };

  const submit = async (id) => {
    try {
      await api.post(`/content/${id}/submit`);
      load();
      addToast('Content submitted for review', { type: 'success' });
    } catch (err) {
      addToast('Failed to submit', { type: 'error' });
    }
  };

  const remove = async (id) => {
    try {
      await api.delete(`/content/${id}`);
      load();
      addToast('Content deleted', { type: 'success' });
    } catch (err) {
      addToast('Delete failed', { type: 'error' });
    }
  };

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return items;
    return items.filter((i) => {
      return (
        (i.title || '').toLowerCase().includes(q) ||
        (i.body || '').toLowerCase().includes(q) ||
        (i.type || '').toLowerCase().includes(q) ||
        (i.status || '').toLowerCase().includes(q)
      );
    });
  }, [items, search]);

  return (
    <div className="page">
      <h1 className="page-header">Content</h1>
      <div className="split">
        <form className="card" onSubmit={createItem}>
          <h3>Create</h3>
          <input
            placeholder="Title"
            value={form.title}
            onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
          />
          <textarea
            placeholder="Body"
            value={form.body}
            onChange={(e) => setForm((prev) => ({ ...prev, body: e.target.value }))}
          />
          <select
            value={form.type}
            onChange={(e) => setForm((prev) => ({ ...prev, type: e.target.value }))}
          >
            <option value="post">Post</option>
            <option value="page">Page</option>
          </select>
          <button type="submit">Save Draft</button>
        </form>

        <div className="card">
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12}}>
              <h3>All Content</h3>
              <input placeholder="Search content..." value={search} onChange={(e) => setSearch(e.target.value)} style={{maxWidth: 260}} />
            </div>
          {items.length === 0 && <p className="empty">No content yet.</p>}
            {filtered.map((item) => (
            <div key={item._id} className="list-item">
              <div>
                <div className="item-title">
                  {item.title}
                  <span className={`chip chip-${item.status}`}>{item.status}</span>
                </div>
                <div className="item-meta">{item.type}</div>
              </div>
              <div className="row">
                <button onClick={() => submit(item._id)}>Submit</button>
                <button onClick={() => remove(item._id)} className="danger">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ContentPage;
