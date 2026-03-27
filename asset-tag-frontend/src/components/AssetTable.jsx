/* AssetTable.jsx
This component displays a table of asset data.

- It receives a list of assets as a prop from the parent (App.jsx)
- It renders each asset as a row in the table
- If no assets are found, it displays a fallback message
- This component is read-only and does not modify data
- Handle the “no assets” and “loading” states 
*/

import { useState } from 'react';
import { Trash2, Pencil } from 'lucide-react';
import ConfirmDialog from './ConfirmDialog';
import './AssetTable.css'
import '../App.css'

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
  setIsSelectionMode,
  showToast
}) => {

  // --- 1. DATA & STATE ---
  const [confirmDialog, setConfirmDialog] = useState(null); // null = closed

  const handleDeleteClick = (id, assetTag) => {
    setConfirmDialog({
      message: `Permanently delete asset ${assetTag}?`,
      onConfirm: () => {
        deleteAsset(id);
        setConfirmDialog(null);
        showToast('Asset deleted');
      }
    });
  };

  // Handles checkbox selection logic
  const toggleSelection = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const [hoveredRowId, setHoveredRowId] = useState(null);

  //--- 3. RENDER HELPER (Prevents clutter in return statement) ---
  // Simple Error/Loading UI
  if (loading && assets.length === 0) return <p>Loading assets...</p>;

  // Render the table
  return (
    <>
    <div className="asset-table-container">

      <table className="asset-table">
        <thead className="asset-table__header">
          <tr>
            <th className="checkbox-col"></th>
            <th className="asset-table__header">Asset Tag</th>
            <th className="asset-table__header">Serial Number</th>
            <th className="asset-table__header">Model</th>
            <th className="asset-table__header">Status</th>
            <th className="asset-table__header">Department</th>
            <th className="asset-table__header">Purchase Request</th>
            <th className="asset-table__header">Purchase Order</th>
            <th className="asset-table__header">Notes</th>
          </tr>
        </thead>

        <tbody>
          {assets.map((asset) => (
            <tr
              key={asset.id}
              className={`asset-table__row ${selectedIds.includes(asset.id) ? 'asset-table__row--selected' : ''
                }`}
              onMouseEnter={() => !isSelectionMode && setHoveredRowId(asset.id)}
              onMouseLeave={() => !isSelectionMode && setHoveredRowId(null)}
            >
              {/* Checkbox cell logic */}
              <td className="checkbox-col">
                <div
                  className={
                    isSelectionMode
                      ? "checkbox-wrapper checkbox-wrapper--active"
                      : hoveredRowId === asset.id
                        ? "checkbox-wrapper checkbox-wrapper--hover"
                        : "checkbox-wrapper"
                  }
                >
                  <input
                    type="checkbox"
                      // disabled={isDisabled}  // reserved for future permission/authorization logic
                    checked={selectedIds.includes(asset.id)}
                    onChange={() => {
                      toggleSelection(asset.id);
                      if (!isSelectionMode) setIsSelectionMode(true);
                    }}
                  />
                </div>
              </td>


              {/* Data cells */}
              <td className="asset-table__cell">{asset.asset_tag}</td>
              <td className="asset-table__cell">{asset.serial_number}</td>
              <td className="asset-table__cell">{asset.model}</td>
              <td className="asset-table__cell">{asset.status}</td>
              <td className="asset-table__cell">{asset.department}</td>
              <td className="asset-table__cell">{asset.pr}</td>
              <td className="asset-table__cell">{asset.po}</td>
              <td className="asset-table__cell asset-table__cell--last">
                <span className="asset-table__cell-text">{asset.notes}</span>

                <div className={"asset-table__actions-container"}>
                  <button
                    className="icon-button icon-button--trash focus-ring--danger"
                    onClick={() => handleDeleteClick(asset.id, asset.asset_tag)}
                  >
                    <Trash2 />
                  </button>

                  <button
                    className="icon-button icon-button--edit focus-ring--action"
                    onClick={() => onEdit(asset)}
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

      <ConfirmDialog
        isOpen={!!confirmDialog}
        message={confirmDialog?.message}
        onConfirm={confirmDialog?.onConfirm}
        onCancel={() => setConfirmDialog(null)}
      />
    </>
  );
}
// Export the component so it can be used in other files
export default AssetTable;