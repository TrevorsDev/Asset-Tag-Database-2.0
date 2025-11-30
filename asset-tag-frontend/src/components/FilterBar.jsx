import React from 'react';
import ColumnFilter from './AssetSearch';

const FiltersBar = ({ filters, onFilterChange, statusOptions, departmentOptions }) => {
  return (
    <div className="filters-bar">
        <ColumnFilter
          type="text"
          value={filters.asset_tag}
          onChange={(val) => onFilterChange('asset_tag', val)}
          placeholder="Asset Tag"
        />
        <ColumnFilter
          type="text"
          value={filters.serial_number}
          onChange={(val) => onFilterChange('serial_number', val)}
          placeholder="Serial Number"
        />
        <ColumnFilter
          type="text"
          value={filters.model}
          onChange={(val) => onFilterChange('model', val)}
          placeholder="Model"
        />
      <ColumnFilter
        type="dropdown"
        value={filters.status}
        onChange={(val) => onFilterChange('status', val)}
        options={statusOptions}
      />
      <ColumnFilter
        type="dropdown"
        value={filters.department}
        onChange={(val) => onFilterChange('department', val)}
        options={departmentOptions}
      />
      <ColumnFilter
        type="text"
        value={filters.pr}
        onChange={(val) => onFilterChange('pr', val)}
        placeholder="Purchase Request"
      />
      <ColumnFilter
        type="text"
        value={filters.po}
        onChange={(val) => onFilterChange('po', val)}
        placeholder="Purchase Order"
      />
    </div>
  );
};

export default FiltersBar;
