// App.jsx (the parent component) - This is the main controller of the Asset Tracker app:

// Is responsible for actually sending the data to Supabase
// Uses the useAssets() hook to fetch data from Supabase
// Holds the current list of assets in state
// Passes that list to AssetTable
// Passes the addAsset() function to AssetForm

import { useState, useEffect } from 'react';

import AssetToolbar from './components/AssetToolbar.jsx';
import AssetTable from './components/AssetTable';
import AssetModal from './components/AssetModal.jsx';
import CSVUploader from './components/CSVUploader/CSVUploader.jsx';
import ConfirmDialog from './components/ConfirmDialog.jsx';
import ExportModal from './components/ExportModal.jsx';

import useAssets from './hooks/useAssets.js';
import BulkDeleteBanner from './components/BulkDeleteBanner.jsx';
import Toast from './components/Toast.jsx';

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
  const [showExportModal, setShowExportModal] = useState(false);
  const [toast, setToast] = useState(null); // null = hidden, { message, type } = visible

  const showToast = (message, type = 'success') => setToast({ message, type });

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
      await updateAsset(id, data);
      showToast('Asset updated successfully');
    } else {
      await addAsset(data);
      showToast('Asset added successfully');
    }

    closeModal();
  };

  // 5. CSV UPLOAD HANDLER ---
  // This function bridges the CSV data to my Supabase hook
  const handleCSVData = async (data) => {
    await bulkUpsertAssets(data);
    setShowCSVUploader(false);
    showToast(`${data.length} asset${data.length !== 1 ? 's' : ''} imported successfully`);
  };

  // EXPORT FILE HANDLER
  const handleExportCSV = () => {
    if (!assets || assets.length === 0) return;
    setShowExportModal(true);
  };

  const handleConfirmExport = () => {
    setShowExportModal(false);
    if (!assets || assets.length === 0) {
      return;
    }

    // Define the columns you want in the CSV
    const headers = [
      "asset_tag",
      "serial_number",
      "model",
      "status",
      "department",
      "pr",
      "po",
      "notes"
    ];

    // 6. Convert to CSV format
    const csvRows = [];

    // Header row
    csvRows.push(headers.join(","));

    // Data rows
    assets.forEach(asset => {
      const row = headers.map(h => {
        const value = asset[h] ?? "";
        // Escape quotes
        return `"${String(value).replace(/"/g, '""')}"`;
      });
      csvRows.push(row.join(","));
    });

    const csvString = csvRows.join("\n");

    // Trigger browser download
    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "pima_assets_exports.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // --- 7. FILTER ASSETS BASED ON SEARCH QUERY ---
  const filteredAssets = assets.filter((asset) => {
    const tokens = searchQuery.toLowerCase().split(' ').filter(Boolean);

    return tokens.every((token) =>
      Object.values(asset).some((value) =>
        String(value).toLowerCase().includes(token)
      )
    );
  });

  // --- 8. SELECTION STATE (for bulk delete) ---
  const [selectedIds, setSelectedIds] = useState([]);
  const [isSelectionMode, setIsSelectionMode] = useState(false);

  // Auto-dismiss banner when last checkbox is unchecked
  useEffect(() => {
    if (selectedIds.length === 0) setIsSelectionMode(false);
  }, [selectedIds]);
  const [confirmDialog, setConfirmDialog] = useState(null); // null = closed

  // --- 9. BULK DELETE HANDLER ---
  const handleBulkDelete = () => {
    setConfirmDialog({
      message: `Permanently delete ${selectedIds.length} selected asset${selectedIds.length !== 1 ? 's' : ''}?`,
      onConfirm: () => {
        const count = selectedIds.length;
        deleteMultipleAssets(selectedIds);
        setSelectedIds([]);
        setIsSelectionMode(false);
        setConfirmDialog(null);
        showToast(`${count} asset${count !== 1 ? 's' : ''} deleted`);
      }
    });
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
        onExportCSV={handleExportCSV}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}


        /* --- SELECTION STATE (bulk delete) --- */
        selectedCount={selectedIds.length}
        isSelectionMode={isSelectionMode}
        setIsSelectionMode={setIsSelectionMode}
        onDeleteSelected={handleBulkDelete}
      />

      {/* --- EXPORT MODAL (CONDITIONALLY SHOWN) --- */}
      <ExportModal
        isOpen={showExportModal}
        assetCount={assets.length}
        onConfirm={handleConfirmExport}
        onClose={() => setShowExportModal(false)}
      />

      {/* --- CSV UPLOADER (CONDITIONALLY SHOWN) --- */}
      {showCSVUploader && (
        <CSVUploader
          onDataParsed={handleCSVData}              // upload + close on success
          externalError={error}                     // show errors from useAssets
          clearExternalError={() => setError(null)} // allow CSVUploader to clear them
          onClose={() => setShowCSVUploader(false)} // cancel / X button
          existingAssets={assets}
        />
      )}

      <BulkDeleteBanner
        isVisible={isSelectionMode}
        selectedCount={selectedIds.length}
        onDeleteSelected={handleBulkDelete}
        onCancel={() => {
          setIsSelectionMode(false);
          setSelectedIds([]);
        }}
      />

      {/* --- ASSET COUNT --- */}
      <p className="asset-count">
        {searchQuery
          ? `Showing ${filteredAssets.length} of ${assets.length} assets`
          : `${assets.length} asset${assets.length !== 1 ? 's' : ''}`
        }
      </p>

      {/* --- ASSET TABLER (ROW-LEVEL ACTIONS) --- */}
      <AssetTable
        assets={filteredAssets}
        loading={loading}
        deleteAsset={deleteAsset}
        deleteMultipleAssets={deleteMultipleAssets}
        onEdit={openModalForEdit}
        showToast={showToast}

        /* --- SELECTION STATE (for bulk delete) --- */
        selectedIds={selectedIds}
        setSelectedIds={setSelectedIds}
        isSelectionMode={isSelectionMode}
        setIsSelectionMode={setIsSelectionMode}
      />

      {/* --- TOAST NOTIFICATIONS --- */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* --- CONFIRM DIALOG (DELETE) --- */}
      <ConfirmDialog
        isOpen={!!confirmDialog}
        message={confirmDialog?.message}
        onConfirm={confirmDialog?.onConfirm}
        onCancel={() => setConfirmDialog(null)}
      />

      {/* --- MODAL (ADD + EDIT) --- */}
      <AssetModal
        asset={selectedAsset || {}} // empty object = Add Mode
        isOpen={isModalOpen}
        onClose={closeModal}
        onSave={handleSave}
        error={error}
        assets={assets}
      />
    </div>
  );
}

export default App;