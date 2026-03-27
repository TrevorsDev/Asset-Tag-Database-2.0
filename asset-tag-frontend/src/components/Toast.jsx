import { useEffect } from 'react';
import { X, CheckCircle, AlertCircle } from 'lucide-react';
import './Toast.css';

const Toast = ({ message, type = 'success', onClose }) => {
    useEffect(() => {
        const timer = setTimeout(onClose, 3500);
        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div className={`toast toast--${type}`} role="status" aria-live="polite">
            <span className="toast__icon">
                {type === 'success'
                    ? <CheckCircle size={16} />
                    : <AlertCircle size={16} />
                }
            </span>
            <p className="toast__message">{message}</p>
            <button
                className="toast__close"
                onClick={onClose}
                aria-label="Dismiss"
            >
                <X size={13} />
            </button>
        </div>
    );
};

export default Toast;
