import { Link, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const links = [
  { to: '/', label: 'Dashboard' },
  { to: '/content', label: 'Content' },
  { to: '/approvals', label: 'Approvals' },
  { to: '/media', label: 'Media' },
  { to: '/reports', label: 'Reports' },
  { to: '/settings', label: 'Settings' },
  { to: '/users', label: 'Users' }
];

const Layout = () => {
  const location = useLocation();
  const { user, logout } = useAuth();

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">CMS</div>
        {links.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className={location.pathname === item.to ? 'active' : ''}
          >
            {item.label}
          </Link>
        ))}
      </aside>
      <main className="main">
        <header className="topbar">
          <div className="topbar-user">{user?.name} ({user?.role})</div>
          <button onClick={logout}>Logout</button>
        </header>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
