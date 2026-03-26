
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

  // This funciton fetches data and CALLS setAssets to refresh the UI
  const loadData = async () => {
    setLoading(true);
    try {
      const { data, error: fetchError } = await supabase
        .from('assets')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      setAssets(data); // This is the trigger for the UI refresh
      setError(null);
    } catch (err) {
      console.error('Error fetching assets:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Insert a single asset
  const addAsset = async (newAsset) => {
    const { error: insError } = await supabase.from('assets').insert([newAsset]);
    if (insError) return false;

    // Refresh from DB after insert
    await loadData();
    return true;
  };

  // Bulk upload or update assets from CSV
  const bulkUpsertAssets = async (csvData) => {
    setLoading(true);

    /**
     * Alias map:
     * - Keys are normalized CSV headers (lowercase, underscores)
     * - Values are your actual DB column names
     */
    const aliasMap = {
      // asset tag
      'asset_tag': 'asset_tag',
      'asset tag': 'asset_tag',
      'at': 'asset_tag',
      'tag': 'asset_tag',

      // serial number
      'serial_number': 'serial_number',
      'serial number': 'serial_number',
      'sn': 'serial_number',

      // model
      'model': 'model',

      // status
      'status': 'status',

      // department
      'department': 'department',
      'dept': 'department',

      // purchase request
      'purchase_request': 'pr',
      'purchase request': 'pr',
      'pr': 'pr',

      // purchase order
      'purchase_order': 'po',
      'purchase order': 'po',
      'po': 'po',

      // notes / comments / remarks
      'notes': 'notes',
      'comments': 'notes',
      'remarks': 'notes'
    };

    const validColumns = [
      'asset_tag',
      'serial_number',
      'model',
      'status',
      'department',
      'pr',
      'po',
      'notes'
    ];

    /**
     * Map CSV rows -> DB rows
     * - Normalize keys again defensively (in case something slipped through)
     * - Use aliasMap to resolbe to 
     * Ignore unknown columns
     */
    // Normalize CSV keys -> DB column names
    const mappedData = csvData.map((row, rowIndex) => {
    const newRow = {};

    Object.keys(row).forEach(rawKey => {
      if (!rawKey) return;

      const normalizedKey = rawKey.toString().trim().toLowerCase().replace(/\s+/g, '_');
      const targetKey = aliasMap[normalizedKey];

      if (targetKey && validColumns.includes(targetKey)) {
        newRow[targetKey] = row[rawKey];
      }
    });

    // Optional: log rows that end up empty (no recognized columns)
    if (Object.keys(newRow).length === 0) {
      console.warn(`Row ${rowIndex + 1} had no recognized columns and will be skipped`,  row);
    }

    return newRow;
  }).filter(row => Object.keys(row).length > 0) // drop completely empty mapped rows

  // If nothing mapped, stop early
  if (mappedData.length === 0) {
    setError('No valid asset rows were found in the CSV. Please check your headers and try again.');
    setLoading(false);
    throw new Error('No valid rows after mapping.');
  }

    // Perform upsert
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
      // CRITICAL: We throw the error so CSVUploader knows the upload failed
      setLoading(false);
      throw upError; // Important: tells CSVUploader the upload failed
    }

    // Update local state so UI updates instantly
    setAssets(prevAssets => {
      const incomingMap = new Map(mappedData.map(item => [item.asset_tag, item]));

      // Keep old assets that were NOT overwritten
      const filteredOldAssets = prevAssets.filter(asset => !incomingMap.has(asset.asset_tag)
      );

      // New/updated assets first, then old ones
      return [...mappedData, ...filteredOldAssets];
    });

    setError(null);
    setLoading(false);
  };

  // Delete a single asset
  const deleteAsset = async (id) => {
    if (!id) return;
    setLoading(true);

    const { error: delError } = await supabase.from('assets').delete().eq('id', id);

    if (delError) setError(delError.message);
    else await loadData();

    setLoading(false);
  };

  // Delete multiple assets
  const deleteMultipleAssets = async (ids) => {
    if (!ids || ids.length === 0) return;
    setLoading(true);

    const { error: bulkDelError } = await supabase.from('assets').delete().in('id', ids);

    if (bulkDelError) setError(bulkDelError.message);
    else await loadData();

    setLoading(false);
  };

  // Update a single asset
  const updateAsset = async (id, updatedFields) => {
    if (!id) return false;
    setLoading(true);

    const { error: updateError } = await supabase
      .from('assets')
      .update(updatedFields)
      .eq('id', id);

    if (updateError) {
      setError(updateError.message);
      setLoading(false);
      return false;
    }

    await loadData();
    return true;
  };

  useEffect(() => {
    loadData();
  }, []);

  return {
    assets,
    loading,
    error,
    setError,
    addAsset,
    bulkUpsertAssets,
    deleteAsset,
    deleteMultipleAssets,
    updateAsset
  };
}

export default useAssets;

/* NOTE: Left off at the integration of 'loadData' into the bulkUpsertAssets workflow. The current task is to ensure that 'loadData' is called immediately after a successful Supabase upsert to update the 'assets' state, which triggers a re-render of the AssetTable automatically without requiring a page refresh. 'fetchAssets' is now aliased to 'loadData'. */