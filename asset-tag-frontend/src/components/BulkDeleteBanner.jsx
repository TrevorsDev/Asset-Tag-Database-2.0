import './BulkDeleteBanner.css';

function BulkDeleteBanner({ selectedCount, onDeleteSelected, onCancel }) {
    return (
        <div className="bulk-delete-banner">
            <span>{selectedCount} selected</span>
            <button onClick={onDeleteSelected}>Delete</button>
            <button onClick={onCancel}>Cancel</button>
        </div>
    );
}

export default BulkDeleteBanner;