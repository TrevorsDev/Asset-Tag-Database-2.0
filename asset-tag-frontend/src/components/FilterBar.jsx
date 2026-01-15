// FiltersBar handles UI for filters.
/* This code is a React functional component written in JavaScript. It represents a FiltersBar component that renders a series of individual ColumnFilter components to create an interactive filtering interface. */
// import React from 'react';
// import ColumnFilter from './AssetSearch';

// Below uses a Configuration Array

import React from 'react';
import ColumnFilter from './AssetSearch';

const FiltersBar = ({ filters, onFilterChange, statusOptions, departmentOptions }) => {
  const filterConfig = [
    { key: 'asset_tag', type: 'text', placeholder: 'Asset Tag' },
    { key: 'serial_number', type: 'text', placeholder: 'Serial Number' },
    { key: 'model', type: 'text', placeholder: 'Model' },
    { key: 'status', type: 'dropdown', options: departmentOptions },
    { key: 'department', type: 'dropdown', options: departmentOptions },
    { key: 'pr', type: 'text', placeholder: 'PR' },
    { key: 'po', type: 'text', placeholder: 'po' }
  ];

  return (
    <div className = "filters-bar">
      {filterConfig.map(({ key, type, options, placeholder }) => (
        <ColumnFilter
          key={key}
          type={type}
          value={filters[key]}
          onChange={(val) => onFilterChange(key, val)}
          options={options}
          placeholder={placeholder}
        />
      ))}
    </div>
  );
};

export default FiltersBar;
