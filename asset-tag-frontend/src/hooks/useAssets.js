
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

// 1. KEEP THIS: The standalone "Named Export" for other files to use
export async function fetchAssets() {
  const { data, error } = await supabase
    .from('assets')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

function useAssets() {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 2. RE-USE the standalone function inside the hook
  const loadData = async () => {
    setLoading(true);
    try {
      const data = await fetchAssets();
      setAssets(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching assets:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Insert a new asset
  const addAsset = async (newAsset) => {
    const { error } = await supabase.from('assets').insert([newAsset]);

    if (error) return false;
    console.error('Error inserting asset:', error);
    await loadData();
    return true;
  };

  const bulkUpsertAssets = async (csvData) => {
    setLoading(true);
    const mappedData = csvData.map(row => ({
      asset_tag: row.asset_tag,
      pr: row.pr,
      status: row.status,
      po: row.po,
      serial_number: row.sn || row.serial_number,
      model: row.model,
      department: row.dept || row.department,
    }));
  
    const {error} =await supabase
      .from('assets')
      .upsert(mappedData, { onConflict: 'asset_tag' });

      if (error) {
        setError(error.message);
      } else {
        await loadData();
      }
      setLoading(false);
    };

    useEffect(() => {
      loadData();
    }, []);

  // Fetch assets on first load
  useEffect(() => {
    fetchAssets();
  }, []);

  return {
    assets,
    loading,
    error,
    addAsset,
    bulkUpsertAssets,
    refreshAssets: loadData
  };
}

export default useAssets;
