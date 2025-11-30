/* AssetTable.jsx
This component displays a table of asset data.

- It receives a list of assets as a prop from the parent (App.jsx)
- It renders each asset as a row in the table
- If no assets are found, it displays a fallback message
- This component is read-only and does not modify data
- Handle the “no assets” and “loading” states 
*/

import React, { useState, useEffect } from 'react';
import FiltersBar from './FilterBar';
import useAssets from '../hooks/useAssets';

// Define the AssetTable component
const AssetTable = () => {
  const { assets, loading, error } = useAssets(); //Brought this hook to the top level of function, which is the proper way to use hooks in React.
  const [filters, setFilters] = useState({ 
    asset_tag: '',
    serial_number: '',
    model: '', 
    status: '',
    department: '',
    pr: '',
    po: '' 
  });  //Combined filter column options for all filterable columns.

  const handleFilterChange = (column, value) => {
    setFilters((prev) => ({ ...prev, [column]: value }));
    // This updates the filters object, e.g., { status: 'In Use' }
  };

  // Get a list of unique options filterable dropdowns
  const statusOptions = [...new Set(assets.map((a) => a.status).filter(Boolean))];
  const departmentOptions = [...new Set(assets.map((a) => a.department).filter(Boolean))];

// Filters the assets list based on selected filter values.
// If a filter is empty, it doesn't restrict the results for that column.
  const filteredAssets = assets.filter((asset) => {
    return (
      (!filters.asset_tag || asset.asset_tag.toLowerCase().includes(filters.asset_tag.toLowerCase())) &&
      (!filters.serial_number || asset.serial_number.toLowerCase().includes(filters.serial_number.toLowerCase())) &&
      (!filters.model || asset.model.toLowerCase().includes(filters.model.toLowerCase())) &&
      (!filters.status || asset.status === filters.status) &&
      (!filters.department || asset.department === filters.department) &&
      (!filters.pr || asset.pr.toLowerCase().includes(filters.pr.toLowerCase())) &&
      (!filters.po || asset.po.toLowerCase().includes(filters.po.toLowerCase()))
    );
    // If no filter is selected, show all assets
    // If a filter is selected, only show matching assets
  });

  // Render the table
  return (
    <>
    <FiltersBar
      filters={filters}
      onFilterChange={handleFilterChange}
      statusOptions={statusOptions}
      departmentOptions={departmentOptions}
    />

    <table>
      <thead>
        <tr>
          <th>Asset Tag</th>
          <th>Serial Number</th>
          <th>Model</th>
          <th>Status</th>
          <th>Department</th>
          <th>Purchase Request</th>
          <th>Purchase Order</th>
        </tr>
      </thead>
      <tbody>
        {/* Loop through the filtered assets and render each row */}
        {filteredAssets.map((asset) => (
          <tr key={asset.id}>
            <td>{asset.asset_tag}</td>
            <td>{asset.serial_number}</td>
            <td>{asset.model}</td>
            <td>{asset.status}</td>
            <td>{asset.department}</td>
            <td>{asset.pr}</td>
            <td>{asset.po}</td>
          </tr>
        ))}
      </tbody>
    </table>
    </>
  );
}
// Export the component so it can be used in other files
export default AssetTable;