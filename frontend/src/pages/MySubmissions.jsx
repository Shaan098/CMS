import { useEffect, useState } from 'react';
import CMSCard from '../components/CMSCard';
import { getMySubmissions, deleteCMS } from '../services/cmsService';
import { useNotification } from '../context/NotificationContext';
import Layout from '../components/Layout';
import { motion } from 'framer-motion';
import { Fingerprint, Monitor, Inbox, Send } from 'lucide-react';
import { Reveal, StaggerContainer, StaggerItem } from '../components/animations/MotionWrapper';

const MySubmissions = () => {
    const [content, setContent] = useState([]);
    const [loading, setLoading] = useState(true);
    const { showNotification } = useNotification();

    useEffect(() => { fetchMy(); }, []);

    const fetchMy = async () => {
        try {
            const res = await getMySubmissions();
            setContent(res.data || []);
        } catch { showNotification('Failed to load your submissions', 'error'); }
        setLoading(false);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this submission?')) return;
        try {
            await deleteCMS(id);
            showNotification('Submission deleted successfully', 'success');
            fetchMy();
        } catch { showNotification('Delete failed', 'error'); }
    };

    if (loading) return <Layout title="Private Node">
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                style={{ width: '40px', height: '40px', border: '3px solid var(--color-primary)', borderTopColor: 'transparent', borderRadius: '50%' }}
            />
        </div>
    </Layout>;

    return (
        <Layout title="Personal Archives">
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
                        <Fingerprint size={28} />
                    </div>
                    <div>
                        <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Node Activity</h2>
                        <p style={{ color: 'var(--color-text-secondary)' }}>
                            Tracking <span style={{ color: 'var(--color-secondary)', fontWeight: 700 }}>{content.length}</span> private synchronization nodes.
                        </p>
                    </div>
                </div>
            </Reveal>

            {content.length > 0 ? (
                <StaggerContainer staggerChildren={0.1}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '2rem' }}>
                        {content.map((item) => (
                            <StaggerItem key={item._id}>
                                <CMSCard item={item} onDelete={handleDelete} isAdmin={false} />
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
                            <Send size={40} />
                        </div>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>Silence in the Node</h2>
                        <p style={{ color: 'var(--color-text-secondary)', maxWidth: '400px', margin: '0 auto' }}>
                            You haven't initialized any content nodes yet. Start a new transmission to see it here.
                        </p>
                    </div>
                </Reveal>
            )}
        </Layout>
    );
};

export default MySubmissions;

