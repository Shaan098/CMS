import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import ParticlesBackground from '../components/ParticlesBackground';
import CMSCard from '../components/CMSCard';
import { getAllCMS, deleteCMS } from '../services/cmsService';
import { useAuth } from '../context/AuthContext';

const CMSList = () => {
    const [cmsContent, setCmsContent] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const { isAdmin } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        fetchCMS();
    }, []);

    const fetchCMS = async () => {
        try {
            const data = await getAllCMS();
            setCmsContent(data.data || []);
        } catch (error) {
            console.error('Error fetching CMS:', error);
        }
        setLoading(false);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this content?')) {
            try {
                await deleteCMS(id);
                fetchCMS();
            } catch (error) {
                alert('Error deleting content');
            }
        }
    };

    const handleEdit = (cms) => {
        navigate(`/cms/edit/${cms._id}`, { state: { cms } });
    };

    const filteredContent = cmsContent.filter(cms =>
        cms.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cms.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <>
            <Navbar />
            <ParticlesBackground />

            <div className="container fade-in">
                <div style={{ marginTop: 'var(--spacing-xl)', marginBottom: 'var(--spacing-lg)' }}>
                    <h1 className="text-gradient" style={{ fontSize: '3rem', marginBottom: 'var(--spacing-sm)' }}>
                        📝 CMS Content
                    </h1>
                    <p style={{ color: 'var(--color-text-secondary)', fontSize: '1.2rem' }}>
                        Manage and explore your content
                    </p>
                </div>

                <div className="glass-card" style={{ marginBottom: 'var(--spacing-lg)', padding: 'var(--spacing-md)' }}>
                    <div style={{ display: 'flex', gap: 'var(--spacing-md)', flexWrap: 'wrap', alignItems: 'center' }}>
                        <div style={{ flex: 1, minWidth: '200px' }}>
                            <input
                                type="text"
                                className="input-field"
                                placeholder="🔍 Search content..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        {isAdmin() && (
                            <button onClick={() => navigate('/cms/new')} className="btn btn-primary">
                                ✨ Create New
                            </button>
                        )}
                    </div>
                </div>

                {loading ? (
                    <div className="spinner"></div>
                ) : filteredContent.length === 0 ? (
                    <div className="glass-card text-center" style={{ padding: 'var(--spacing-xl)' }}>
                        <p style={{ fontSize: '3rem', marginBottom: 'var(--spacing-sm)' }}>📭</p>
                        <h2 style={{ color: 'var(--color-text-secondary)' }}>
                            {searchTerm ? 'No results found' : 'No content yet'}
                        </h2>
                    </div>
                ) : (
                    <div className="card-grid">
                        {filteredContent.map((cms) => (
                            <CMSCard
                                key={cms._id}
                                cms={cms}
                                isAdmin={isAdmin()}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                            />
                        ))}
                    </div>
                )}
            </div>
        </>
    );
};

export default CMSList;
