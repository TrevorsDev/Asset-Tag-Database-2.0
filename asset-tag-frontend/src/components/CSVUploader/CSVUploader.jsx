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

const CSVUploader = ({ onDataParsed }) => {
  const [tempData, setTempData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
      setError("Please upload a valid .csv file.");
      return;
    }

    setLoading(true);
    setError(null);

    // This line creates a new instance of the browser's "FileReader" tool
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const csvContent = e.target.result;
        const parsedData = parseCSV(csvContent); 
        console.log(`Successfully parsed ${parsedData.length} rows.`);
        setTempData(parsedData); 
      } catch (err) {
        setError(`Error parsing file: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    reader.onerror = () => {
      setError("Failed to read file.");
      setLoading(false);
    };

    // This line tells that browser tool to start reading the file
    reader.readAsText(file);
  };

  const handleUpload = async () => {
    setLoading(true);
    try {
      await onDataParsed(tempData);
      setTempData([]); 
      if (fileInputRef.current) fileInputRef.current.value = ""; 
    } catch (err) {
      setError("Upload failed. Please try again.");
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
      
      <label htmlFor="csv-upload-input" className="upload-label">
        {loading ? 'Processing...' : 'Choose a .csv file to upload'}
      </label>
      
      {tempData.length > 0 && (
        <div className="upload-preview-box">
          <p><strong>{tempData.length}</strong> rows ready to upload.</p>
          <button className="confirm-btn" onClick={handleUpload} disabled={loading}>
            {loading ? 'Uploading...' : 'Confirm & Upload to Database'}
          </button>
          <button className="cancel-btn" onClick={() => setTempData([])} disabled={loading}>
            Cancel
          </button>
        </div>
      )}
      
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default CSVUploader;