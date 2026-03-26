// validation.js
// Validates asset form data. Returns an object of field-level error messages.
// Only required fields are validated — pr, po, and notes are intentionally optional.

export function validateAssetForm(data) {
    const errors = {};

    if (!data.asset_tag || !data.asset_tag.trim()) {
        errors.asset_tag = 'Asset Tag is required.';
    }

    if (!data.serial_number || !data.serial_number.trim()) {
        errors.serial_number = 'Serial Number is required.';
    }

    if (!data.model || !data.model.trim()) {
        errors.model = 'Model is required.';
    }

    if (!data.status || !data.status.trim()) {
        errors.status = 'Status is required.';
    }

    if (!data.department || !data.department.trim()) {
        errors.department = 'Department is required.';
    }

    return errors;
}
