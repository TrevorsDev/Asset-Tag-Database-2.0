import { useEffect } from 'react';
import { X, FileDown } from 'lucide-react';
import '../App.css';
import './AssetModal.css';
import './ExportModal.css';

const EXPORT_COLUMNS = [
    'Asset Tag', 'Serial Number', 'Model', 'Status',
    'Department', 'Purchase Request', 'Purchase Order', 'Notes'
];

const ExportModal = ({ isOpen, assetCount, onConfirm, onClose }) => {
    useEffect(() => {
        if (!isOpen) return;
        const handleEsc = (e) => { if (e.key === 'Escape') onClose(); };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="asset-modal__overlay u-overlay u-flex-center" onClick={onClose}>
            <div
                className="asset-modal__container export-modal__container"
                onClick={(e) => e.stopPropagation()}
                role="dialog"
                aria-modal="true"
                aria-labelledby="export-modal-title"
            >
                <div className="asset-modal__header">
                    <h3 className="asset-modal__title" id="export-modal-title">Export Assets</h3>
                    <button className="modal-close-btn focus-ring--action" onClick={onClose} aria-label="Close">
                        <X />
                    </button>
                </div>

                <div className="export-modal__summary">
                    <div className="export-modal__stat">
                        <span className="export-modal__stat-value">{assetCount}</span>
                        <span className="export-modal__stat-label">
                            asset{assetCount !== 1 ? 's' : ''} will be exported
                        </span>
                    </div>
                    <div className="export-modal__filename">
                        <FileDown size={15} className="export-modal__file-icon" />
                        <span>pima_assets_export.csv</span>
                    </div>
                </div>

                <div className="export-modal__columns">
                    <p className="export-modal__section-label">Columns Included</p>
                    <div className="export-modal__chips">
                        {EXPORT_COLUMNS.map((col) => (
                            <span key={col} className="export-modal__chip">{col}</span>
                        ))}
                    </div>
                </div>

                <div className="asset-modal__actions">
                    <button
                        className="global-btn primary-btn focus-ring--action"
                        onClick={onConfirm}
                    >
                        Download CSV
                    </button>
                    <button
                        className="global-btn secondary-btn focus-ring--action"
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ExportModal;
