import './BulkDeleteBanner.css';

function BulkDeleteBanner({ selectedCount, onDeleteSelected, onCancel }) {
    return (
        <div className="bulk-delete-banner">
            <p className="bulk-delete-banner__count">
                <strong>{selectedCount}</strong> asset{selectedCount !== 1 ? 's' : ''} selected
            </p>
            <div className="bulk-delete-banner__actions">
                <button
                    className="global-btn danger-btn focus-ring--danger"
                    onClick={onDeleteSelected}
                >
                    Delete Selected
                </button>
                <button
                    className="global-btn secondary-btn focus-ring--action"
                    onClick={onCancel}
                >
                    Cancel
                </button>
            </div>
        </div>
    );
}

export default BulkDeleteBanner;