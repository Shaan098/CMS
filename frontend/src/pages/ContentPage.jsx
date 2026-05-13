import { useEffect, useState, useMemo, useRef } from 'react';
import api from '../services/api';
import { useToast } from '../context/ToastContext';
import useDebounce from '../hooks/useDebounce';
import Modal from '../components/Modal';

const initialForm = { title: '', body: '', type: 'post' };

const ContentPage = () => {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [search, setSearch] = useState('');
  const debounced = useDebounce(search, 260);
  const { addToast } = useToast();
  const [editingId, setEditingId] = useState(null);
  const [editingForm, setEditingForm] = useState({});
  const [selected, setSelected] = useState(new Set());
  const [confirmOpen, setConfirmOpen] = useState(false);
  const pendingDeleteRef = useRef(null);
  const titleInputRef = useRef(null);

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

  const remove = async (id, optimistic = true) => {
    const item = items.find((i) => i._id === id);
    if (!item) return;

    // Optimistic UI: remove immediately
    if (optimistic) setItems((s) => s.filter((x) => x._id !== id));

    pendingDeleteRef.current = item;

    try {
      await api.delete(`/content/${id}`);
      addToast('Content deleted', {
        type: 'success',
        action: {
          label: 'Undo',
          callback: async () => {
            try {
              const { data } = await api.post('/content', { title: item.title, body: item.body, type: item.type });
              setItems((s) => [data, ...s]);
              addToast('Restored', { type: 'success' });
            } catch (e) {
              addToast('Restore failed', { type: 'error' });
            }
          }
        }
      });
    } catch (err) {
      // revert
      setItems((s) => [item, ...s]);
      addToast('Delete failed', { type: 'error' });
    }
  };

  const confirmBulkDelete = () => {
    if (selected.size === 0) return;
    setConfirmOpen(true);
  };

  const bulkDelete = async () => {
    const ids = Array.from(selected);
    setConfirmOpen(false);
    setSelected(new Set());
    // optimistic remove
    setItems((s) => s.filter((i) => !ids.includes(i._id)));
    try {
      await Promise.all(ids.map((id) => api.delete(`/content/${id}`)));
      addToast(`${ids.length} items deleted`, { type: 'success' });
    } catch (err) {
      addToast('Bulk delete error', { type: 'error' });
      load();
    }
  };

  const startEdit = (item) => {
    setEditingId(item._id);
    setEditingForm({ title: item.title, body: item.body, type: item.type });
  };

  const saveEdit = async (id) => {
    try {
      const { data } = await api.put(`/content/${id}`, editingForm);
      setItems((s) => s.map((it) => (it._id === id ? data : it)));
      setEditingId(null);
      addToast('Saved', { type: 'success' });
    } catch (err) {
      addToast('Save failed', { type: 'error' });
    }
  };

  // keyboard shortcuts
  useEffect(() => {
    const onKey = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'n') {
        e.preventDefault();
        titleInputRef.current?.focus();
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        // submit create form via button press
        e.preventDefault();
        document.querySelector('form.card button[type="submit"]')?.click();
      }
      if (e.key === 'Delete') {
        // delete selected
        if (selected.size > 0) confirmBulkDelete();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [selected]);

  const filtered = useMemo(() => {
    const q = (debounced || '').trim().toLowerCase();
    if (!q) return items;
    return items.filter((i) => {
      return (
        (i.title || '').toLowerCase().includes(q) ||
        (i.body || '').toLowerCase().includes(q) ||
        (i.type || '').toLowerCase().includes(q) ||
        (i.status || '').toLowerCase().includes(q)
      );
    });
  }, [items, debounced]);

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
              <div style={{display: 'flex', gap: 8, alignItems: 'center'}}>
                <input placeholder="Search content..." value={search} onChange={(e) => setSearch(e.target.value)} style={{maxWidth: 260}} />
                <button onClick={() => { setSelected(new Set()); }}>Clear Sel</button>
                <button onClick={confirmBulkDelete} className="danger">Delete Selected</button>
              </div>
            </div>
            {items.length === 0 && <p className="empty">No content yet.</p>}
            {filtered.map((item) => (
            <div key={item._id} className="list-item">
                <div style={{display: 'flex', gap: 12, alignItems: 'flex-start'}}>
                  <input type="checkbox" checked={selected.has(item._id)} onChange={(e) => {
                    const next = new Set(selected);
                    if (e.target.checked) next.add(item._id); else next.delete(item._id);
                    setSelected(next);
                  }} />
                  <div style={{flex: 1}}>
                    <div className="item-title">
                      {editingId === item._id ? (
                        <input value={editingForm.title} onChange={(e) => setEditingForm((p) => ({...p, title: e.target.value}))} />
                      ) : (
                        <Highlight text={item.title} query={debounced} />
                      )}
                      <span className={`chip chip-${item.status}`}>{item.status}</span>
                    </div>
                    <div className="item-meta">{item.type}</div>
                  </div>
                </div>
                <div className="row">
                  {editingId === item._id ? (
                    <>
                      <button onClick={() => saveEdit(item._id)}>Save</button>
                      <button onClick={() => setEditingId(null)}>Cancel</button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => submit(item._id)}>Submit</button>
                      <button onClick={() => startEdit(item)}>Edit</button>
                      <button onClick={() => remove(item._id)} className="danger">Delete</button>
                    </>
                  )}
                </div>
            </div>
          ))}
        </div>
      </div>
        <Modal open={confirmOpen} title="Confirm delete" onClose={() => setConfirmOpen(false)}>
          <p>Delete selected items?</p>
          <div style={{display: 'flex', gap: 8, marginTop: 8}}>
            <button onClick={() => setConfirmOpen(false)}>Cancel</button>
            <button className="danger" onClick={bulkDelete}>Delete</button>
          </div>
        </Modal>
    </div>
  );
};

export default ContentPage;

  // small highlight helper
  const Highlight = ({ text = '', query = '' }) => {
    if (!query) return <span>{text}</span>;
    const i = (text || '').toLowerCase().indexOf(query.toLowerCase());
    if (i === -1) return <span>{text}</span>;
    return (
      <span>
        {text.slice(0, i)}<mark>{text.slice(i, i + query.length)}</mark>{text.slice(i + query.length)}
      </span>
    );
  };
