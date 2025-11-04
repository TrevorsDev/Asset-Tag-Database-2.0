// App.jsx (the parent component) - This is the main controller of the Asset Tracker app:

// Is responsible for actually sending the data to Supabase
// Uses the useAssets() hook to fetch data from Supabase
// Holds the current list of assets in state
// Passes that list to AssetTable
// Passes the addAsset() function to AssetForm

import React from 'react';
import AssetForm from './components/AssetForm';
import AssetTable from './components/AssetTable';
import useAssets from './hooks/useAssets';

function App() {
  const { assets, loading, error, addAsset } = useAssets();

  return (
    <div>
      <h1>Asset Tracker</h1>

      {loading && <p>Loading assets...</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}

      <AssetForm onSubmit={addAsset} />
      <AssetTable assets={assets} />
    </div>
  );
}

export default App;
