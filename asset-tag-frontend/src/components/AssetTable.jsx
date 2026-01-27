/* AssetTable.jsx
This component displays a table of asset data.

- It receives a list of assets as a prop from the parent (App.jsx)
- It renders each asset as a row in the table
- If no assets are found, it displays a fallback message
- This component is read-only and does not modify data
- Handle the “no assets” and “loading” states 
*/

import React, { useState } from 'react';
import { Trash2 } from 'lucide-react'; // Imports Trash icon
import FiltersBar from './FilterBar';
import useAssets from '../hooks/useAssets';
import './assetTable.css'

/*
 * COMPONENT: AssetTable
 * Purpose: Displays, filters, and manages the deletion of IT assets.
 */
const AssetTable = () => {
// --- 1. DATA & STATE ---
  const { assets, loading, error, deleteAsset, deleteMultipleAssets } = useAssets(); //Brought this hook to the top level of function, which is the proper way to use hooks in React.
  const [selectedIds, setSelectedIds] = useState([]);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  
  // Combined filter state
  const [filters, setFilters] = useState({ 
    asset_tag: '',
    serial_number: '',
    model: '', 
    status: '',
    department: '',
    pr: '',
    po: '' 
  });  //Combined filter column options for all filterable columns.

  // --- 2. HANDLERS (Logic) ---

  const handleFilterChange = (column, value) => {
    setFilters((prev) => ({ ...prev, [column]: value }));
    // This updates the filters object, e.g., { status: 'In Use' }
  };

  // Handles individual deletion
  const handleDeleteClick = (id, assetTag) => {
    const confirmed = window.confirm(`Permanently delete asset ${assetTag}?`);
    if (confirmed) {
      deleteAsset(id);
    }
  };

  // Handles checkbox selection logic
  const toggleSelection = (id) => {
    setSelectedIds((prev) => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  // Handles bulk delete fucntionality
  const handleBulkDelete = () => {
    if (window.confirm(`Delete ${selectedIds.length} selected assets?`)) {
      deleteMultipleAssets(selectedIds);
      setSelectedIds([]);
      setIsSelectionMode(false);
    }
  };

  // Logic for FilterBar dropdowns
  const statusOptions = [...new Set(assets.map((a) => a.status).filter(Boolean))];
  const departmentOptions = [...new Set(assets.map((a) => a.department).filter(Boolean))];

// Filtering Logic. If no filter is selected, show all assets
// If a filter is selected, only show matching assets
  const filteredAssets = assets.filter((asset) => {
    return (
      (!filters.asset_tag || asset.asset_tag.toLowerCase().includes(filters.asset_tag.toLowerCase())) &&
      (!filters.serial_number || (asset.serial_number || '').toLowerCase().includes(filters.serial_number.toLowerCase())) &&
      (!filters.model || asset.model.toLowerCase().includes(filters.model.toLowerCase())) &&
      (!filters.status || asset.status === filters.status) &&
      (!filters.department || asset.department === filters.department) &&
      (!filters.pr || (asset.pr || '').toLowerCase().includes(filters.pr.toLowerCase())) &&
      (!filters.po || (asset.po || '').toLowerCase().includes(filters.po.toLowerCase()))
    );
  });

  //--- 3. RENDER HELPER (Prevents clutter in return statement) ---
  // Simple Error/Loading UI
  if (loading && assets.length === 0) return <p>Loading assets...</p>;
  if (error) return <p style={{ color: 'red' }}>Error: {error}</p>;

  // Render the table
  return (
    <div className="table-wrapper">
      {/* Selection Mode Controls */}
      <div className="table-controls">
        <button
          className={`manage-btn ${isSelectionMode ? 'active' : ''}`}
          onClick={() => {
            setIsSelectionMode(!isSelectionMode);
            setSelectedIds([]);
          }}
        >
          {isSelectionMode ? 'Cancel Selection' : 'Delete Multiple'}
        </button>

        {isSelectionMode && selectedIds.length > 0 && (
          <button className="bulk-delete-btn" onClick={handleBulkDelete}>
            Delete {selectedIds.length} Selected
          </button>
        )}
      </div>

    <FiltersBar
      filters={filters}
      onFilterChange={handleFilterChange}
      statusOptions={statusOptions}
      departmentOptions={departmentOptions}
    />

    <table className="asset-table">
      <thead>
        <tr>
          {/* Checkbox column only shows in selection mode */}
          {isSelectionMode && <th className="checkbox-col"></th>}
          <th>Asset Tag</th>
          <th>Serial Number</th>
          <th>Model</th>
          <th>Status</th>
          <th>Department</th>
          <th>Purchase Request</th>
          <th>Purchase Order</th>
          <th></th> { /* Empty header resembling Protonmail's trashcan experiecne. Delete funcitonality */ }
        </tr>
      </thead>
      <tbody>
        {/* Loop through the filtered assets and render each row */}
        {filteredAssets.map((asset) => (
          <tr 
            key={asset.id}
            className={`asset-row ${selectedIds.includes(asset.id) ? 'selected-row' : ''}`}
          >
            {isSelectionMode && (
              <td className="checkbox-col">
                <input 
                  type="checkbox"
                  checked={selectedIds.includes(asset.id)}
                  onChange={() => toggleSelection(asset.id)}
                />
              </td>
            )}
            <td>{asset.asset_tag}</td>
            <td>{asset.serial_number}</td>
            <td>{asset.model}</td>
            <td>{asset.status}</td>
            <td>{asset.department}</td>
            <td>{asset.pr}</td>
            <td>{asset.po}</td>
            <td>
              {/* The Delete Button itself */}
              <button 
                className="trash-button"
                onClick={() => handleDeleteClick(asset.id, asset.asset_tag)} 
                aria-label={`Delete asset ${asset.asset_tag}`}
                title="Delete Asset" 
              >
                <Trash2 /> {/* The Icon Component */}
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
    </div>
  );
}
// Export the component so it can be used in other files
export default AssetTable;