import { useEffect, useState } from 'react';
import { getAllCMS, deleteCMS, updateCMS } from '../services/cmsService';
import { useNotification } from '../context/NotificationContext';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';
import CMSCard from '../components/CMSCard';
import { motion } from 'framer-motion';
import { Plus, Search, Filter, Inbox } from 'lucide-react';
import { Reveal, StaggerContainer, StaggerItem } from '../components/animations/MotionWrapper';
import { Link } from 'react-router-dom';

const CMSList = () => {
    const [cmsItems, setCmsItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const { showNotification } = useNotification();
    const { user } = useAuth();

    useEffect(() => { fetchCMS(); }, []);

    const fetchCMS = async () => {
        try {
            const res = await getAllCMS();
            setCmsItems(res.data || []);
        } catch { showNotification('Failed to load content', 'error'); }
        setLoading(false);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this content?')) return;
        try {
            await deleteCMS(id);
            showNotification('Content deleted', 'success');
            fetchCMS();
        } catch { showNotification('Delete failed', 'error'); }
    };

    const handleApprove = async (id) => {
        try {
            await updateCMS(id, { status: 'approved' });
            showNotification('Content approved', 'success');
            fetchCMS();
        } catch { showNotification('Approval failed', 'error'); }
    };

    const filteredItems = cmsItems.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) return <Layout title="Content Explorer">
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                style={{ width: '40px', height: '40px', border: '3px solid var(--color-primary)', borderTopColor: 'transparent', borderRadius: '50%' }}
            />
        </div>
    </Layout>;

    return (
        <Layout title="Content Library">
            <Reveal>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', marginBottom: '3rem', gap: '2rem', flexWrap: 'wrap' }}>
                    <div style={{ flex: 1, minWidth: '300px' }}>
                        <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem' }}>Ecosystem Base</h2>
                        <div style={{ position: 'relative' }}>
                            <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-secondary)' }} />
                            <input
                                type="text"
                                placeholder="Search archives..."
                                className="input-field"
                                style={{ paddingLeft: '3rem' }}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button className="btn"><Filter size={18} style={{ marginRight: '0.5rem' }} /> Filter</button>
                        <Link to="/cms/new" className="btn btn-primary">
                            <Plus size={18} style={{ marginRight: '0.5rem' }} /> New Entry
                        </Link>
                    </div>
                </div>
            </Reveal>

            {filteredItems.length > 0 ? (
                <StaggerContainer staggerChildren={0.1}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '2rem' }}>
                        {filteredItems.map((item) => (
                            <StaggerItem key={item._id}>
                                <CMSCard
                                    item={item}
                                    onDelete={handleDelete}
                                    onApprove={handleApprove}
                                    isAdmin={user?.role === 'Admin'}
                                />
                            </StaggerItem>
                        ))}
                    </div>
                </StaggerContainer>
            ) : (
                <Reveal delay={0.2}>
                    <div className="card" style={{ textAlign: 'center', padding: '6rem 2rem', borderStyle: 'dashed', background: 'transparent' }}>
                        <div style={{
                            width: '80px',
                            height: '80px',
                            borderRadius: '50%',
                            background: 'rgba(255,255,255,0.03)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 1.5rem',
                            color: 'var(--color-text-secondary)'
                        }}>
                            <Inbox size={40} />
                        </div>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>Archives Empty</h2>
                        <p style={{ color: 'var(--color-text-secondary)', maxWidth: '400px', margin: '0 auto 2rem' }}>
                            Your digital library is currently silent. Synchronize some content to get started.
                        </p>
                        <Link to="/cms/new" className="btn btn-primary">Create First Entry</Link>
                    </div>
                </Reveal>
            )}
        </Layout>
    );
};

export default CMSList;

