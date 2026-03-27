import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { validateAssetForm } from '../utils/validation';
import '../App.css'
import './AssetModal.css';

/**
 * COMPONENT: AssetModal
 * Purpose: Overlay form for adding a new asset or editing an existing one.
 * Pattern: Controlled Component (React manages the form state).
 */

const getErrorMessage = (errorText) => {
    if (!errorText) return null;

    // Dictionary of database constraints to human labels
    const errorMapping = {
        'unique_asset_tag': 'This Asset Tag is already in use. Please enter a unique identifier.',
        'unique_serial_number': 'This Serial Number is already registered in the system.'
    };

    const key = Object.keys(errorMapping).find(k => errorText.includes(k));
    return key ? errorMapping[key] : errorText;
};

const AssetModal = ({ asset, isOpen, onClose, onSave, error, assets = [] }) => {
    // 1. LOCAL STATE: Copy asset data into local form state so edits don't
    //    immediately affect the table behind the modal.
    const [formData, setFormData] = useState({ ...asset });
    const [fieldErrors, setFieldErrors] = useState({});
    const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);

    // 2. SYNC STATE: If the asset prop changes (different row opened),
    //    reset form data, validation errors, and submit attempt flag.
    useEffect(() => {
        setFormData({ ...asset });
        setFieldErrors({});
        setHasAttemptedSubmit(false);
    }, [asset]);

    // 3. ACCESSIBILITY: Escape key closes the modal.
    useEffect(() => {
        const handleEsc = (e) => { if (e.key === 'Escape') onClose(); };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    if (!isOpen) return null;

    // 4. HANDLERS
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        // Clear the error for this field as soon as the user starts typing
        if (fieldErrors[name]) {
            setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
        }
    };

    const handleBlur = (e) => {
        if (!hasAttemptedSubmit) return;
        const { name } = e.target;
        // Re-validate only this field and update its error state
        const errors = validateAssetForm(formData);
        setFieldErrors((prev) => ({ ...prev, [name]: errors[name] }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // 1. SANITIZE: Trim all string values
        const cleanedData = Object.keys(formData).reduce((acc, key) => {
            const value = formData[key];
            acc[key] = typeof value === 'string' ? value.trim() : value;
            return acc;
        }, {});

        // 2. VALIDATE: Returns an object of field-level errors, empty if valid
        const errors = validateAssetForm(cleanedData);

        if (Object.keys(errors).length > 0) {
            setHasAttemptedSubmit(true);
            setFieldErrors(errors);
            return;
        }

        // 3. DUPLICATE CHECK: Client-side pre-flight against existing assets
        const currentId = asset.id || asset.ID;
        const conflicts = {};

        const tagConflict = assets.find(a => a.asset_tag === cleanedData.asset_tag && a.id !== currentId);
        if (tagConflict) conflicts.asset_tag = `Already assigned to serial ${tagConflict.serial_number}`;

        const serialConflict = assets.find(a => a.serial_number === cleanedData.serial_number && a.id !== currentId);
        if (serialConflict) conflicts.serial_number = `Already assigned to ${serialConflict.asset_tag}`;

        if (Object.keys(conflicts).length > 0) {
            setHasAttemptedSubmit(true);
            setFieldErrors(conflicts);
            return;
        }

        // 4. SAVE: Only reached if validation and duplicate check pass
        onSave(currentId, cleanedData);
    };

    const friendlyError = getErrorMessage(error);

    return (
        <div className="asset-modal__overlay u-overlay u-flex-center" onClick={onClose}>
            <div
                className="asset-modal__container"
                onClick={(e) => e.stopPropagation()}
                role="dialog"
                aria-modal="true"
            >
                <div className="asset-modal__header">
                    <h3 className="asset-modal__title">
                        {asset.id ? `Edit Asset: ${asset.asset_tag}` : 'Add Asset'}
                    </h3>
                    <button className="modal-close-btn focus-ring--action" onClick={onClose} aria-label="Close">
                        <X />
                    </button>
                </div>

                {/* DATABASE ERROR BANNER (e.g. duplicate asset tag or serial number) */}
                {friendlyError && (
                    <div className="asset-modal__error-banner">
                        <span className="asset-modal__error-icon">⚠️</span>
                        <p className="asset-modal__error-text">{friendlyError}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="asset-modal__form">
                    <div className="asset-modal__grid">
                        {['asset_tag', 'serial_number', 'model', 'status', 'department', 'pr', 'po', 'notes'].map((field) => (
                            <div className="asset-modal__group" key={field}>
                                <label className="asset-modal__label" htmlFor={field}>
                                    {field.replace('_', ' ').toUpperCase()}
                                </label>
                                {field === 'notes' ? (
                                    <textarea
                                        className={`asset-modal__input${fieldErrors[field] ? ' asset-modal__input--error' : ''}`}
                                        id={field}
                                        name={field}
                                        value={formData[field] || ''}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        autoComplete="off"
                                        rows={3}
                                    />
                                ) : field === 'status' ? (
                                    <div className={`asset-modal__status-picker${fieldErrors[field] ? ' asset-modal__status-picker--error' : ''}`}>
                                        {['active', 'inactive', 'retired'].map((option) => (
                                            <button
                                                key={option}
                                                type="button"
                                                className={`status-pill status-pill--${option}${formData.status === option ? ' status-pill--selected' : ''}`}
                                                onClick={() => handleChange({ target: { name: 'status', value: option } })}
                                            >
                                                {option.charAt(0).toUpperCase() + option.slice(1)}
                                            </button>
                                        ))}
                                    </div>
                                ) : (
                                    <input
                                        className={`asset-modal__input${fieldErrors[field] ? ' asset-modal__input--error' : ''}`}
                                        id={field}
                                        name={field}
                                        value={formData[field] || ''}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        autoComplete="off"
                                    />
                                )}
                                {fieldErrors[field] && (
                                    <p className="asset-modal__field-error">{fieldErrors[field]}</p>
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="asset-modal__actions">
                        <button type="submit" className="global-btn primary-btn focus-ring--action">
                            {asset.id ? 'Save Changes' : 'Add Asset'}
                        </button>
                        <button type="button" className="global-btn secondary-btn focus-ring--action" onClick={onClose}>
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AssetModal;
