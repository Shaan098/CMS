import { useEffect, useState } from 'react';
import { getReports } from '../services/reportService';
import { useNotification } from '../context/NotificationContext';
import Layout from '../components/Layout';
import { motion } from 'framer-motion';
import {
    FileText,
    Users,
    Percent,
    Activity,
    TrendingUp,
    ShieldCheck,
    Zap,
    BarChart3
} from 'lucide-react';
import { Reveal, StaggerContainer, StaggerItem } from '../components/animations/MotionWrapper';

const Reports = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const { showNotification } = useNotification();

    useEffect(() => {
        getReports().then(res => {
            setData(res.data);
            setLoading(false);
        }).catch(() => {
            showNotification('Failed to load report data', 'error');
            setLoading(false);
        });
    }, []);

    if (loading) return <Layout title="Metrics Intelligence">
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                style={{ width: '40px', height: '40px', border: '3px solid var(--color-primary)', borderTopColor: 'transparent', borderRadius: '50%' }}
            />
        </div>
    </Layout>;

    const stats = [
        { label: 'Content Nodes', value: data?.cmsCount || 0, color: 'var(--color-primary)', icon: <FileText size={20} />, trend: '+12%' },
        { label: 'Active Consciousness', value: data?.userCount || 0, color: 'var(--color-secondary)', icon: <Users size={20} />, trend: '+5%' },
        { label: 'Sync Fidelity', value: '94%', color: 'var(--color-primary)', icon: <Percent size={20} />, trend: 'Stable' },
        { label: 'Ecosystem Uptime', value: '99.9%', color: 'var(--color-secondary)', icon: <Activity size={20} />, trend: 'Optimal' },
    ];

    return (
        <Layout title="Ecosystem Intelligence">
            <StaggerContainer staggerChildren={0.1}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
                    {stats.map((s) => (
                        <StaggerItem key={s.label}>
                            <motion.div
                                className="card"
                                whileHover={{ y: -5, boxShadow: `0 10px 30px -10px ${s.color}20` }}
                                style={{ padding: '2rem', position: 'relative', overflow: 'hidden' }}
                            >
                                <div style={{ position: 'absolute', top: '-10px', right: '-10px', opacity: 0.05, transform: 'rotate(15deg)' }}>
                                    {s.icon}
                                </div>
                                <div style={{ color: 'var(--color-text-secondary)', fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    {s.icon} {s.label}
                                </div>
                                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem' }}>
                                    <div style={{ fontSize: '2.2rem', fontWeight: '900', color: 'var(--color-text-primary)' }}>{s.value}</div>
                                    <div style={{ fontSize: '0.8rem', fontWeight: '700', color: s.color }}>{s.trend}</div>
                                </div>
                            </motion.div>
                        </StaggerItem>
                    ))}
                </div>
            </StaggerContainer>

            <Reveal width="100%">
                <div className="card" style={{ padding: '3rem', marginBottom: '3rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4rem' }}>
                        <div>
                            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>Synchronization Growth</h3>
                            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>Temporal analysis of node expansion.</p>
                        </div>
                        <div style={{ display: 'flex', gap: '1.5rem', background: 'rgba(255,255,255,0.03)', padding: '0.75rem 1.5rem', borderRadius: '12px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <div style={{ width: '10px', height: '10px', background: 'var(--color-primary)', borderRadius: '3px', boxShadow: 'var(--glow-primary)' }}></div>
                                <span style={{ fontSize: '0.7rem', fontWeight: '800', color: 'var(--color-text-primary)' }}>AUTHORIZED</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <div style={{ width: '10px', height: '10px', background: 'var(--color-secondary)', borderRadius: '3px', boxShadow: 'var(--glow-secondary)' }}></div>
                                <span style={{ fontSize: '0.7rem', fontWeight: '800', color: 'var(--color-text-primary)' }}>BUFFERED</span>
                            </div>
                        </div>
                    </div>

                    <div style={{ height: '300px', display: 'flex', alignItems: 'flex-end', gap: '2rem', padding: '0 1rem' }}>
                        {['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG'].map((month, idx) => {
                            const h1 = 30 + (idx * 8) + (Math.random() * 10);
                            const h2 = 10 + (Math.random() * 15);
                            return (
                                <div key={month} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
                                    <div style={{ width: '100%', display: 'flex', flexDirection: 'column-reverse', gap: '6px', height: '240px' }}>
                                        <motion.div
                                            initial={{ height: 0 }}
                                            whileInView={{ height: `${h2}%` }}
                                            transition={{ delay: idx * 0.1 + 0.5, duration: 0.8 }}
                                            style={{ width: '100%', background: 'var(--color-secondary)', borderRadius: '6px 6px 2px 2px', opacity: 0.6 }}
                                        ></motion.div>
                                        <motion.div
                                            initial={{ height: 0 }}
                                            whileInView={{ height: `${h1}%` }}
                                            transition={{ delay: idx * 0.1, duration: 0.8 }}
                                            style={{ width: '100%', background: 'var(--color-primary)', borderRadius: '6px 6px 2px 2px', boxShadow: 'var(--glow-primary)' }}
                                        ></motion.div>
                                    </div>
                                    <span style={{ fontSize: '0.7rem', fontWeight: '800', color: 'var(--color-text-secondary)', letterSpacing: '0.05em' }}>{month}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </Reveal>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }}>
                <Reveal width="100%" delay={0.2}>
                    <div className="card" style={{ padding: '2.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
                            <Zap size={20} style={{ color: 'var(--color-primary)' }} />
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>High Frequency Nodes</h3>
                        </div>
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem 0', borderBottom: i < 4 ? '1px solid var(--color-border)' : 'none' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--color-primary)' }}></div>
                                    <span style={{ fontWeight: '700', color: 'var(--color-text-primary)' }}>Node Signal Alpha-{i}</span>
                                </div>
                                <span style={{ color: 'var(--color-primary)', fontWeight: '800', fontSize: '0.9rem' }}>{Math.floor(Math.random() * 5000 + 1000)} PINGS</span>
                            </div>
                        ))}
                    </div>
                </Reveal>

                <Reveal width="100%" delay={0.3}>
                    <div className="card" style={{ padding: '2.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
                            <ShieldCheck size={20} style={{ color: 'var(--color-secondary)' }} />
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Ecosystem Integrity</h3>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            {[
                                { label: 'API Gateway', status: 'Optimal', icon: <Zap size={14} /> },
                                { label: 'Database Flux', status: 'Synchronized', icon: <Activity size={14} /> },
                                { label: 'Security Mesh', status: 'Encrypted', icon: <ShieldCheck size={14} /> },
                            ].map((s) => (
                                <div key={s.label} style={{ padding: '1rem', borderRadius: '12px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                        <div style={{ color: 'var(--color-secondary)' }}>{s.icon}</div>
                                        <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{s.label}</span>
                                    </div>
                                    <span style={{ color: 'var(--color-primary)', fontWeight: '800', fontSize: '0.8rem', textTransform: 'uppercase' }}>{s.status}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </Reveal>
            </div>
        </Layout>
    );
};

export default Reports;

