// File to handle updating data only

import React, { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';
import '../App.css'
import './AssetModal.css';

/**
 * COMPONENT: EditAssetModal
 * Purpose: Provides an overlay form to update existing asset details.
 * Pattern: Controlled Component (React manages the form state).
 */

const getErrorMessage = (errorText) => {
    if (!errorText) return null;

    // Dictionary of database constraints to human labels
    const errorMapping = {
        'unique_asset_tag': 'This Asset Tag is already in use. Please enter a unique identifier.',
        'unique_serial_number': 'This Serial Number is already registered in the system.'
    };

    // Find if any of our keys exist inside the raw error string
    const key = Object.keys(errorMapping).find(k => errorText.includes(k));
    return key ? errorMapping[key] : errorText;
};

const AssetModal = ({ asset, isOpen, onClose, onSave, error }) => {
    //1. LOCAL STATE: We copy the asset data into local state.
    // This allows the user to type without immediately changing the main table data.
    console.log("REAL TIME MODAL DATA:", asset);
    const [formData, setFormData] = useState({ ...asset });

    // 2. SYNC STATE: If the 'asset' prop changes (user clicks a different row), 
    // we update our local form state.
    useEffect(() => {
        setFormData({ ...asset });
    }, [asset]);

    // 3. ACCESSIBILITY: Listen for the "Escape" key to close the modal. Also want to include a clickEvent() for when clicked outside of modal.
    useEffect(() => {
        const handleEsc = (e) => { if (e.key === 'Escape') onClose(); };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    // If the modal isn't suppost to be open, render nothing.
    if (!isOpen) return null;

    //4. HANDLERS
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault(); // Prevents the browser from reloading the page
        // 'asset' is the prop passed from the parent containing the original data

        // 1. DATA SANITIZATION (The "Cleaning Station")
        // We use .reduce to create a new object (cleanedData)
        // where every string value has its whitespace stripped.
        const cleanedData = Object.keys(formData).reduce((acc, key) => {
            const value = formData[key];
            acc[key] = typeof value === 'string' ? value.trim() : value;
            return acc;
        }, {});

        onSave(asset.id, cleanedData); // triggers addAsset() in Add mode and updateAsset() in Edit mode

        // 2. VALIDATION: Define which fields MUST be filled (Professional Standard)
        // We don't check 'po' or 'pr' because they might be empty in real life
        const requiredFields = ['asset_tag', 'serial_number', 'model', 'status', 'department'];

        const emptyRequiredFields = requiredFields.filter(key => {
            const value = cleanedData[key];
            // Now if a user entered "  ", its been trimmed to "" and will be caught here
            return !value || (typeof value === 'string' && value.trim() === "");
        });

        if (emptyRequiredFields.length > 0) {
            const fieldNames = emptyRequiredFields.map(f => f.replace('_', ' ')).join(', ');
            alert(`Required fields missing: ${fieldNames}`);
            return; // STOPS the function
        }

        // 3. EXECUTION: Identify the row
        const actualId = asset.id || asset.ID;

        // We pass cleanedData to the parent, NOT the raw formData
        if (actualId) {
            onSave(actualId, cleanedData);
        }
    };


    const friendlyError = getErrorMessage(error); // 'error' is the prop from AssetTable

    return (
        <div className="asset-modal__overlay" onClick={onClose}>
            {/* onClick = {onClose} on the overlay allows clicking "outside" to close. stopPropagation on the modal-content prevents clicking the form from closing it. */}
            <div
                className="asset-modal__container"
                onClick={(e) => e.stopPropagation()}
                role="dialog"
                aria-modal="true"
            >
                <div className="asset-modal__header">
                    <h3 className="asset-modal__title">Edit Asset: {asset.asset_tag}</h3>
                    <button className="icon-button" onClick={onClose} aria-label="Close">
                        <X />
                    </button>
                </div>

                {/* EDIT ERROR BANNER */}
                {friendlyError && (
                    <div className="asset-modal__error-banner">
                        <span className="asset-modal__error-icon">⚠️</span>
                        <p className="asset-modal__error-text">{friendlyError}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="asset-modal__form">

                    <div className="asset-modal__grid">
                        {/* We map through keys to keep the code DRY */}
                        {['asset_tag', 'serial_number', 'model', 'status', 'department', 'pr', 'po', 'notes'].map((field) => (
                            <div className="asset-modal__group" key={field}>
                                <label className="asset-modal__label" htmlFor={field}>{field.replace('_', ' ').toUpperCase()}
                                </label>
                                <input
                                    className="asset-modal__input"
                                    id={field}
                                    name={field}
                                    value={formData[field] || ''}
                                    onChange={handleChange}
                                    autoComplete="off"
                                />
                            </div>
                        ))}
                    </div>

                    <div className="asset-modal__actions">
                        <button type="submit" className="global-btn primary-btn">
                            Save Changes
                        </button>

                        <button type="button" className="global-btn secondary-btn" onClick={onClose}>
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AssetModal;