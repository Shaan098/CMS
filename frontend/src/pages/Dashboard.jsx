import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';
import { getAllCMS } from '../services/cmsService';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    FileText,
    CheckCircle,
    Clock,
    TrendingUp,
    ShieldCheck,
    Activity,
    ArrowUpRight
} from 'lucide-react';
import { Reveal, StaggerContainer, StaggerItem } from '../components/animations/MotionWrapper';

const Dashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0 });
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await getAllCMS();
                const items = res.data || [];
                setStats({
                    total: items.length,
                    pending: items.filter(i => i.status === 'pending').length,
                    approved: items.filter(i => i.status === 'approved').length
                });
            } catch (err) { console.error(err); }
            setLoading(false);
        };
        fetchStats();
    }, []);

    const cards = [
        { title: 'Total Content', value: stats.total, color: 'var(--color-primary)', icon: <FileText size={24} />, desc: '+12% from last week' },
        { title: 'Approved', value: stats.approved, color: 'var(--color-success)', icon: <CheckCircle size={24} />, desc: 'Live content active' },
        { title: 'Pending', value: stats.pending, color: 'var(--color-secondary)', icon: <Clock size={24} />, desc: 'Requires attention' },
    ];

    if (loading) return <Layout title="Dashboard">
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                style={{ width: '40px', height: '40px', border: '3px solid var(--color-primary)', borderTopColor: 'transparent', borderRadius: '50%' }}
            />
        </div>
    </Layout>;

    return (
        <Layout title="Dashboard Hub">
            <Reveal>
                <div style={{ marginBottom: '3rem' }}>
                    <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>
                        Welcome back, <span style={{ color: 'var(--color-primary)' }}>{user?.name}</span>
                    </h2>
                    <p style={{ color: 'var(--color-text-secondary)', fontSize: '1.1rem' }}>
                        Here's what's happening with your CMS ecosystem today.
                    </p>
                </div>
            </Reveal>

            <StaggerContainer staggerChildren={0.15}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
                    {cards.map((card, idx) => (
                        <StaggerItem key={card.title}>
                            <motion.div
                                className="card"
                                whileHover={{ y: -10 }}
                                style={{ position: 'relative', overflow: 'hidden' }}
                            >
                                <div style={{
                                    position: 'absolute',
                                    top: 0,
                                    right: 0,
                                    width: '100px',
                                    height: '100px',
                                    background: `radial-gradient(circle at top right, ${card.color}15, transparent)`,
                                    borderRadius: '0 0 0 100%'
                                }} />

                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1.5rem' }}>
                                    <div style={{
                                        padding: '0.8rem',
                                        borderRadius: '12px',
                                        background: `${card.color}15`,
                                        color: card.color
                                    }}>
                                        {card.icon}
                                    </div>
                                    <ArrowUpRight size={18} style={{ color: 'var(--color-text-secondary)', opacity: 0.5 }} />
                                </div>

                                <div style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', fontWeight: '500', marginBottom: '0.5rem' }}>{card.title}</div>
                                <div style={{ fontSize: '2.8rem', fontWeight: '800', marginBottom: '0.5rem', letterSpacing: '-1px' }}>{card.value}</div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: card.color }}>
                                    <TrendingUp size={14} />
                                    <span>{card.desc}</span>
                                </div>
                            </motion.div>
                        </StaggerItem>
                    ))}
                </div>
            </StaggerContainer>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }}>
                <Reveal delay={0.3}>
                    <div className="card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <Activity size={20} style={{ color: 'var(--color-primary)' }} />
                                <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Real-time Operations</h3>
                            </div>
                            <button className="btn" style={{ fontSize: '0.75rem', padding: '0.5rem 1rem' }}>Logs</button>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {[1, 2, 3].map((i) => (
                                <div key={i} style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '1rem',
                                    padding: '1rem',
                                    background: 'rgba(255,255,255,0.02)',
                                    borderRadius: '12px',
                                    border: '1px solid var(--color-border)'
                                }}>
                                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--color-primary)', boxShadow: 'var(--glow-primary)' }} />
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>Deployment Pipeline #{i}52</div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>Synchronizing iridescent assets...</div>
                                    </div>
                                    <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-secondary)' }}>ACTIVE</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </Reveal>

                <Reveal delay={0.4}>
                    <div className="card" style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'center' }}>
                        <div style={{
                            width: '120px',
                            height: '120px',
                            borderRadius: '50%',
                            background: 'radial-gradient(circle, var(--color-primary) 0%, transparent 70%)',
                            margin: '0 auto 2rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            opacity: 0.8
                        }}>
                            <ShieldCheck size={48} color="#000" />
                        </div>
                        <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>Ecosystem Status</h3>
                        <p style={{ color: 'var(--color-text-secondary)', marginBottom: '2rem' }}>All neural links are stable and secure.</p>
                        <div style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            padding: '0.5rem 1.5rem',
                            background: 'rgba(16, 185, 129, 0.1)',
                            color: 'var(--color-success)',
                            borderRadius: '99px',
                            fontSize: '0.9rem',
                            fontWeight: 700,
                            margin: '0 auto'
                        }}>
                            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--color-success)' }} />
                            PROTECTED
                        </div>
                    </div>
                </Reveal>
            </div>
        </Layout>
    );
};

export default Dashboard;

