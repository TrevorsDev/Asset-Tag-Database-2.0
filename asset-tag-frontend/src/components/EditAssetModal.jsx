// File to handle updating data only

import React, { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';
import '../App.css'
import './editModal.css';

/**
 * COMPONENT: EditAssetModal
 * Purpose: Provides an overlay form to update existing asset details.
 * Pattern: Controlled Component (React manages the form state).
 */

const EditAssetModal = ({ asset, isOpen, onClose, onSave }) => {
    //1. LOCAL STATE: We copy the asset data into local state.
    // This allows the user to type without immediately changing the main table data.
    const [formData, setFormData] =useState({ ...asset });

    // 2. SYNC STATE: If the 'asset' prop changes (user clicks a different row), 
    // we update our local form state.
    useEffect(() => {
        setFormData({ ...asset });
    }, [asset]);

    // 3. ACCESSIBILITY: Listen for the "Escape" key to close the modal. Also want to include a clickEvent() for when clicked outside of modal.
    useEffect(() => {
        const handleEsc = (e) => { if (e.key === 'Escape') onClose(); };
        window.addEventListener('keydown', handleEsc);
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
        onSave(asset.id, formData); // Sends the data back to the Parent (AssetTable)
    };

    return (
        <div className = "modal-overlay" onClick = { onClose }>
            {/* onClick = {onClose} on the overlay allows clicking "outside" to close. stopPropagation on the modal-content prevents clicking the form from closing it. */}
            <div className = "modal-content" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
                <div className = "modal-header">
                    <h3>Edit Asset: {asset.asset_tag}</h3>
                    <button className=" global-btn secondary-btn close-x" onClick={onClose} aria-label="Close">
                        <X/>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="modal-form">

                    <div className="form-grid">
                        {/* We map through keys to keep the code DRY */}
                        {['model', 'serial_number', 'status', 'department', 'pr', 'po'].map((field) =>(
                            <div classname="form-group" key={field}>
                                <label htmlFor={field}>{field.replace('_', ' ').toUpperCase()}</label>
                                <input 
                                    id={field}
                                    name={field}
                                    value={formData[field] || ''}
                                    onChange={handleChange}
                                    autoComplete="off" 
                                />
                            </div>
                        ))}
                    </div>

                    <div className="modal-actions">
                        <button type="button" className="global-btn secondary-btn" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className="global-btn primary-btn">
                            <Check/> Save Changes
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default EditAssetModal;