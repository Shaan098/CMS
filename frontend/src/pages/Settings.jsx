import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import ParticlesBackground from '../components/ParticlesBackground';
import { getSettings, updateSetting, deleteSetting } from '../services/settingsService';

const Settings = () => {
    const [settings, setSettings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({ key: '', value: '', description: '' });

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const data = await getSettings();
            setSettings(data.settings || []);
        } catch (error) {
            console.error('Error fetching settings:', error);
        }
        setLoading(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await updateSetting(formData);
            setFormData({ key: '', value: '', description: '' });
            fetchSettings();
        } catch (error) {
            alert('Error updating setting');
        }
    };

    const handleDelete = async (key) => {
        if (window.confirm('Delete this setting?')) {
            try {
                await deleteSetting(key);
                fetchSettings();
            } catch (error) {
                alert('Error deleting setting');
            }
        }
    };

    return (
        <>
            <Navbar />
            <ParticlesBackground />

            <div className="container fade-in">
                <h1 className="text-gradient mb-lg" style={{ fontSize: '3rem', marginTop: 'var(--spacing-xl)' }}>
                    ⚙️ System Settings
                </h1>

                <div className="glass-card mb-lg" style={{ padding: 'var(--spacing-xl)' }}>
                    <h2 className="text-gradient mb-md">Add/Update Setting</h2>
                    <form onSubmit={handleSubmit}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-md)' }}>
                            <div className="input-group">
                                <label className="input-label">Key</label>
                                <input
                                    type="text"
                                    className="input-field"
                                    placeholder="setting_key"
                                    value={formData.key}
                                    onChange={(e) => setFormData({ ...formData, key: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="input-group">
                                <label className="input-label">Value</label>
                                <input
                                    type="text"
                                    className="input-field"
                                    placeholder="setting_value"
                                    value={formData.value}
                                    onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                                    required
                                />
                            </div>
                        </div>
                        <div className="input-group">
                            <label className="input-label">Description (Optional)</label>
                            <input
                                type="text"
                                className="input-field"
                                placeholder="Description..."
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            />
                        </div>
                        <button type="submit" className="btn btn-primary">💾 Save Setting</button>
                    </form>
                </div>

                {loading ? (
                    <div className="spinner"></div>
                ) : (
                    <div className="glass-card" style={{ padding: 'var(--spacing-lg)' }}>
                        <h2 className="text-gradient mb-md">Current Settings</h2>
                        {settings.length === 0 ? (
                            <p style={{ color: 'var(--color-text-muted)' }}>No settings configured</p>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
                                {settings.map((setting) => (
                                    <div key={setting._id} style={{
                                        padding: 'var(--spacing-md)',
                                        background: 'rgba(255, 255, 255, 0.03)',
                                        borderRadius: 'var(--radius-sm)',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center'
                                    }}>
                                        <div>
                                            <strong style={{ color: 'var(--color-accent-primary)' }}>{setting.key}</strong>
                                            <p style={{ color: 'var(--color-text-secondary)', margin: '0.25rem 0' }}>Value: {setting.value}</p>
                                            {setting.description && (
                                                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>{setting.description}</p>
                                            )}
                                        </div>
                                        <button onClick={() => handleDelete(setting.key)} className="btn" style={{ padding: '0.5rem 1rem', background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)' }}>
                                            🗑️ Delete
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </>
    );
};

export default Settings;
