import { useEffect, useState } from 'react';
import CMSCard from '../components/CMSCard';
import { getPendingCMS, updateCMS, deleteCMS } from '../services/cmsService';
import { useNotification } from '../context/NotificationContext';
import Layout from '../components/Layout';
import { motion } from 'framer-motion';
import { ShieldCheck, Clock, Inbox, AlertOctagon } from 'lucide-react';
import { Reveal, StaggerContainer, StaggerItem } from '../components/animations/MotionWrapper';

const PendingApprovals = () => {
    const [pending, setPending] = useState([]);
    const [loading, setLoading] = useState(true);
    const { showNotification } = useNotification();

    useEffect(() => { fetchPending(); }, []);

    const fetchPending = async () => {
        try {
            const res = await getPendingCMS();
            setPending(res.data || []);
        } catch { showNotification('Failed to load pending content', 'error'); }
        setLoading(false);
    };

    const handleApprove = async (id) => {
        try {
            await updateCMS(id, { status: 'approved' });
            showNotification('Content approved', 'success');
            fetchPending();
        } catch { showNotification('Failed to approve content', 'error'); }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this pending submission?')) return;
        try {
            await deleteCMS(id);
            showNotification('Submission deleted', 'success');
            fetchPending();
        } catch { showNotification('Failed to delete submission', 'error'); }
    };

    if (loading) return <Layout title="Security Gate">
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                style={{ width: '40px', height: '40px', border: '3px solid var(--color-primary)', borderTopColor: 'transparent', borderRadius: '50%' }}
            />
        </div>
    </Layout>;

    return (
        <Layout title="Pending Approvals">
            <Reveal>
                <div style={{ marginBottom: '3rem', display: 'flex', alignItems: 'center', gap: '1.5rem', background: 'var(--color-primary)05', padding: '2rem', borderRadius: '24px', border: '1px solid var(--color-primary)20' }}>
                    <div style={{
                        width: '56px',
                        height: '56px',
                        borderRadius: '16px',
                        background: 'var(--color-primary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#000',
                        boxShadow: 'var(--glow-primary)'
                    }}>
                        <ShieldCheck size={28} />
                    </div>
                    <div>
                        <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Validation Buffer</h2>
                        <p style={{ color: 'var(--color-text-secondary)' }}>
                            <span style={{ color: 'var(--color-primary)', fontWeight: 700 }}>{pending.length}</span> nodes awaiting synchronization authorization.
                        </p>
                    </div>
                </div>
            </Reveal>

            {pending.length > 0 ? (
                <StaggerContainer staggerChildren={0.1}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '2rem' }}>
                        {pending.map((item) => (
                            <StaggerItem key={item._id}>
                                <CMSCard item={item} onApprove={handleApprove} onDelete={handleDelete} isAdmin={true} />
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
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>Buffer Clear</h2>
                        <p style={{ color: 'var(--color-text-secondary)', maxWidth: '400px', margin: '0 auto' }}>
                            All content nodes have been successfully synchronized and authorized.
                        </p>
                    </div>
                </Reveal>
            )}
        </Layout>
    );
};

export default PendingApprovals;

