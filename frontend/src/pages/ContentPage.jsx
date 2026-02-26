import { useEffect, useState } from 'react';
import api from '../services/api';

const initialForm = { title: '', body: '', type: 'post' };

const ContentPage = () => {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(initialForm);

  const load = async () => {
    const { data } = await api.get('/content');
    setItems(data);
  };

  useEffect(() => {
    load();
  }, []);

  const createItem = async (e) => {
    e.preventDefault();
    await api.post('/content', form);
    setForm(initialForm);
    load();
  };

  const submit = async (id) => {
    await api.post(`/content/${id}/submit`);
    load();
  };

  const remove = async (id) => {
    await api.delete(`/content/${id}`);
    load();
  };

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
          <h3>All Content</h3>
          {items.length === 0 && <p className="empty">No content yet.</p>}
          {items.map((item) => (
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
