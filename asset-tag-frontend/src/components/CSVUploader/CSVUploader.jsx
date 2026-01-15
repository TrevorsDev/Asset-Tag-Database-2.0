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

import React, { useState } from 'react';

/**
 * Parses a CSV string into a JavaScript array of objects.
 * Handles thousands of rows and validates the structure based on the first line (headers).
 * @param {string} csvString The raw text content of the CSV file.
 * @returns {Array<Object>} An array of objects where keys are headers.
 */
const parseCSV = (csvString) => {
  // Use regex to split the string by lines, correctly handling line endings (CRLF or LF)
  const lines = csvString.trim().split(/\r\n|\n/);

  if (lines.length === 0) {
    throw new Error("CSV file is empty.");
  }

  // Extract and clean headers (around 20-25 expected)
  const headers = lines[0].split(',').map(header => header.trim());

  const result = [];

  // Iterate over the rest of the lines (starting from index 1)
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(value => value.trim());

    // Basic structure validation: ensure the number of values matches the number of headers
    if (values.length !== headers.length) {
      console.warn(`Skipping row ${i + 1} due to structure mismatch: expected ${headers.length} columns, found ${values.length}`);
      continue;
    }

    const obj = {};
    for (let j = 0; j < headers.length; j++) {
      // Create the object: header as key, value as value
      obj[headers[j]] = values[j];
    }
    result.push(obj);
  }

  return result;
};


const CSVUploader = ({ onDataParsed }) => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validation: Check file type
    if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
      setError("Please upload a valid .csv file.");
      return;
    }

    setLoading(true);
    setError(null);

    // FileReader is a browser API used to read file contents
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const csvContent = e.target.result;
        // Pass the raw string content to our dedicated parsing logic
        const parsedData = parseCSV(csvContent); 
        
        console.log(`Successfully parsed ${parsedData.length} rows.`);
        
        // Return the clean JS array of objects to the parent component
        onDataParsed(parsedData); 

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

    // Read the file content as text
    reader.readAsText(file);
  };

  return (
    <div className="csv-uploader">
      <input
        type="file"
        accept=".csv"
        onChange={handleFileChange}
        disabled={loading}
        id="csv-upload-input"
      />
      <label htmlFor="csv-upload-input">
        {loading ? 'Parsing...' : 'Choose a .csv file to upload'}
      </label>
      
      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      {/* Add a placeholder for eventual backend submission logic */}
      {/* <button onClick={handleSendDataToBackend}>Send to SQL Server</button> */}
    </div>
  );
};

export default CSVUploader;
