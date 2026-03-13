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
 * HELPER FUNCTION: This must be defined for the component to use it.
 */
const parseCSV = (csvString) => {
  const lines = csvString.trim().split(/\r\n|\n/);
  if (lines.length === 0) throw new Error("CSV file is empty.");

  const headers = lines[0].split(',').map(header => header.trim());
  const result = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(value => value.trim());
    if (values.length !== headers.length) continue;

    const obj = {};
    for (let j = 0; j < headers.length; j++) {
      obj[headers[j]] = values[j];
    }
    result.push(obj);
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
  const count = tempData.length // Captures the number of uploaded csv files.

  const handleClear = () => {
    setUploadSuccess(false);     // hides success alert
    setLastUploadCount(0);       // resets count
    setLocalError(null);         // clears local error
    clearExternalError();        // clears DB error

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    setTempData([]); // Clear staged rows on error
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Clear previous errors (both local and from the database) when a new file is picked
    setLocalError(null);
    if (clearExternalError) clearExternalError();

    if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
      setLocalError("Please upload a valid .csv file.");
      return;
    }

    setLoading(true);

    // This line creates a new instance of the browser's "FileReader" tool
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const csvContent = e.target.result;
        const parsedData = parseCSV(csvContent);
        console.log(`Successfully parsed ${parsedData.length} rows.`);
        setTempData(parsedData);
      } catch (err) {
        setLocalError(`Error parsing file: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };
    // This line tells that browser tool to start reading the file
    reader.readAsText(file);
  };

  // SECTION: DATABASE COMMUNICATION
  // This function takes our verified "tempData" and attempts to push it to Supabase.
  const handleUpload = async () => {
    setLoading(true);
    setUploadSuccess(false); // Reset success state for the new attempt
    setLocalError(null); // Clear any previous "Wrong File Type" errors

    try {
      // Capture the count BEFORE clearing tempData
      const rowCount = tempData.length
      setLastUploadCount(count);
      // 1. We MUST await the database operation
      await onDataParsed(tempData);

      // 2. CRITICAL CHECK: Ensure onDataParsed THROWS the error.
      setUploadSuccess(true);
      setTempData([]); // Clear the staging area
      if (fileInputRef.current) fileInputRef.current.value = "";

    } catch (err) {
      /* ERROR PATH
          If we are here, (onDataParsed) threw an error.
          We explicitly make sure uploadSuccess is false. 
      */
      setUploadSuccess(false); // Explicitly ensure success is false on error
      console.error("Database rejected the upload:", err);

      // Reset file input so user can re-upload the same file
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      setTempData([]); // Clear staged rows on error

    } finally {
      setLoading(false); // Stop the "Processing..." spinner
    }
  };

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
          onClose={handleClear}
        />
      )}

      {/* ERROR MESSAGE:
    This logic shows either a local fiile error OR the database error.
    */}
      {(localError || externalError) && (
        <Alert
          type="error"
          message={localError || externalError}
          onClose={handleClear}
        />

      )}

      {/* 2. Upload Action Area */}
      {/* If we aren't showing a success message, show the button */}
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
          <label htmlFor="csv-upload-input" className={`global-btn primary-btn upload-label ${tempData.length > 0 ? 'secondary-btn' : 'primary-btn'}`}>
            {loading ? 'Processing...' : tempData.length > 0 ? 'Change File' : 'Choose a .csv file to upload'}
          </label>
        </>
      )}

      {/* THE PREVIEW & CONFIRM SECTION */}
      {tempData.length > 0 && !uploadSuccess && (
        <div className="upload-preview-box">
          <p className='preview-text'><strong>{tempData.length}</strong> rows ready to upload.</p>
          <button className="global-btn primary-btn confirm-btn" onClick={handleUpload} disabled={loading}>
            {loading ? 'Uploading...' : 'Confirm & Upload'}
          </button>
          <button className="global-btn primary-btn cancel-btn" onClick={() => setTempData([])} disabled={loading}>
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};

export default CSVUploader;