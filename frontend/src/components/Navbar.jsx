import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEffect, useState } from 'react';
import { getPendingCMS } from '../services/cmsService';
import {
    LayoutDashboard,
    FileStack,
    PenTool,
    ShieldAlert,
    Users,
    TrendingUp,
    Settings,
    LogOut,
    Sparkles
} from 'lucide-react';

const Navbar = () => {
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
        { path: '/dashboard', label: 'Nodes', icon: <LayoutDashboard size={18} /> },
        { path: '/cms', label: 'Archives', icon: <FileStack size={18} /> },
        { path: '/my-submissions', label: 'Signals', icon: <PenTool size={18} /> },
    ];

    const adminItems = [
        { path: '/cms/pending', label: 'Sentinel', icon: <ShieldAlert size={18} /> },
        { path: '/users', label: 'Society', icon: <Users size={18} /> },
        { path: '/reports', label: 'Metrics', icon: <TrendingUp size={18} /> },
        { path: '/settings', label: 'Control', icon: <Settings size={18} /> },
    ];

    const createRipple = (e) => {
        const button = e.currentTarget;
        const circle = document.createElement('span');
        const diameter = Math.max(button.clientWidth, button.clientHeight);
        const radius = diameter / 2;

        circle.style.width = circle.style.height = `${diameter}px`;
        circle.style.left = `${e.clientX - button.offsetLeft - radius}px`;
        circle.style.top = `${e.clientY - button.offsetTop - radius}px`;
        circle.classList.add('ripple');

        const ripple = button.getElementsByClassName('ripple')[0];
        if (ripple) ripple.remove();
        button.appendChild(circle);
    };

    return (
        <nav className="navbar" style={{ backdropFilter: 'blur(12px)', borderBottom: '1px solid var(--color-border)' }}>
            <div className="navbar-content">
                <Link
                    to="/dashboard"
                    className="navbar-brand"
                    style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: '800', color: 'var(--color-primary)', textDecoration: 'none', fontSize: '1.4rem', letterSpacing: '-1px' }}
                >
                    <div style={{ padding: '0.4rem', background: 'var(--color-primary)15', borderRadius: '8px' }}>
                        <Sparkles size={20} />
                    </div>
                    IRIDIUM
                </Link>

                <div className="navbar-nav" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    {navItems.map(item => (
                        <Link
                            key={item.path}
                            to={item.path}
                            onMouseDown={createRipple}
                            className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                color: location.pathname === item.path ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                                transition: 'all 0.3s ease'
                            }}>
                            {item.icon}
                            <span>{item.label}</span>
                        </Link>
                    ))}

                    <div style={{ width: '1px', height: '20px', background: 'var(--color-border)', margin: '0 0.5rem' }} />

                    {user?.role === 'Admin' && adminItems.map(item => (
                        <Link
                            key={item.path}
                            to={item.path}
                            onMouseDown={createRipple}
                            className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                color: location.pathname === item.path ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                                transition: 'all 0.3s ease'
                            }}>
                            {item.icon}
                            <span>{item.label}</span>
                            {item.path === '/cms/pending' && pendingCount > 0 && (
                                <span style={{
                                    background: 'var(--color-primary)',
                                    color: '#000',
                                    fontSize: '0.65rem',
                                    fontWeight: '800',
                                    padding: '2px 6px',
                                    borderRadius: '6px',
                                    boxShadow: 'var(--glow-primary)'
                                }}>
                                    {pendingCount}
                                </span>
                            )}
                        </Link>
                    ))}

                    <div style={{
                        display: 'flex', alignItems: 'center', gap: '1.25rem',
                        marginLeft: '1.5rem', paddingLeft: '1.5rem',
                        borderLeft: '1px solid var(--color-border)'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <div style={{
                                width: '36px', height: '36px', borderRadius: '10px',
                                background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                color: '#000', fontSize: '0.9rem', fontWeight: '800',
                                boxShadow: 'var(--glow-primary)'
                            }}>
                                {user?.name?.charAt(0)?.toUpperCase()}
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <span style={{ color: 'var(--color-text-primary)', fontSize: '0.85rem', fontWeight: '700', lineHeight: 1 }}>
                                    {user?.name}
                                </span>
                                <span style={{ color: 'var(--color-text-secondary)', fontSize: '0.7rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                    {user?.role}
                                </span>
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            onMouseDown={createRipple}
                            className="btn"
                            style={{
                                display: 'flex', alignItems: 'center', gap: '0.4rem',
                                padding: '0.5rem 1rem', fontSize: '0.8rem', fontWeight: 700,
                                background: 'rgba(244, 63, 94, 0.1)', color: 'var(--color-error)',
                                border: '1px solid rgba(244, 63, 94, 0.2)'
                            }}
                        >
                            <LogOut size={16} /> Disconnect
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;

