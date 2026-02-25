import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import ParticlesBackground from '../components/ParticlesBackground';
import { getReports } from '../services/reportService';

const Reports = () => {
    const [reportData, setReportData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchReports();
    }, []);

    const fetchReports = async () => {
        try {
            const data = await getReports();
            setReportData(data.data || null);
        } catch (error) {
            console.error('Error fetching reports:', error);
        }
        setLoading(false);
    };

    return (
        <>
            <Navbar />
            <ParticlesBackground />

            <div className="container fade-in">
                <div style={{ marginTop: 'var(--spacing-xl)', marginBottom: 'var(--spacing-lg)' }}>
                    <h1 className="text-gradient" style={{ fontSize: '3rem', marginBottom: 'var(--spacing-sm)' }}>
                        📊 System Reports
                    </h1>
                    <button onClick={fetchReports} className="btn btn-primary" disabled={loading}>
                        {loading ? '🔄 Loading...' : '🔄 Refresh Reports'}
                    </button>
                </div>

                {loading ? (
                    <div className="spinner"></div>
                ) : reportData ? (
                    <>
                        <div className="card-grid mb-lg">
                            <div className="glass-card" style={{ padding: 'var(--spacing-xl)', textAlign: 'center' }}>
                                <div style={{ fontSize: '3rem', marginBottom: 'var(--spacing-sm)' }}>👥</div>
                                <h2 className="text-gradient" style={{ fontSize: '2.5rem', marginBottom: 'var(--spacing-sm)' }}>
                                    {reportData.systemStats.totalUsers}
                                </h2>
                                <p style={{ color: 'var(--color-text-secondary)' }}>Total Users</p>
                            </div>

                            <div className="glass-card" style={{ padding: 'var(--spacing-xl)', textAlign: 'center' }}>
                                <div style={{ fontSize: '3rem', marginBottom: 'var(--spacing-sm)' }}>👨‍💼</div>
                                <h2 className="text-gradient" style={{ fontSize: '2.5rem', marginBottom: 'var(--spacing-sm)' }}>
                                    {reportData.systemStats.totalAdmins}
                                </h2>
                                <p style={{ color: 'var(--color-text-secondary)' }}>Admins</p>
                            </div>

                            <div className="glass-card" style={{ padding: 'var(--spacing-xl)', textAlign: 'center' }}>
                                <div style={{ fontSize: '3rem', marginBottom: 'var(--spacing-sm)' }}>📝</div>
                                <h2 className="text-gradient" style={{ fontSize: '2.5rem', marginBottom: 'var(--spacing-sm)' }}>
                                    {reportData.systemStats.totalCMS}
                                </h2>
                                <p style={{ color: 'var(--color-text-secondary)' }}>CMS Content</p>
                            </div>
                        </div>

                        <div className="glass-card" style={{ padding: 'var(--spacing-xl)' }}>
                            <h2 className="text-gradient mb-md" style={{ fontSize: '2rem' }}>Recent Activity</h2>
                            {reportData.recentActivity && reportData.recentActivity.length > 0 ? (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
                                    {reportData.recentActivity.map((item, index) => (
                                        <div key={index} style={{
                                            padding: 'var(--spacing-md)',
                                            background: 'rgba(255, 255, 255, 0.03)',
                                            borderRadius: 'var(--radius-sm)',
                                            borderLeft: '4px solid var(--color-accent-primary)'
                                        }}>
                                            <h3 style={{ marginBottom: '0.5rem' }}>{item.title}</h3>
                                            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>
                                                By: {item.createdBy?.name} | {new Date(item.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p style={{ color: 'var(--color-text-muted)' }}>No recent activity</p>
                            )}
                        </div>
                    </>
                ) : (
                    <div className="glass-card text-center" style={{ padding: 'var(--spacing-xl)' }}>
                        <p>No report data available</p>
                    </div>
                )}
            </div>
        </>
    );
};

export default Reports;
