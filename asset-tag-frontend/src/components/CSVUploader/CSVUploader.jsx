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
  const fileInputRef = useRef(null);

  const handleClear = () => {
    setLocalError(null);
    if (clearExternalError) clearExternalError();
  }

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Clear previous errors (both local and from the database) when a new file is picked
    setLocalError(null);
    if (clearExternalError) clearExternalError();

    if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
      setError("Please upload a valid .csv file.");
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

  const handleUpload = async () => {
    setLoading(true);
    // Clear local error because we are now attempting the database move
    setLocalError(null);

    try {
      await onDataParsed(tempData);
      // If the line above succeeds, clear the preview
      setTempData([]);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err) {
      /* Professional Note: We leave 'setError' out here. The 'useAssets' hook will catch the Supabase error and pass it back to us via the 'externalError' prop. 
      */
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="csv-uploader-container">
      <input
        type="file"
        accept=".csv"
        onChange={handleFileChange}
        ref={fileInputRef}
        className="hidden-file-input"
        id="csv-upload-input"
      />

      {/* ERROR DISPLAY:
    This logic shows either a local fiile error OR the database error.
    */}
      {(localError || externalError) && (
        <section className="error-message-box" aria-live="assertive">
          <div className="error-content">
            <span className="error-icon" aria-hidden="true">⚠️</span>
            <p>
              <strong>Upload Error:</strong> {localError || externalError}
            </p>
          </div>
          <button
            className="error-close-btn"
            aria-label="Close error"
            onClick={handleClear}
          >
            x
          </button>
        </section>
      )}
      <label htmlFor="csv-upload-input" className=" global-btn primary-btn upload-label">
        {loading ? 'Processing...' : 'Choose a .csv file to upload'}
      </label>

      {tempData.length > 0 && (
        <div className="upload-preview-box">
          <p><strong>{tempData.length}</strong> rows ready to upload.</p>
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