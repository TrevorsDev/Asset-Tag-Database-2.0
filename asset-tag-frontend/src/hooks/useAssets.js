
/* useAssets.js
This is a custom React hook that manages asset data from Supabase.

- It fetches the list of assets from the Supabase database
- It provides a function to insert new assets
- It manages loading and error states
- It returns the asset list, loading status, error messages, and helper functions
- Used by App.jsx to keep logic clean and reusable
*/

import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

function useAssets() {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch assets from Supabase
  const fetchAssets = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('assets').select('*');

    if (error) {
      console.error('Error fetching assets:', error);
      setError(error.message);
    } else {
      setAssets(data);
      setError(null);
    }

    setLoading(false);
  };

  // Insert a new asset
  const addAsset = async (newAsset) => {
    const { error } = await supabase.from('assets').insert([newAsset]);

    if (error) {
      console.error('Error inserting asset:', error);
      return false;
    }

    await fetchAssets(); // Refresh list
    return true;
  };

  // Fetch assets on first load
  useEffect(() => {
    fetchAssets();
  }, []);

  return {
    assets,
    loading,
    error,
    addAsset,
    refreshAssets: fetchAssets
  };
}

export default useAssets;
