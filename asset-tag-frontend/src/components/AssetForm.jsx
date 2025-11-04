/* AssetForm.jsx - This component displays a form for adding a new asset to the database.

- It manages the form's internal state (what the user types into each field)
- It performs basic validation (e.g., required fields must be filled)
- If validation passes, it calls the `onSubmit()` function passed from the parent (App.jsx)
- The parent component handles sending the data to Supabase
- If submission is successful, the form resets; otherwise, an error message is shown
*/



import React, { useState } from 'react';

function AssetForm({ onSubmit }) {
  const [formData, setFormData] = useState({
    asset_tag: '',
    serial_number: '',
    model: '',
    status: '',
    department: '',
    pr: '',
    po: ''
  });

  const [error, setError] = useState();

  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' })); // Clear error on change
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Stops the form from reloading the page

    // Basic validation
    const validationErrors = validateAssetForm(formData);
    if (Object.keys(validationErrors).length > 0) {
    setErrors(validationErrors);
    return;
    }


    const success = await onSubmit(formData);

    if (success) {
      setFormData({
        asset_tag: '',
        serial_number: '',
        model: '',
        status: '',
        department: '',
        pr: '',
        po: ''
      });    
      setErrors({});
    } else {
      setErrors({ form: 'Failed to add asset. Please try again.' });
}

  };

  
return (
    <div>
      <h2>Add New Asset</h2>
      {errors.form && <p style={{ color: 'red' }}>{errors.form}</p>}
      <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
        <input type="text" placeholder="Asset Tag" value={formData.asset_tag} onChange={(e) => updateField('asset_tag', e.target.value)} />
        {errors.asset_tag && <p style={{ color: 'red' }}>{errors.asset_tag}</p>}

        <input type="text" placeholder="Serial Number" value={formData.serial_number} onChange={(e) => updateField('serial_number', e.target.value)} />
        {errors.serial_number && <p style={{ color: 'red' }}>{errors.serial_number}</p>}

        <input type="text" placeholder="Model" value={formData.model} onChange={(e) => updateField('model', e.target.value)} />
        {errors.model && <p style={{ color: 'red' }}>{errors.model}</p>}

        <input type="text" placeholder="Status" value={formData.status} onChange={(e) => updateField('status', e.target.value)} />
        {errors.status && <p style={{ color: 'red' }}>{errors.status}</p>}

        <input type="text" placeholder="Department" value={formData.department} onChange={(e) => updateField('department', e.target.value)} />
        {errors.department && <p style={{ color: 'red' }}>{errors.department}</p>}

        <input type="text" placeholder="Purchase Request" value={formData.pr} onChange={(e) => updateField('pr', e.target.value)} />
        {errors.pr && <p style={{ color: 'red' }}>{errors.pr}</p>}

        <input type="text" placeholder="Purchase Order" value={formData.po} onChange={(e) => updateField('po', e.target.value)} />
        {errors.po && <p style={{ color: 'red' }}>{errors.po}</p>}

        <button type="submit">Add Asset</button>
      </form>
    </div>

  );
}

export default AssetForm;
