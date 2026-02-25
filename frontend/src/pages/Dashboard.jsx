import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import ParticlesBackground from '../components/ParticlesBackground';
import { getAllUsers } from '../services/userService';
import { getAllCMS } from '../services/cmsService';

const Dashboard = () => {
    const { user, isAdmin } = useAuth();
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalCMS: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                if (isAdmin()) {
                    const [usersData, cmsData] = await Promise.all([
                        getAllUsers(),
                        getAllCMS()
                    ]);
                    setStats({
                        totalUsers: usersData.count || 0,
                        totalCMS: cmsData.count || 0
                    });
                } else {
                    const cmsData = await getAllCMS();
                    setStats({
                        totalUsers: 0,
                        totalCMS: cmsData.count || 0
                    });
                }
            } catch (error) {
                console.error('Error fetching stats:', error);
            }
            setLoading(false);
        };

        fetchStats();
    }, [isAdmin]);

    return (
        <>
            <Navbar />
            <ParticlesBackground />

            <div className="container fade-in">
                <div style={{ textAlign: 'center', marginTop: 'var(--spacing-xl)', marginBottom: 'var(--spacing-xl)' }}>
                    <h1 style={{ fontSize: '3rem', marginBottom: 'var(--spacing-sm)' }}>
                        Welcome, <span className="text-gradient">{user?.name}</span>! 👋
                    </h1>
                    <p style={{ fontSize: '1.2rem', color: 'var(--color-text-secondary)' }}>
                        You're logged in as <strong>{user?.role}</strong>
                    </p>
                </div>

                {loading ? (
                    <div className="spinner"></div>
                ) : (
                    <div className="card-grid">
                        <div className="glass-card slide-in-left" style={{ padding: 'var(--spacing-xl)', textAlign: 'center' }}>
                            <div style={{ fontSize: '3rem', marginBottom: 'var(--spacing-sm)' }}>📝</div>
                            <h2 className="text-gradient" style={{ fontSize: '2.5rem', marginBottom: 'var(--spacing-sm)' }}>
                                {stats.totalCMS}
                            </h2>
                            <p style={{ color: 'var(--color-text-secondary)', fontSize: '1.1rem' }}>
                                Total CMS Content
                            </p>
                        </div>

                        {isAdmin() && (
                            <div className="glass-card slide-in-left" style={{ padding: 'var(--spacing-xl)', textAlign: 'center', animationDelay: '0.1s' }}>
                                <div style={{ fontSize: '3rem', marginBottom: 'var(--spacing-sm)' }}>👥</div>
                                <h2 className="text-gradient" style={{ fontSize: '2.5rem', marginBottom: 'var(--spacing-sm)' }}>
                                    {stats.totalUsers}
                                </h2>
                                <p style={{ color: 'var(--color-text-secondary)', fontSize: '1.1rem' }}>
                                    Total Users
                                </p>
                            </div>
                        )}

                        <div className="glass-card slide-in-left" style={{ padding: 'var(--spacing-xl)', textAlign: 'center', animationDelay: '0.2s' }}>
                            <div style={{ fontSize: '3rem', marginBottom: 'var(--spacing-sm)' }}>🎨</div>
                            <h2 style={{ fontSize: '1.5rem', marginBottom: 'var(--spacing-sm)', color: 'var(--color-text-primary)' }}>
                                Premium 3D Design
                            </h2>
                            <p style={{ color: 'var(--color-text-secondary)' }}>
                                Enjoy glassmorphism effects and smooth animations
                            </p>
                        </div>
                    </div>
                )}

                <div className="glass-card mt-xl fade-in" style={{ padding: 'var(--spacing-xl)' }}>
                    <h2 className="text-gradient mb-md" style={{ fontSize: '2rem' }}>
                        Quick Actions
                    </h2>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-md)' }}>
                        <button onClick={() => window.location.href = '/cms'} className="btn btn-primary">
                            📝 View CMS Content
                        </button>

                        {isAdmin() && (
                            <>
                                <button onClick={() => window.location.href = '/cms/new'} className="btn btn-secondary">
                                    ✨ Create New Content
                                </button>
                                <button onClick={() => window.location.href = '/users'} className="btn btn-secondary">
                                    👥 Manage Users
                                </button>
                                <button onClick={() => window.location.href = '/reports'} className="btn btn-secondary">
                                    📊 View Reports
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Dashboard;
