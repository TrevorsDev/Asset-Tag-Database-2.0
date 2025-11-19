/* AssetTable.jsx
This component displays a table of asset data.

- It receives a list of assets as a prop from the parent (App.jsx)
- It renders each asset as a row in the table
- If no assets are found, it displays a fallback message
- This component is read-only and does not modify data
- Handle the “no assets” and “loading” states 
*/

import React, { useState, useEffect } from 'react';
import ColumnFilter from './AssetSearch';
import useAssets from '../hooks/useAssets';

const AssetTable = () => {
  const { assets, loading, error } = useAssets(); //Brought this hook to the top level of function, which is the proper way to use hooks in React.
  const [filters, setFilters] = useState({ status: '' });

  const handleFilterChange = (column, value) => {
    setFilters((prev) => ({ ...prev, [column]: value }));
  };

  const filteredAssets = assets.filter((asset) => {
    return (
      (!filters.status || asset.status === filters.status)
    );
  });

  const statusOptions = [...new Set(assets.map((a) => a.status).filter(Boolean))];
// console.log('Filtered asset IDs:', filteredAssets.map(a => a.id));

  return (
    <table>
      <thead>
        <tr>
          <th>Asset Tag</th>
          <th>Serial Number</th>
          <th>Model</th>
          <th>
            Status
            <ColumnFilter
              column="status"
              type="dropdown"
              options={statusOptions}
              value={filters.status}
              onChange={handleFilterChange}
            />
          </th>
          <th>Department</th>
          <th>Purchase Request</th>
          <th>Purchase Order</th>
        </tr>
      </thead>
      <tbody>
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
  );
}

export default AssetTable;