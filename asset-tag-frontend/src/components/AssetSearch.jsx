// src/components/ColumnFilter.jsx

/* Accept props like column, type, options, onFilterChange
Render either a dropdown or a text input based on the type */

import React from 'react';

const ColumnFilter = ({ type, value, onChange, options = [], placeholder }) => {
  if (type === 'dropdown') {
    return (
      <select value={value} onChange={ (e) => onChange(e.target.value)}>
        <option value="">All</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    );
  }

  return (
    <input
      type="text"
      value={value}
      onChange={ (e) => onChange(e.target.value) }
      placehoder={placeholder}
    />
  );
};


export default ColumnFilter;
