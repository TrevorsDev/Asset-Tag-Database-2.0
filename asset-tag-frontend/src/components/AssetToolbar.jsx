import SearchBar from './SearchBar';

function AssetToolbar({ 
    onAddAsset, 
    onUploadCSV, 
    searchQuery, 
    setSearchQuery, 
    selectedCount, 
    isSelectionMode,
    setIsSelectionMode,
    onDeleteSelected 
}) {
    return (
        <div className="toolbar">
            <div className="left-actions">
                <button
                    onClick={onAddAsset}
                    className="global-btn primary-btn"
                >
                    + Add Asset
                </button>
                
                <button
                    onClick={onUploadCSV}
                >
                    Upload CSV
                </button>
            </div>

            <div className="right-actions">
                <SearchBar
                    value={searchQuery}
                    onChange={setSearchQuery}
                />
                
                {selectedCount > 0 && (
                    <button onClick={onDeleteSelected}>
                        Delete {selectedCount} Assets
                    </button>
                )}
            </div>
        </div>
    )
}
export default AssetToolbar;

