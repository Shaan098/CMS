import { useEffect, useState } from 'react';
import { getSettings, updateSetting, deleteSetting } from '../services/settingsService';
import { useNotification } from '../context/NotificationContext';
import Layout from '../components/Layout';
import { motion } from 'framer-motion';
import { Settings as SettingsIcon, Plus, X, Save, Shield, Cpu, Database } from 'lucide-react';
import { Reveal, StaggerContainer, StaggerItem } from '../components/animations/MotionWrapper';

const Settings = () => {
    const [settings, setSettings] = useState([]);
    const [loading, setLoading] = useState(true);
    const { showNotification } = useNotification();
    const [newSetting, setNewSetting] = useState({ key: '', value: '', description: '' });

    useEffect(() => { fetchSettings(); }, []);
    const fetchSettings = async () => {
        try { const res = await getSettings(); setSettings(res.settings || res.data || []); }
        catch { showNotification('Failed to load system settings', 'error'); }
        setLoading(false);
    };

    const handleUpdate = async (settingData) => {
        try {
            await updateSetting(settingData);
            showNotification('Config synchronized with core logic', 'success');
            fetchSettings();
            if (!settingData._id) setNewSetting({ key: '', value: '', description: '' });
        } catch { showNotification('Config update failed', 'error'); }
    };

    const handleDelete = async (key) => {
        if (!window.confirm('Are you sure you want to delete this setting?')) return;
        try {
            await deleteSetting(key);
            showNotification('Setting purged from system archives', 'success');
            fetchSettings();
        } catch { showNotification('Delete failed', 'error'); }
    };

    if (loading) return <Layout title="System Core">
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                style={{ width: '40px', height: '40px', border: '3px solid var(--color-primary)', borderTopColor: 'transparent', borderRadius: '50%' }}
            />
        </div>
    </Layout>;

    return (
        <Layout title="Core Configurations">
            <Reveal>
                <div style={{ marginBottom: '3rem', display: 'flex', alignItems: 'center', gap: '1.5rem', background: 'var(--color-secondary)05', padding: '2rem', borderRadius: '24px', border: '1px solid var(--color-secondary)20' }}>
                    <div style={{
                        width: '56px',
                        height: '56px',
                        borderRadius: '16px',
                        background: 'var(--color-secondary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#000',
                        boxShadow: 'var(--glow-secondary)'
                    }}>
                        <Cpu size={28} />
                    </div>
                    <div>
                        <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>System Parameters</h2>
                        <p style={{ color: 'var(--color-text-secondary)' }}>
                            Modifying <span style={{ color: 'var(--color-secondary)', fontWeight: 700 }}>{settings.length}</span> active hardware-logic hooks.
                        </p>
                    </div>
                </div>
            </Reveal>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '3rem' }}>
                <Reveal delay={0.1}>
                    <div className="card" style={{ padding: '2.5rem', position: 'sticky', top: '2rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2.5rem' }}>
                            <Plus size={20} style={{ color: 'var(--color-primary)' }} />
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Initialize Hook</h3>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <div className="input-container">
                                <label className="input-label" style={{ position: 'static', transform: 'none', color: 'var(--color-text-secondary)', fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.5rem', display: 'block' }}>Key Identifier</label>
                                <input type="text" className="input-field" value={newSetting.key} onChange={(e) => setNewSetting({ ...newSetting, key: e.target.value })} placeholder="e.g. LOG_LEVEL" />
                            </div>
                            <div className="input-container">
                                <label className="input-label" style={{ position: 'static', transform: 'none', color: 'var(--color-text-secondary)', fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.5rem', display: 'block' }}>Value Signal</label>
                                <input type="text" className="input-field" value={newSetting.value} onChange={(e) => setNewSetting({ ...newSetting, value: e.target.value })} placeholder="Target value..." />
                            </div>
                            <div className="input-container">
                                <label className="input-label" style={{ position: 'static', transform: 'none', color: 'var(--color-text-secondary)', fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.5rem', display: 'block' }}>Documentation</label>
                                <input type="text" className="input-field" value={newSetting.description} onChange={(e) => setNewSetting({ ...newSetting, description: e.target.value })} placeholder="Brief purpose..." />
                            </div>
                            <button
                                onClick={() => handleUpdate(newSetting)}
                                className="btn btn-primary"
                                style={{ width: '100%', padding: '1rem', marginTop: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                            >
                                <Save size={18} /> Synchronize Config
                            </button>
                        </div>
                    </div>
                </Reveal>

                <StaggerContainer staggerChildren={0.1}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        {settings.map(s => (
                            <StaggerItem key={s.key}>
                                <div className="card" style={{ padding: '1.75rem', border: '1px solid var(--color-border)', position: 'relative' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--color-primary)', boxShadow: 'var(--glow-primary)' }}></div>
                                            <div style={{ fontWeight: '800', color: 'var(--color-primary)', fontSize: '0.9rem', letterSpacing: '0.05em' }}>{s.key}</div>
                                        </div>
                                        <button
                                            onClick={() => handleDelete(s.key)}
                                            style={{
                                                color: 'var(--color-text-secondary)',
                                                background: 'rgba(255,255,255,0.03)',
                                                border: '1px solid var(--color-border)',
                                                cursor: 'pointer',
                                                width: '24px',
                                                height: '24px',
                                                borderRadius: '6px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                transition: 'all 0.2s'
                                            }}
                                            onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--color-error)'; e.currentTarget.style.borderColor = 'var(--color-error)40'; }}
                                            onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--color-text-secondary)'; e.currentTarget.style.borderColor = 'var(--color-border)'; }}
                                        >
                                            <X size={14} />
                                        </button>
                                    </div>
                                    <div style={{ position: 'relative' }}>
                                        <Database size={14} style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-primary)', opacity: 0.5 }} />
                                        <input
                                            className="input-field"
                                            value={s.value}
                                            onChange={(e) => {
                                                const newSet = settings.map(item => item.key === s.key ? { ...item, value: e.target.value } : item);
                                                setSettings(newSet);
                                            }}
                                            onBlur={() => handleUpdate(s)}
                                            style={{ background: 'rgba(255,255,255,0.02)', paddingRight: '2.5rem' }}
                                        />
                                    </div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', marginTop: '1rem', fontStyle: 'italic' }}>
                                        {s.description || 'System-protected parameter.'}
                                    </div>
                                </div>
                            </StaggerItem>
                        ))}
                    </div>
                </StaggerContainer>
            </div>
        </Layout>
    );
};

export default Settings;

