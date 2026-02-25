import Sidebar from './Sidebar';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const Layout = ({ children, title }) => {
    const location = useLocation();
    const [animate, setAnimate] = useState(false);

    useEffect(() => {
        setAnimate(false);
        const timer = setTimeout(() => setAnimate(true), 10);
        return () => clearTimeout(timer);
    }, [location.pathname]);

    return (
        <div className="app-layout">
            <Sidebar />
            <main className="main-content">
                <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                    <h2 style={{ fontSize: '1.6rem', fontWeight: '800' }}>
                        {title || 'Dashboard'}
                    </h2>
                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                        <button className="btn" style={{ padding: '0.6rem', borderRadius: '8px' }}>🔔</button>
                        <button className="btn" style={{ padding: '0.6rem', borderRadius: '8px' }}>⚙️</button>
                    </div>
                </header>
                <div style={{
                    transition: 'opacity 0.4s ease-out',
                    opacity: animate ? 1 : 0
                }}>
                    {children}
                </div>
            </main>
        </div>
    );
};

export default Layout;
