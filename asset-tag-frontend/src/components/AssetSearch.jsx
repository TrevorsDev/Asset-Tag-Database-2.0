// src/components/ColumnFilter.jsx

/* Accept props like column, type, options, onFilterChange
Render either a dropdown or a text input based on the type */

import React from 'react';

const ColumnFilter = ({ column, type, options = [], value, onChange }) => {
  return (
    <div className="column-filter">
      {type === 'dropdown' ? (
        <select value={value} onChange={(e) => onChange(column, e.target.value)}>
          <option value="">All</option>
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      ) : (
        <input
          type="text"
          placeholder={`Search ${column}`}
          value={value}
          onChange={(e) => onChange(column, e.target.value)}
        />
      )}
    </div>
  );
};

export default ColumnFilter;
