import { useNotification } from '../context/NotificationContext';
import './NotificationContainer.css';

const NotificationContainer = () => {
    const { notifications, removeNotification } = useNotification();

    const getIcon = (type) => {
        switch (type) {
            case 'success': return '✅';
            case 'error': return '❌';
            case 'warning': return '⚠️';
            default: return 'ℹ️';
        }
    };

    return (
        <div className="notification-container">
            {notifications.map((notification) => (
                <div
                    key={notification.id}
                    className={`notification notification-${notification.type}`}
                    onClick={() => removeNotification(notification.id)}
                >
                    <span className="notification-icon">{getIcon(notification.type)}</span>
                    <span className="notification-message">{notification.message}</span>
                    <button
                        className="notification-close"
                        onClick={(e) => {
                            e.stopPropagation();
                            removeNotification(notification.id);
                        }}
                    >
                        ×
                    </button>
                </div>
            ))}
        </div>
    );
};

export default NotificationContainer;
