// App.jsx (the parent component) - This is the main controller of the Asset Tracker app:

// Is responsible for actually sending the data to Supabase
// Uses the useAssets() hook to fetch data from Supabase
// Holds the current list of assets in state
// Passes that list to AssetTable
// Passes the addAsset() function to AssetForm

import React, { useState } from 'react';

import AssetToolbar from './components/AssetToolbar.jsx';
import AssetTable from './components/AssetTable';
import AssetModal from './components/AssetModal.jsx'
import CSVUploader from './components/CSVUploader/CSVUploader.jsx';

import useAssets from './hooks/useAssets.js';
import BulkDeleteBanner from './components/BulkDeleteBanner.jsx';

function App() {
  // --- 1. GLOAL DATA FROM SUPABASE HOOK ---
  const {
    assets,
    loading,
    error,
    setError,
    addAsset,
    bulkUpsertAssets, deleteAsset,
    deleteMultipleAssets,
    updateAsset
  } = useAssets();

  // --- 2. UI STATE (MODAL + SEARCH + EDIT/ADD MORE) ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState(null); //null = Add Mode
  const [searchQuery, setSearchQuery] = useState('');
  const [showCSVUploader, setShowCSVUploader] = useState(false);

  // --- 3. TOOLBAR ACTIONS ---

  // Add Asset -> open modal with empty fields
  const openModalForAdd = () => {
    setSelectedAsset(null); // null = Add Mode
    setIsModalOpen(true);
  };

  const openModalForEdit = (asset) => {
    setSelectedAsset(asset);   // asset = edit mode
    setIsModalOpen(true);
  };


  // Close Modal
  const closeModal = () => {
    setError(null);
    setIsModalOpen(false);
    setSelectedAsset(null);
  };

  // --- 4. SAVE HANDLER (ADD + EDIT) ---
  const handleSave = async (id, data) => {
    if (id) {
      // EDIT MODE
      await updateAsset(id, data);
    } else {
      // ADD MODE
      await addAsset(data);
    }

    closeModal();
  };

  // 5. CSV UPLOAD HANDLER ---
  // This function bridges the CSV data to my Supabase hook
  const handleCSVData = async (data) => {
    await bulkUpsertAssets(data);
    setShowCSVUploader(false);
  };

  // --- 6. FILTER ASSETS BASED ON SEARCH QUERY ---
  const filteredAssets = assets.filter((asset) => {
    const tokens = searchQuery.toLowerCase().split(' ').filter(Boolean);

    return tokens.every((token) =>
      Object.values(asset).some((value) =>
        String(value).toLowerCase().includes(token)
      )
    );
  });

  // --- 7. SELECTION STATE (for bulk delete) ---
  const [selectedIds, setSelectedIds] = useState([]);
  const [isSelectionMode, setIsSelectionMode] = useState(false);

  // --- 8. BULK DELETE HANDLER ---
  const handleBulkDelete = () => {
    if (window.confirm(`Delete ${selectedIds.length} selected assets?`)) {
      deleteMultipleAssets(selectedIds);
      setSelectedIds([]);
      setIsSelectionMode(false);
    }
  };

  return (
    <div className="app-container">
      <div className="page-header">
        <h1>Pima County Assets</h1>
        <p className="page-subtitle">Asset lifecycle management dashboard</p>
      </div>

      {/* --- TOOLBAR (GLOBAL ACTIONS) --- */}
      <AssetToolbar
        onAddAsset={openModalForAdd}
        onUploadCSV={() => setShowCSVUploader(true)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}

        /* --- SELECTION STATE (bulk delete) --- */
        selectedCount={selectedIds.length}
        isSelectionMode={isSelectionMode}
        setIsSelectionMode={setIsSelectionMode}
        onDeleteSelected={handleBulkDelete}
      />

      {/* --- CSV UPLOADER (CONDITIONALLY SHOWN) --- */}
      {showCSVUploader && (
        <CSVUploader
          onDataParsed={handleCSVData}
          externalError={error}
          clearExternalError={() => setError(null)}
        />
      )}

      {isSelectionMode && (
        <BulkDeleteBanner
          selectedCount={selectedIds.length}
          onDeleteSelected={handleBulkDelete}
          onCancel={() => {
            setIsSelectionMode(false);
            setSelectedIds([]);
          }}
        />
      )}

      {/* --- ASSET TABLER (ROW-LEVEL ACTIONS) --- */}
      <AssetTable
        assets={filteredAssets}
        loading={loading}
        deleteAsset={deleteAsset}
        deleteMultipleAssets={deleteMultipleAssets}
        onEdit={openModalForEdit} // NEW: table tells App when to edit

        /* --- SELECTION STATE (for bulk delete) --- */
        selectedIds={selectedIds}
        setSelectedIds={setSelectedIds}
        isSelectionMode={isSelectionMode}
        setIsSelectionMode={setIsSelectionMode}
      />

      {/* --- MODAL (ADD + EDIT) --- */}
      <AssetModal
        asset={selectedAsset || {}} // empty object = Add Mode
        isOpen={isModalOpen}
        onClose={closeModal}
        onSave={handleSave}
        error={error}
      />
    </div>
  );
}

export default App;