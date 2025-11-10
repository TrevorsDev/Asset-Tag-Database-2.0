/* AssetTable.jsx
This component displays a table of asset data.

- It receives a list of assets as a prop from the parent (App.jsx)
- It renders each asset as a row in the table
- If no assets are found, it displays a fallback message
- This component is read-only and does not modify data
- Handle the “no assets” and “loading” states 
*/

import React from 'react'; // Import React and hooks for managing state and side effects
import ColumnFilter from './AssetSearch'; // Import the reuseable dropdown filter component
import fetchAssets from '../hooks/useAssets'; //Import the function that fetches asset data from Supabase

// Define the AssetTable component
const AssetTable = () => {
  const [assets, setAssets] = useState([[]]); // Create state to store the list of assets
  const [filters, setFilters] = useState({ status: '' }); // Create state to store the current filter values (starting with status)

  // useEffect runs once when the component mounts
  useEffect(() => {
    // Define an async function to fetch assets
    const loadAssets = async () => {
      const data = await useAssets(); // Call the fetch function
      setAssets(data); // Store the result in state
    };
    loadAssets(); // Call the function
  }, []); // Empty dependency array = run once on mount
  // Handle changes to the filter dropdown
  const handleFilterChange = (column, value) => {
    setFilters((prev) => ({ ...prev, [column]: value }));
    // This updates the filters object, e.g., { status: 'In Use' }
  };

  // Filter the assets based on the selected status
  const filteredAssets = assets.filter((asset) => {
    return (
      (!filters.status || asset.status === filters.status)
    );
    // If no filter is selected, show all assets
    // If a filter is selected, only show matching assets
  });

  // Get a list of unique status values for the dropdown
  const statusOptions = [...new Set(assets.map((a) => a.status).filter(Boolean))];

  // Render the table
  return (
    <table>
      <thead>
        <tr>
          <th>Asset Tag</th>
          <th>Serial Number</th>
          <th>Model</th>
          <th>
            Status
            // Render the dropdown filter for the status column
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
        // Loop through the filtered assets and render each row
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
// Export the component so it can be used in other files
export default AssetTable;