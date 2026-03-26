import { useState, useRef } from 'react';
import { X, UploadCloud, FileText } from 'lucide-react';
import Papa from 'papaparse';
import '../../App.css';
import './CSVUploader.css';
import Alert from '../Alert';

/*
 * Normalize a header string into a consistent key.
 * - Strips BOM, quotes, extra whitespace
 * - Lowercases and replaces spaces with underscores
 */
const normalizeHeader = (header) => {
  if (!header) return '';
  return header
    .replace(/^\uFEFF/, '')
    .trim()
    .replace(/^"|"$/g, '')
    .toLowerCase()
    .replace(/\s+/g, '_');
};

/*
 * Parse CSV using PapaParse.
 * Returns a promise that resolves to an array of row objects.
 */
const parseCSV = (file) => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      transformHeader: normalizeHeader,
      complete: (results) => {
        if (results.errors && results.errors.length > 0) {
          reject(new Error('There was a problem parsing the CSV file. Please check the format.'));
          return;
        }
        const data = results.data || [];
        if (data.length === 0) {
          reject(new Error('CSV contains headers but no data rows.'));
          return;
        }
        resolve(data);
      },
      error: () => reject(new Error('Failed to read the CSV file.'))
    });
  });
};

const CSVUploader = ({ onDataParsed, externalError, clearExternalError, onClose }) => {
  const [tempData, setTempData] = useState([]);
  const [localError, setLocalError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [lastUploadCount, setLastUploadCount] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef(null);

  // -------------------------
  // HELPERS
  // -------------------------
  const clearAllErrors = () => {
    setLocalError(null);
    if (clearExternalError) clearExternalError();
  };

  const resetState = () => {
    setTempData([]);
    setUploadSuccess(false);
    setLastUploadCount(0);
    clearAllErrors();
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const processFile = async (file) => {
    if (!file) return;
    clearAllErrors();

    if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
      setLocalError('Please upload a valid .csv file.');
      return;
    }

    setLoading(true);
    try {
      const parsed = await parseCSV(file);
      setTempData(parsed);
    } catch (err) {
      setLocalError(`Error parsing file: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // -------------------------
  // FILE INPUT
  // -------------------------
  const handleFileChange = (e) => processFile(e.target.files[0]);

  // -------------------------
  // DRAG AND DROP
  // -------------------------
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    processFile(e.dataTransfer.files[0]);
  };

  // -------------------------
  // UPLOAD TO DATABASE
  // -------------------------
  const handleUpload = async () => {
    if (tempData.length === 0) {
      setLocalError('No rows to upload. Please select a CSV file.');
      return;
    }

    setLoading(true);
    clearAllErrors();
    setUploadSuccess(false);

    try {
      const rowCount = tempData.length;
      await onDataParsed(tempData);
      setLastUploadCount(rowCount);
      setUploadSuccess(true);
      setTempData([]);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (err) {
      setUploadSuccess(false);
      setTempData([]);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } finally {
      setLoading(false);
    }
  };

  // -------------------------
  // RENDER: PREVIEW TABLE
  // -------------------------
  const renderPreviewTable = () => {
    const previewRows = tempData.slice(0, 10);
    const columns = Array.from(new Set(previewRows.flatMap(row => Object.keys(row))));
    if (columns.length === 0) return null;

    return (
      <div className="csv-preview-table-wrapper">
        <p className="csv-preview-text">
          Previewing <strong>{Math.min(10, tempData.length)}</strong> of <strong>{tempData.length}</strong> rows
        </p>
        <div className="csv-preview-table-scroll">
          <table className="csv-preview-table">
            <thead>
              <tr>
                {columns.map(col => <th key={col}>{col}</th>)}
              </tr>
            </thead>
            <tbody>
              {previewRows.map((row, idx) => (
                <tr key={idx}>
                  {columns.map(col => <td key={col}>{row[col] ?? ''}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  // -------------------------
  // RENDER
  // -------------------------
  return (
    <div className="csv-modal-overlay u-overlay u-flex-center" onClick={onClose}>
      <div
        className="csv-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >

        {/* HEADER */}
        <div className="csv-modal__header">
          <h3 className="csv-modal__title">Upload CSV</h3>
          <button className="modal-close-btn focus-ring--action" onClick={onClose} aria-label="Close">
            <X />
          </button>
        </div>

        {/* NOTIFICATIONS */}
        {uploadSuccess && !externalError && !localError && (
          <Alert
            type="success"
            message={`${lastUploadCount} asset${lastUploadCount !== 1 ? 's' : ''} successfully imported!`}
            onClose={() => { resetState(); onClose(); }}
          />
        )}

        {(localError || externalError) && (
          <Alert
            type="error"
            message={localError || externalError}
            onClose={clearAllErrors}
          />
        )}

        {/* STATE 1: DROP ZONE (no file selected yet) */}
        {tempData.length === 0 && !uploadSuccess && (
          <div
            className={`csv-drop-zone u-flex-col-center${isDragging ? ' csv-drop-zone--active' : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              type="file"
              ref={fileInputRef}
              className="csv-hidden-input"
              onChange={handleFileChange}
              accept=".csv"
            />

            <UploadCloud className="csv-drop-zone__icon" />
            <p className="csv-drop-zone__primary">
              {loading ? 'Parsing file...' : 'Drop your CSV here'}
            </p>
            <p className="csv-drop-zone__secondary">
              or <span className="csv-drop-zone__link">click to browse</span>
            </p>

            <div className="csv-drop-zone__hint">
              <FileText className="csv-drop-zone__hint-icon" />
              <span>Expected columns: asset_tag, serial_number, model, status, department, pr, po, notes</span>
            </div>
          </div>
        )}

        {/* STATE 2: PREVIEW */}
        {tempData.length > 0 && !uploadSuccess && (
          <div className="csv-preview-box">
            {renderPreviewTable()}
            <div className="csv-preview-actions">
              <button
                className="global-btn primary-btn focus-ring--action"
                onClick={handleUpload}
                disabled={loading}
              >
                {loading ? 'Uploading...' : 'Confirm & Upload'}
              </button>
              <button
                className="global-btn secondary-btn focus-ring--action"
                onClick={resetState}
                disabled={loading}
              >
                Choose Different File
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default CSVUploader;
