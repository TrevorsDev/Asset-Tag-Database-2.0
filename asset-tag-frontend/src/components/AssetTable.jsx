/* AssetTable.jsx
This component displays a table of asset data.

- It receives a list of assets as a prop from the parent (App.jsx)
- It renders each asset as a row in the table
- If no assets are found, it displays a fallback message
- This component is read-only and does not modify data
- Handle the “no assets” and “loading” states 
*/

import React, { useState } from 'react';
import { Trash2, Pencil } from 'lucide-react'; // Imports Trash icon
import './AssetTable.css'

/*
 * COMPONENT: AssetTable
 * Purpose: Displays, and manages the deletion of IT assets.
 */
const AssetTable = ({
  assets,
  loading,
  deleteAsset,
  onEdit,
  selectedIds,
  setSelectedIds,
  isSelectionMode,
  setIsSelectionMode
}) => {

  // --- 1. DATA & STATE ---
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

  //--- 3. RENDER HELPER (Prevents clutter in return statement) ---
  // Simple Error/Loading UI
  if (loading && assets.length === 0) return <p>Loading assets...</p>;

  // Render the table
  return (
    <div className="asset-table-container">

      {/* Selection Mode Controls */}
      <div className="asset-table__controls">
        <button
          className={`global-btn secondary-btn ${isSelectionMode ? 'active' : ''}`}
          onClick={() => {
            setIsSelectionMode(!isSelectionMode);
            setSelectedIds([]);
          }}
        >
          {isSelectionMode ? 'Cancel Selection' : 'Delete Assets'}
        </button>

        {isSelectionMode && selectedIds.length > 0 && (
          <button className="global-btn secondary-btn bulk-delete-btn" onClick={handleBulkDelete}>
            Delete {selectedIds.length} Selected
          </button>
        )}
      </div>

      <table className="asset-table u-flex-center">
        <thead className="asset-table__header ">
          <tr>
            {/* Checkbox column only shows in selection mode */}
            {isSelectionMode && <th className=" asset-table__header--checkbox checkbox-col"></th>}
            <th className="asset-table__header asset-table__header--tag" title="Asset Tag">Asset Tag</th>
            <th className="asset-table__header" title="Serial Number">Serial Number</th>
            <th className="asset-table__header" title="Model">Model</th>
            <th className="asset-table__header asset-table__header--status" title="Status">Status</th>
            <th className="asset-table__header" title="Department">Department</th>
            <th className="asset-table__header" title="Purchase Request">Purchase Request</th>
            <th className="asset-table__header" title="Purchase Order">Purchase Order</th>
            <th className="asset-table__header" title="Notes">Notes</th>
          </tr>
        </thead>
        <tbody>
          {/* Loop through the filtered assets and render each row */}
          {assets.map((asset) => (
            <tr
              key={asset.id}
              className={`asset-table__row ${selectedIds.includes(asset.id) ? 'asset-table__row--selected' : ''}`}
            >
              {isSelectionMode && (
                <td className="asset-table__cell--center checkbox-col">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(asset.id)}
                    onChange={() => toggleSelection(asset.id)}
                  />
                </td>
              )}
              <td className="asset-table__cell asset-table__cell--center" title={asset.asset_tag}>{asset.asset_tag}</td>
              <td className="asset-table__cell asset-table__cell--center" title={asset.serial_number}>{asset.serial_number}</td>
              <td className="asset-table__cell asset-table__cell--center" title={asset.model}>{asset.model}</td>
              <td className="asset-table__cell asset-table__cell--center" title={asset.status}>{asset.status}</td>
              <td className="asset-table__cell asset-table__cell--center" title={asset.department}>{asset.department}</td>
              <td className="asset-table__cell asset-table__cell--center" title={asset.pr}>{asset.pr}</td>
              <td className="asset-table__cell asset-table__cell--center" title={asset.po}>{asset.po}</td>{/* The text wrapper is key here */}

              <td className="asset-table__cell asset-table__cell--center asset-table__cell--last" title={asset.notes}>
                <span className="asset-table__cell-text" title={asset.notes}>
                  {asset.notes}
                </span>

                {/* The Delete Button itself */}
                <div className="asset-table__actions-container">
                  <button
                    className="icon-button icon-button--trash"
                    onClick={() => handleDeleteClick(asset.id, asset.asset_tag)}
                    aria-label={`Delete asset ${asset.asset_tag}`}
                    title="Delete Asset"
                  >
                    <Trash2 /> {/* The Icon Component */}
                  </button>
                  {/* The edit button itself */}
                  <button
                    className="icon-button icon-button--edit"
                    onClick={() => onEdit(asset)}
                    aria-label={`Edit asset ${asset.asset_tag}`}
                  >
                    <Pencil />
                  </button>
                </div>
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