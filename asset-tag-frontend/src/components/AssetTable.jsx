/* AssetTable.jsx
This component displays a table of asset data.

- It receives a list of assets as a prop from the parent (App.jsx)
- It renders each asset as a row in the table
- If no assets are found, it displays a fallback message
- This component is read-only and does not modify data
- Handle the “no assets” and “loading” states 
*/

import React from 'react';

function AssetTable({ assets }) {
  if (!assets || assets.length === 0) {
    return <p>No assets found.</p>;
  }

  return (
    <table border="1" cellPadding="8" style={{ borderCollapse: 'collapse', marginTop: '20px' }}>
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
        {assets.map((asset) => (
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
