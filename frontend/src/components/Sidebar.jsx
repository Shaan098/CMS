import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEffect, useState } from 'react';
import { getPendingCMS } from '../services/cmsService';
import {
    LayoutDashboard,
    FileStack,
    PlusSquare,
    UserCircle,
    ShieldCheck,
    Users,
    TrendingUp,
    Settings,
    LogOut,
    Sparkles
} from 'lucide-react';

const Sidebar = () => {
    const { user, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const [pendingCount, setPendingCount] = useState(0);

    useEffect(() => {
        if (user?.role === 'Admin') {
            getPendingCMS().then(res => setPendingCount(res.data?.length || 0)).catch(() => { });
        }
    }, [user, location.pathname]);

    const handleLogout = () => { logout(); navigate('/'); };

    const navItems = [
        { path: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
        { path: '/cms', label: 'All Content', icon: <FileStack size={18} /> },
        { path: '/cms/new', label: 'Create New', icon: <PlusSquare size={18} /> },
        { path: '/my-submissions', label: 'My Submissions', icon: <UserCircle size={18} /> },
    ];

    const adminItems = [
        { path: '/cms/pending', label: 'Approvals', icon: <ShieldCheck size={18} />, badge: pendingCount },
        { path: '/users', label: 'User Registry', icon: <Users size={18} /> },
        { path: '/reports', label: 'Analytics', icon: <TrendingUp size={18} /> },
        { path: '/settings', label: 'Settings', icon: <Settings size={18} /> },
    ];

    return (
        <aside className="sidebar">
            <Link to="/dashboard" style={{ textDecoration: 'none', marginBottom: '3rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '36px', height: '36px', background: 'var(--color-primary)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ color: 'white', fontWeight: '800', fontSize: '1.2rem' }}>C</span>
                </div>
                <span style={{ fontWeight: '800', fontSize: '1.4rem', color: 'var(--color-text-primary)' }}>CMS Pro</span>
            </Link>

            <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
                <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--color-text-secondary)', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '1px' }}>Main Menu</span>
                {navItems.map(item => (
                    <Link key={item.path} to={item.path}
                        className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
                        style={{
                            textDecoration: 'none',
                            color: location.pathname === item.path ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                            background: location.pathname === item.path ? 'rgba(204, 255, 0, 0.1)' : 'transparent',
                            display: 'flex', alignItems: 'center', gap: '12px', padding: '0.9rem 1.25rem',
                            borderRadius: '10px', fontWeight: '600', transition: 'all 0.2s'
                        }}>
                        <span style={{ fontSize: '1.1rem' }}>{item.icon}</span>
                        <span>{item.label}</span>
                    </Link>
                ))}

                {user?.role === 'Admin' && (
                    <>
                        <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--color-text-secondary)', textTransform: 'uppercase', marginTop: '2.5rem', marginBottom: '8px', letterSpacing: '1px' }}>Administration</span>
                        {adminItems.map(item => (
                            <Link key={item.path} to={item.path}
                                className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
                                style={{
                                    textDecoration: 'none',
                                    color: location.pathname === item.path ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                                    background: location.pathname === item.path ? 'rgba(204, 255, 0, 0.1)' : 'transparent',
                                    display: 'flex', alignItems: 'center', gap: '12px', padding: '0.9rem 1.25rem',
                                    borderRadius: '10px', fontWeight: '600', transition: 'all 0.2s'
                                }}>
                                <span style={{ fontSize: '1.1rem' }}>{item.icon}</span>
                                <span>{item.label}</span>
                                {item.badge > 0 && (
                                    <span style={{ marginLeft: 'auto', background: 'var(--color-error)', color: 'white', fontSize: '0.7rem', padding: '2px 8px', borderRadius: '20px' }}>{item.badge}</span>
                                )}
                            </Link>
                        ))}
                    </>
                )}
            </nav>

            <div style={{ marginTop: 'auto', borderTop: '1px solid var(--color-border)', paddingTop: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.5rem' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--color-bg)', border: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary)', fontWeight: '700' }}>
                        {user?.name?.charAt(0)}
                    </div>
                    <div>
                        <div style={{ fontSize: '0.95rem', fontWeight: '700' }}>{user?.name}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>{user?.role}</div>
                    </div>
                </div>
                <button onClick={handleLogout} className="btn" style={{ width: '100%', borderColor: 'var(--color-error)', color: 'var(--color-error)' }}>Logout</button>
            </div>
        </aside>
    );
};

export default Sidebar;
