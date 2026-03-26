import { useEffect } from 'react';
import { TriangleAlert } from 'lucide-react';
import './ConfirmDialog.css';

/**
 * COMPONENT: ConfirmDialog
 * Purpose: Reusable confirmation modal for destructive actions.
 * Pattern: Controlled — parent owns the open/close state.
 *
 * Props:
 *   isOpen       — whether the dialog is visible
 *   message      — the question to ask the user
 *   onConfirm    — called when the user confirms
 *   onCancel     — called when the user cancels or clicks outside
 *   confirmLabel — text for the confirm button (default: "Delete")
 */
const ConfirmDialog = ({
    isOpen,
    message,
    onConfirm,
    onCancel,
    confirmLabel = 'Delete'
}) => {
    useEffect(() => {
        if (!isOpen) return;
        const handleEsc = (e) => { if (e.key === 'Escape') onCancel(); };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [isOpen, onCancel]);

    if (!isOpen) return null;

    return (
        <div className="confirm-dialog__overlay u-flex-center" onClick={onCancel}>
            <div
                className="confirm-dialog__container u-text-center"
                onClick={(e) => e.stopPropagation()}
                role="alertdialog"
                aria-modal="true"
                aria-labelledby="confirm-dialog-message"
            >
                <div className="confirm-dialog__icon-wrap u-flex-center">
                    <TriangleAlert className="confirm-dialog__icon" />
                </div>

                <p id="confirm-dialog-message" className="confirm-dialog__message">
                    {message}
                </p>

                <p className="confirm-dialog__subtext">This action cannot be undone.</p>

                <div className="confirm-dialog__actions u-flex-center">
                    <button
                        className="global-btn confirm-dialog__btn--cancel focus-ring--action"
                        onClick={onCancel}
                    >
                        Cancel
                    </button>
                    <button
                        className="global-btn confirm-dialog__btn--confirm focus-ring--danger"
                        onClick={onConfirm}
                    >
                        {confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmDialog;
