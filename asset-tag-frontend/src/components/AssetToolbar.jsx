import SearchBar from './SearchBar';
import './AssetToolbar.css';

function AssetToolbar({ 
    onAddAsset, 
    onUploadCSV, 
    searchQuery, 
    setSearchQuery, 
    selectedCount, 
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
            </div>
        </div>
    )
}
export default AssetToolbar;

