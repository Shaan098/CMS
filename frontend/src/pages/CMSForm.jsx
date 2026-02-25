import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createCMS, getCMSById, updateCMS } from '../services/cmsService';
import { useNotification } from '../context/NotificationContext';
import Layout from '../components/Layout';
import { motion } from 'framer-motion';
import {
    Save,
    X,
    ChevronLeft,
    Type,
    AlignLeft,
    FileText,
    Sparkles
} from 'lucide-react';
import { Reveal } from '../components/animations/MotionWrapper';

const CMSForm = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [content, setContent] = useState('');
    const { id } = useParams();
    const navigate = useNavigate();
    const { showNotification } = useNotification();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (id) {
            setLoading(true);
            getCMSById(id).then(res => {
                const data = res.data;
                setTitle(data.title);
                setDescription(data.description || '');
                setContent(data.content);
                setLoading(false);
            }).catch(() => {
                showNotification('Failed to load content', 'error');
                navigate('/cms');
            });
        }
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = { title, description, content };
            if (id) {
                await updateCMS(id, payload);
                showNotification('Content updated successfully', 'success');
            } else {
                await createCMS(payload);
                showNotification('Content submitted successfully', 'success');
            }
            navigate('/cms');
        } catch { showNotification('Failed to save content', 'error'); }
    };

    return (
        <Layout title={id ? 'Edit Entry' : 'Create Entry'}>
            <div style={{ maxWidth: '900px', margin: '0 auto' }}>
                <Reveal>
                    <button
                        onClick={() => navigate('/cms')}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            background: 'transparent',
                            border: 'none',
                            color: 'var(--color-text-secondary)',
                            marginBottom: '2rem',
                            fontSize: '0.9rem',
                            fontWeight: 600
                        }}
                        className="nav-link"
                    >
                        <ChevronLeft size={16} /> Back to Library
                    </button>
                </Reveal>

                <Reveal delay={0.1}>
                    <div style={{ marginBottom: '3rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                            <div style={{
                                padding: '0.6rem',
                                borderRadius: '12px',
                                background: 'var(--color-primary)15',
                                color: 'var(--color-primary)'
                            }}>
                                <Sparkles size={24} />
                            </div>
                            <h2 style={{ fontSize: '2.5rem', fontWeight: 800 }}>{id ? 'Refine Archive' : 'New Transmission'}</h2>
                        </div>
                        <p style={{ color: 'var(--color-text-secondary)', fontSize: '1.1rem' }}>
                            {id ? 'Modify your existing synchronization records.' : 'Initialize a new content node in the ecosystem.'}
                        </p>
                    </div>
                </Reveal>

                <Reveal delay={0.2} width="100%">
                    <form onSubmit={handleSubmit} className="card" style={{ padding: '3rem' }}>
                        <div style={{ marginBottom: '2rem' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: 'var(--color-text-secondary)', fontSize: '0.9rem', fontWeight: 600 }}>
                                <Type size={16} /> Entry Title
                            </label>
                            <input
                                type="text"
                                className="input-field"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                                placeholder="Quantum Core Dynamics..."
                            />
                        </div>

                        <div style={{ marginBottom: '2rem' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: 'var(--color-text-secondary)', fontSize: '0.9rem', fontWeight: 600 }}>
                                <AlignLeft size={16} /> Short Description
                            </label>
                            <input
                                type="text"
                                className="input-field"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                required
                                placeholder="A brief summary of this synchronization..."
                            />
                        </div>

                        <div style={{ marginBottom: '3rem' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: 'var(--color-text-secondary)', fontSize: '0.9rem', fontWeight: 600 }}>
                                <FileText size={16} /> Core Content
                            </label>
                            <textarea
                                className="input-field"
                                style={{ minHeight: '350px', resize: 'vertical' }}
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                required
                                placeholder="Enter the primary payload data here..."
                            />
                        </div>

                        <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'flex-end', borderTop: '1px solid var(--color-border)', paddingTop: '2rem' }}>
                            <button type="button" onClick={() => navigate('/cms')} className="btn">
                                <X size={18} style={{ marginRight: '0.5rem' }} /> Cancel
                            </button>
                            <button type="submit" className="btn btn-primary" style={{ padding: '0.8rem 2.5rem' }}>
                                <Save size={18} style={{ marginRight: '0.5rem' }} /> {id ? 'Save Changes' : 'Initialize Node'}
                            </button>
                        </div>
                    </form>
                </Reveal>
            </div>
        </Layout>
    );
};

export default CMSForm;

