import { useRef } from 'react';
import SearchBar from './SearchBar';
import CSVUploader from './CSVUploader/CSVUploader'; // Make sure this path is correct
import './AssetToolbar.css';

function AssetToolbar({
    onAddAsset,
    onExportCSV,     // NEW: export handler (even if placeholder)
    searchQuery,
    setSearchQuery,
}) {

    // Ref to control the CSVUploader from the toolbar
    const csvUploaderRef = useRef(null);

    return (
        <>
            {/* Floating Glass Toolbar */}
            <div className="floating-toolbar">

                {/* LEFT SIDE ACTIONS */}
                <div className="toolbar-actions">

                    {/* Upload CSV (Primary) */}
                    <button
                        className="primary-action"
                        onClick={() => csvUploaderRef.current?.openFilePicker()}
                    >
                        Upload CSV
                    </button>

                    {/* Export CSV (Secondary) */}
                    <button
                        className="secondary-action"
                        onClick={onExportCSV}
                    >
                        Export CSV
                    </button>

                    {/* Add Asset (Secondary) */}
                    <button
                        className="third-action"
                        onClick={onAddAsset}
                    >
                        + Add Asset
                    </button>
                </div>

                {/* RIGHT SIDE SEARCH */}
                <div className="toolbar-search">
                    <SearchBar
                        value={searchQuery}
                        onChange={setSearchQuery}
                    />
                </div>
            </div>

            {/* Hidden CSV Uploader Component */}
            <CSVUploader
                ref={csvUploaderRef}
                onDataParsed={(data) => console.log("Parsed CSV:", data)}
            />
        </>
    );
}

export default AssetToolbar;


