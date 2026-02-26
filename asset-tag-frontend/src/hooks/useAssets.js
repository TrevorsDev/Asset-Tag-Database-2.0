
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

  const addAsset = async (newAsset) => {
    const { error: insError } = await supabase.from('assets').insert([newAsset]);
    if (insError) return false;
    await loadData();
    return true;
  };

  const bulkUpsertAssets = async (csvData) => {
    setLoading(true);
    const aliasMap = {
      'at': 'asset_tag', 'tag': 'asset_tag', 'sn': 'serial_number',
      'dept': 'department', 'purchase request': 'pr', 'purchase_order': 'po',
      'comments': 'notes', 'remarks': 'notes'
    };

    const validColumns = ['asset_tag', 'serial_number', 'model', 'status', 'department', 'pr', 'po', 'notes'];
    
    const mappedData = csvData.map(row => {
      const newRow = {};
      Object.keys(row).forEach(key => {
        const cleanKey = key.toLowerCase().trim();
        const targetKey = aliasMap[cleanKey] || cleanKey;
        if (validColumns.includes(targetKey)) {
          newRow[targetKey] = row[key];
        } 
      });
      return newRow;
    });

    const { error: upError } = await supabase
      .from('assets')
      .upsert(mappedData, { onConflict: 'asset_tag' });

    if (upError) {
      console.error("SUPABASE_UPSERT_ERROR:", upError);
      // Logic: If it's a 23505 error, it's the Serial Number blocking the upload
      if (upError.code === '23505') {
        setError("Upload failed: A serial number in your file already exists under a different tag. Please resolve duplicates.");
      } else {
        setError(`Upload failed: ${upError.message}`);
      }
    } else {
      console.log("UPSERT_SUCCESSFUL");
      // Update local state so UI updates instantly
      setAssets(prevAssets => {
        const incomingMap = new Map(mappedData.map(item => [item.asset_tag, item]));
        const filteredOldAssets = prevAssets.filter(asset => !incomingMap.has(asset.asset_tag));
        return [...mappedData, ...filteredOldAssets];
      });
      setError(null);
    }
    setLoading(false);
  };

  const deleteAsset = async (id) => {
    if (!id) return;
    setLoading(true);
    const { error: delError } = await supabase.from('assets').delete().eq('id', id);
    if (delError) setError(delError.message);
    else await loadData();
    setLoading(false);
  };

  const deleteMultipleAssets = async (ids) => {
    if (!ids || ids.length === 0) return;
    setLoading(true);
    const { error: bulkDelError } = await supabase.from('assets').delete().in('id', ids);
    if (bulkDelError) setError(bulkDelError.message);
    else await loadData();
    setLoading(false);
  };

  const updateAsset = async (id, updatedFields) => {
    if (!id) return false;
    setLoading(true);
    const { error: updateError } = await supabase.from('assets').update(updatedFields).eq('id', id);
    if (updateError) {
      setError(updateError.message);
      setLoading(false);
      return false;
    } else {
      await loadData();
      return true;
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return {
    assets, loading, error, setError,
    addAsset, bulkUpsertAssets, deleteAsset,
    deleteMultipleAssets, updateAsset, refreshAssets: loadData
  };
}

export default useAssets;