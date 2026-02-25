import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Calendar,
    User as UserIcon,
    Edit3,
    Trash2,
    CheckCircle2,
    MoreHorizontal
} from 'lucide-react';

const CMSCard = ({ item, onDelete, onApprove, isAdmin }) => {
    const statusConfig = {
        'pending': { color: 'var(--color-secondary)', icon: <MoreHorizontal size={14} />, bg: 'rgba(34, 211, 238, 0.1)' },
        'approved': { color: 'var(--color-primary)', icon: <CheckCircle2 size={14} />, bg: 'rgba(204, 255, 0, 0.1)' },
        'rejected': { color: 'var(--color-error)', icon: <Trash2 size={14} />, bg: 'rgba(244, 63, 94, 0.1)' }
    };

    const config = statusConfig[item.status.toLowerCase()] || statusConfig['pending'];

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
        <motion.div
            className="card"
            style={{ display: 'flex', flexDirection: 'column', height: '100%', position: 'relative' }}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.4rem 0.8rem',
                    borderRadius: '99px',
                    background: config.bg,
                    color: config.color,
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    boxShadow: item.status === 'approved' ? '0 0 10px rgba(204, 255, 0, 0.1)' : 'none'
                }}>
                    {config.icon}
                    {item.status}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-text-secondary)', fontSize: '0.8rem' }}>
                    <Calendar size={14} />
                    {new Date(item.createdAt).toLocaleDateString()}
                </div>
            </div>

            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '0.75rem', color: 'var(--color-text-primary)' }}>{item.title}</h3>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', flex: 1, marginBottom: '1.5rem', lineHeight: '1.6' }}>
                {item.description || (item.content?.substring(0, 100) + '...')}
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '2rem', padding: '0.8rem', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid var(--color-border)' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--color-primary)15', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary)' }}>
                    <UserIcon size={16} />
                </div>
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>{item.createdBy?.name || 'Synchronizer'}</span>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
                {isAdmin && item.status.toLowerCase() === 'pending' && onApprove && (
                    <button
                        onClick={(e) => { createRipple(e); onApprove(item._id); }}
                        className="btn btn-primary"
                        style={{ flex: 1, padding: '0.6rem', fontSize: '0.8rem' }}
                    >
                        Approve
                    </button>
                )}
                <Link
                    to={`/cms/edit/${item._id}`}
                    className="btn"
                    style={{ flex: 1, padding: '0.6rem', fontSize: '0.8rem', textDecoration: 'none' }}
                    onMouseDown={createRipple}
                >
                    <Edit3 size={14} style={{ marginRight: '0.4rem' }} /> Edit
                </Link>
                <button
                    onClick={(e) => { createRipple(e); onDelete(item._id); }}
                    className="btn"
                    style={{ flex: 1, padding: '0.6rem', fontSize: '0.8rem', color: 'var(--color-error)' }}
                >
                    <Trash2 size={14} />
                </button>
            </div>
        </motion.div>
    );
};

export default CMSCard;

