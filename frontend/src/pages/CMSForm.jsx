import { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import ParticlesBackground from '../components/ParticlesBackground';
import { createCMS, updateCMS } from '../services/cmsService';

const CMSForm = () => {
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const isEdit = !!id;

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        content: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (isEdit && location.state?.cms) {
            setFormData({
                title: location.state.cms.title,
                description: location.state.cms.description,
                content: location.state.cms.content
            });
        }
    }, [isEdit, location.state]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (isEdit) {
                await updateCMS(id, formData);
            } else {
                await createCMS(formData);
            }
            navigate('/cms');
        } catch (err) {
            setError(err.response?.data?.message || 'Operation failed');
        }

        setLoading(false);
    };

    return (
        <>
            <Navbar />
            <ParticlesBackground />

            <div className="container fade-in">
                <div style={{ maxWidth: '800px', margin: '0 auto', marginTop: 'var(--spacing-xl)' }}>
                    <h1 className="text-gradient mb-lg" style={{ fontSize: '3rem' }}>
                        {isEdit ? '✏️ Edit Content' : '✨ Create Content'}
                    </h1>

                    {error && (
                        <div style={{
                            padding: 'var(--spacing-sm)',
                            background: 'rgba(239, 68, 68, 0.1)',
                            borderRadius: 'var(--radius-sm)',
                            marginBottom: 'var(--spacing-md)',
                            border: '1px solid rgba(239, 68, 68, 0.3)',
                            color: '#fca5a5'
                        }}>
                            ⚠️ {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="glass-card" style={{ padding: 'var(--spacing-xl)' }}>
                        <div className="input-group">
                            <label className="input-label">Title</label>
                            <input
                                type="text"
                                name="title"
                                className="input-field"
                                placeholder="Enter title..."
                                value={formData.title}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="input-group">
                            <label className="input-label">Description</label>
                            <input
                                type="text"
                                name="description"
                                className="input-field"
                                placeholder="Brief description..."
                                value={formData.description}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="input-group">
                            <label className="input-label">Content</label>
                            <textarea
                                name="content"
                                className="input-field"
                                placeholder="Write your content here..."
                                value={formData.content}
                                onChange={handleChange}
                                required
                                rows={12}
                                style={{ resize: 'vertical' }}
                            />
                        </div>

                        <div style={{ display: 'flex', gap: 'var(--spacing-md)' }}>
                            <button
                                type="submit"
                                className="btn btn-primary"
                                style={{ flex: 1 }}
                                disabled={loading}
                            >
                                {loading ? '🔄 Saving...' : isEdit ? '💾 Update' : '✨ Create'}
                            </button>
                            <button
                                type="button"
                                onClick={() => navigate('/cms')}
                                className="btn btn-outline"
                                style={{ flex: 1 }}
                            >
                                ❌ Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default CMSForm;
