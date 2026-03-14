/* 
This file:
- Accepts a .csv file upload
- Parses the file manually (no third-party libraries like PapaParse)
- Validates the structure
- Returns a usable JavaScript array of objects
- Prepares the data to be sent to your backend (eventually SQL Server) 

It does it by:
- Rendering a file input for .csv files
- Reading the file using the FileReader API
- Spliting the content into rows and columns
- Converting it into an array of objects
- Validating that required headers are present
- Logging or returning the parsed data for now 
*/

import React, { useState, useRef } from 'react';
import '../../App.css';
import './CSVUploader.css'; // Import the new stylesheet
import Alert from '../Alert';

/**
 * CSV PARSER
 */
const parseCSV = (csvString) => {
  const lines = csvString.trim().split(/\r\n|\n/);
  if (lines.length === 0) throw new Error("CSV file is empty.");

  const headers = lines[0].split(',').map(header => header.trim());
  const result = [];

  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue; // skip blank lines

    const values = lines[i].split(',').map(v => v.trim());
    if (values.length !== headers.length) continue;

    const row = {}
    headers.forEach((h, idx) => {
      row[h] = values[idx];
    });

    result.push(row);
  }

  if (result.length === 0) {
    throw new Error("CSV contains headers but no data rows")
  }

  return result;
};

/* 'localError' prevents confusion with the database error coming from the 'useAssets' hook. */
const CSVUploader = ({ onDataParsed, externalError, clearExternalError }) => {
  const [tempData, setTempData] = useState([]);
  // 'localError' specifically for file-parsing issues
  const [localError, setLocalError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [lastUploadCount, setLastUploadCount] = useState(0);

  const fileInputRef = useRef(null);

  /*
  HELPER FUNCTIONS
  */

  const resetFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const clearAllErrors = () => {
    setLocalError(null);
    if (clearExternalError) clearExternalError();
  };

  const resetState = () => {
    setTempData([]);
    setUploadSuccess(false);
    setLastUploadCount(0);
    clearAllErrors();
    resetFileInput();
  };

  //------------------------
  // FILE SELECTION
  //------------------------
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    clearAllErrors();

    if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
      setLocalError("Please upload a valid .csv file.");
      resetFileInput();
      return;
    }

    setLoading(true);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const parsed = parseCSV(e.target.result);
        setTempData(parsed);
      } catch (err) {
        setLocalError(`Error parsing file: ${err.message}`);
        resetFileInput();
      } finally {
        setLoading(false);
      }
    };

    reader.readAsText(file);
  };


  //----------------------
  // UPLOAD TO DATABASE
  // ---------------------
  const handleUpload = async () => {
    setLoading(true);
    clearAllErrors();
    setUploadSuccess(false);

    try {
      const rowCount = tempData.length;
      await onDataParsed(tempData);

      setLastUploadCount(rowCount);
      setUploadSuccess(true);
      setTempData([]);
      resetFileInput();

    } catch (err) {
      console.error("Database rejected the upload:", err);
      setUploadSuccess(false);
      setTempData([]);
      resetFileInput();
    } finally {
      setLoading(false);
    }
  };

  // --------------------
  // CANCEL PREVIEW
  // --------------------
  const handleCancel = () => {
    resetState();
  };

  // --------------------
  // RENDER
  // --------------------
  return (
    <div className="csv-uploader-container">
      {/* 1. Notifications Area */}
      {/* SUCCESS MESSAGE:
       Check both the success state AND ensure no errors are blocking it 
      */}
      {uploadSuccess && !externalError && !localError && (
        <Alert
          type="success"
          message={`${lastUploadCount} assets successfully imported!`}
          onClose={resetState}
        />
      )}

      {/* ERROR MESSAGE:
    This logic shows either a local fiile error OR the database error.
    */}
      {(localError || externalError) && (
        <Alert
          type="error"
          message={localError || externalError}
          onClose={resetState}
        />
      )}

      {/* 2. Upload Action Area */}
      {/* FILE INPUT
      If we aren't showing a success message, show the button */}
      {!uploadSuccess && (
        <>
          <input
            type="file"
            id="csv-upload-input"
            className="hidden-file-input"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".csv"
          />

          <label
            htmlFor="csv-upload-input"
            className={`global-btn primary-btn upload-label ${tempData.length > 0 ? 'secondary-btn' : ''}`}
          >
            {loading ? 'Processing...' : tempData.length > 0 ? 'Change File' : 'Choose a .csv file to upload'}
          </label>
        </>
      )}

      {/* THE PREVIEW & CONFIRM SECTION */}
      {tempData.length > 0 && !uploadSuccess && (
        <div className="upload-preview-box">
          <p className='preview-text'>
            <strong>{tempData.length}</strong> rows ready to upload.
          </p>

          <button
            className="global-btn primary-btn confirm-btn"
            onClick={handleUpload}
            disabled={loading}
          >
            {loading ? 'Uploading...' : 'Confirm & Upload'}
          </button>

          <button
            className="global-btn primary-btn cancel-btn"
            onClick={handleCancel}
            disabled={loading}
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};

export default CSVUploader;