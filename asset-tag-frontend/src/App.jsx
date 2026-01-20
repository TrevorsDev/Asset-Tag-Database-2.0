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
import CSVUploader from './components/CSVUploader/CSVUploader.jsx';

function App() {
  // We only call the hook ONCE at the top
  // We get addAsset and bulkUpsertAssets for the Form and Uploader
  const { addAsset, bulkUpsertAssets } = useAssets();

  // This function bridges the CSV data to my Supabase hook
const handleCSVData = async (data) => {
    console.log("CSV Data recieved:", data);
    await bulkUpsertAssets(data);
};

  return (
    <div className="app-container">
      
      <h1>Asset Tracker</h1>

      {/* Form and Uploader need the funcitons passed as props */}
      <AssetForm onSubmit={addAsset} />
      <CSVUploader onDataParsed={handleCSVData} />
      <AssetTable/>

    </div>
  );
}

export default App;
