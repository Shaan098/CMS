const CMSCard = ({ cms, onEdit, onDelete, isAdmin }) => {
    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <div className="content-card fade-in">
            <h3 style={{
                background: 'var(--gradient-primary)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                marginBottom: 'var(--spacing-sm)',
                fontSize: '1.5rem'
            }}>
                {cms.title}
            </h3>

            <p style={{
                color: 'var(--color-text-secondary)',
                marginBottom: 'var(--spacing-sm)',
                fontSize: '0.95rem'
            }}>
                {cms.description}
            </p>

            <div style={{
                color: 'var(--color-text-muted)',
                fontSize: '0.85rem',
                marginBottom: 'var(--spacing-md)'
            }}>
                <p>📝 By: {cms.createdBy?.name || 'Unknown'}</p>
                <p>📅 {formatDate(cms.createdAt)}</p>
            </div>

            <div style={{
                padding: 'var(--spacing-sm)',
                background: 'rgba(255, 255, 255, 0.03)',
                borderRadius: 'var(--radius-sm)',
                marginBottom: 'var(--spacing-md)',
                maxHeight: '100px',
                overflow: 'auto',
                fontSize: '0.9rem',
                color: 'var(--color-text-secondary)'
            }}>
                {cms.content.substring(0, 150)}{cms.content.length > 150 ? '...' : ''}
            </div>

            {isAdmin && (
                <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
                    <button
                        onClick={() => onEdit(cms)}
                        className="btn btn-secondary"
                        style={{ flex: 1, padding: '0.5rem' }}
                    >
                        ✏️ Edit
                    </button>
                    <button
                        onClick={() => onDelete(cms._id)}
                        className="btn"
                        style={{
                            flex: 1,
                            padding: '0.5rem',
                            background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
                        }}
                    >
                        🗑️ Delete
                    </button>
                </div>
            )}
        </div>
    );
};

export default CMSCard;
