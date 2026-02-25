import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout, isAdmin } = useAuth();
    const location = useLocation();

    const isActive = (path) => location.pathname === path;

    const handleLogout = () => {
        logout();
        window.location.href = '/';
    };

    return (
        <nav className="navbar">
            <div className="navbar-content">
                <Link to="/dashboard" className="navbar-brand">
                    ✨ CMS System
                </Link>

                <ul className="navbar-nav">
                    <li>
                        <Link
                            to="/dashboard"
                            className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}
                        >
                            Dashboard
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/cms"
                            className={`nav-link ${isActive('/cms') ? 'active' : ''}`}
                        >
                            CMS Content
                        </Link>
                    </li>

                    {isAdmin() && (
                        <>
                            <li>
                                <Link
                                    to="/users"
                                    className={`nav-link ${isActive('/users') ? 'active' : ''}`}
                                >
                                    Users
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/reports"
                                    className={`nav-link ${isActive('/reports') ? 'active' : ''}`}
                                >
                                    Reports
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/settings"
                                    className={`nav-link ${isActive('/settings') ? 'active' : ''}`}
                                >
                                    Settings
                                </Link>
                            </li>
                        </>
                    )}

                    <li>
                        <button onClick={handleLogout} className="btn btn-outline" style={{ marginLeft: '1rem' }}>
                            Logout
                        </button>
                    </li>
                </ul>
            </div>

            <div style={{ position: 'absolute', right: '2rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>
                {user?.name} ({user?.role})
            </div>
        </nav>
    );
};

export default Navbar;
