import SearchBar from './SearchBar';
import './AssetToolbar.css';

function AssetToolbar({
    onAddAsset,
    onExportCSV,
    searchQuery,
    setSearchQuery,
    onUploadCSV,
}) {
    return (
        <div className="floating-toolbar">

            {/* LEFT — Action buttons */}
            <div className="toolbar-actions">
                <button
                    className="toolbar-btn toolbar-btn--primary focus-ring--action"
                    onClick={onUploadCSV}
                >
                    Upload CSV
                </button>

                <button
                    className="toolbar-btn toolbar-btn--ghost focus-ring--action"
                    onClick={onExportCSV}
                >
                    Export CSV
                </button>

                <button
                    className="toolbar-btn toolbar-btn--ghost focus-ring--action"
                    onClick={onAddAsset}
                >
                    + Add Asset
                </button>
            </div>

            {/* RIGHT — Search */}
            <div className="toolbar-search">
                <SearchBar
                    value={searchQuery}
                    onChange={setSearchQuery}
                />
            </div>

        </div>
    );
}

export default AssetToolbar;
