import { useEffect, useState } from 'react';
import api from '../services/api';

const SettingsPage = () => {
  const [settings, setSettings] = useState({
    siteName: '',
    homepageTitle: '',
    maintenanceMode: false
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    const load = async () => {
      const { data } = await api.get('/settings');
      setSettings({
        siteName: data.siteName,
        homepageTitle: data.homepageTitle,
        maintenanceMode: data.maintenanceMode
      });
    };
    load();
  }, []);

  const save = async (e) => {
    e.preventDefault();
    await api.put('/settings', settings);
    setMessage('Saved');
  };

  return (
    <div className="page">
      <h1 className="page-header">Settings</h1>
      <form className="card" onSubmit={save}>
        <input
          value={settings.siteName}
          onChange={(e) => setSettings((prev) => ({ ...prev, siteName: e.target.value }))}
          placeholder="Site Name"
        />
        <input
          value={settings.homepageTitle}
          onChange={(e) => setSettings((prev) => ({ ...prev, homepageTitle: e.target.value }))}
          placeholder="Homepage Title"
        />
        <label className="checkbox-row">
          <input
            type="checkbox"
            checked={settings.maintenanceMode}
            onChange={(e) =>
              setSettings((prev) => ({ ...prev, maintenanceMode: e.target.checked }))
            }
          />
          Maintenance Mode
        </label>
        <button type="submit">Save</button>
        {message && <p className="success">{message}</p>}
      </form>
    </div>
  );
};

export default SettingsPage;
