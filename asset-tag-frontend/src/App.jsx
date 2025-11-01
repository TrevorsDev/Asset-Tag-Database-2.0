/* App.jsx
This is my main React component. It:

- Imports the Supabase connection from supabaseClient.js
- Uses React tools (useState, useEffect) to:
  - Fetch data from Supabase
  - Store it in a variable (assets)
  - Display it on the screen */

import { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';


// This is a component. A component in React is a function that returns UI. It’s like a building block of your app.
function App() {
  const [assets, setAssets] = useState([]);
  
  const [loading, setLoading] = useState(true);

  // State and updater for the "Add New Asset" form.
  const [newAsset, setnewAsset] = useState({
    asset_tag: '',
    serial_number: '',
    model: '',
    status: '',
    department: '',
      pr: '',
      po: ''
  });

  
  // This holds the values typed into the form fields and updates them as the user types.
  function updateField(field, value) {
    setnewAsset((prev) => ({ ...prev, [field]: value}));
  }

  // Runs once when the component loads
  useEffect(() => {
    fetchAssets();
  }, []);

  // Fetches data from Supabase
  async function fetchAssets() {
    const { data, error } = await supabase.from('assets').select('*');
    console.log('Fetched data:', data);
    if (error) console.error(error);
    else setAssets(data);
    setLoading(false); // Done loarding
  }

  async function handleSubmit(e) {
    e.preventDefault(); // Stops the form from reloading the page

    const { error } = await supabase.from('assets').insert([newAsset]); //Sends the new asset to your database

    if (error) {
      console.error('Error inserting asset:', error);
    } else {
      console.log('Asset added successfully!');
      // Clears the form after submission
      setnewAsset({
        asset_tag: '',
        serial_number: '',
        model: '',
        status: '',
        department: '',
        pr: '',
        po: ''
      });
      fetchAssets(); // Re-fetches the updated asset list to show the new row
    }
  }

  return (
    <div>
      <h1>Asset Tracker</h1>
      {loading ? (
        <p>Loading assets...</p>
      ) : assets.length === 0 ? (
        <p>No assets found.</p>
      ) : (
        <>
        <h2>Add New Asset</h2>
        <form onSubmit={handleSubmit} style={{ marginBottom: '20px'}}>
          <input type="text" placeholder="Asset Tag" value={newAsset.asset_tag} onChange={(e) => updateField('asset_tag', e.target.value)} required />
          <input type="text" placeholder="Serial Number" value={newAsset.serial_number} onChange={(e) => updateField('serial_number', e.target.value)} required />
          <input type="text" placeholder="Model" value={newAsset.model} onChange={(e) => updateField('model', e.target.value)} required />
          <input type="text" placeholder="Status" value={newAsset.status} onChange={(e) => updateField('status', e.target.value)} required />
          <input type="text" placeholder="Department" value={newAsset.department} onChange={(e) => updateField('department', e.target.value)} required />
          <input type="text" placeholder="Purchase Request" value={newAsset.pr} onChange={(e) => updateField('pr', e.target.value)} required />
          <input type="text" placeholder="Purchase Order" value={newAsset.po} onChange={(e) => updateField('po', e.target.value)} required />
          <button type="submit">Add Asset</button>
        </form>

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
      </>
      )}
      
    </div>
  );
  
}

export default App
