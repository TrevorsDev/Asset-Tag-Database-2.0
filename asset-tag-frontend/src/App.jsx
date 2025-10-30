/* App.jsx
This is my main React component. It:

- Imports the Supabase connection from supabaseClient.js
- Uses React tools (useState, useEffect) to:
  - Fetch data from Supabase
  - Store it in a variable (assets)
  - Display it on the screen */

import { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';



function App() {
  const [assets, setAssets] = useState([]);

  // Runs once when the component loads
  useEffect(() => {
    fetchAssets();
  }, []);

  // Fetches data from Supabase
  async function fetchAssets() {
    const { data, error } = await supabase.from('assets').select('*');
    if (error) console.error(error);
    else setAssets(data);
  }

  return (
    <div>
      <h1>Asset Tracker</h1>
      <ul>
        {assets.map((asset) => ( 
          <li key={asset.id}>
            {asset.asset_tag} - {asset.model} ({asset.status})
          </li>
        ))}
      </ul>
    </div>




  )
}

export default App
