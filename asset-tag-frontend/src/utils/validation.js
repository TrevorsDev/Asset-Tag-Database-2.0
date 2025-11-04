// validation.js

// Validates asset form data
export function validateAssetForm(data) {
    const errors = {};
  
    if (!data.asset_tag.trim()) {
      errors.asset_tag = 'Asset Tag is required.';
    }
  
    if (!data.serial_number.trim()) {
      errors.serial_number = 'Serial Number is required.';
    }
  
    if (!data.model.trim()) {
      errors.model = 'Model is required.';
    }
  
    if (!data.status.trim()) {
      errors.status = 'Status is required.';
    }
  
    if (!data.department.trim()) {
      errors.department = 'Department is required.';
    }
  
    if (!data.pr.trim()) {
      errors.pr = 'Purchase Request is required.';
    }
  
    if (!data.po.trim()) {
      errors.po = 'Purchase Order is required.';
    }
  
    return errors;
  }
  