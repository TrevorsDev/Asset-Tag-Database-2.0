import React from 'react';

const FiltersBar = ({ filters, onFilterChange, statusOptions, departmentOptions }) => {
    return (
        <div className="filters-bar"> 
            <select
                value={filters.status}
                onChange={(e) => onFilterChange('status', e.target.value)}
            >
                <option value="">All</option>
                {statusOptions.map((option) => (
                    <option key={option} value={option}>{option}</option>
                ))}
            </select>

            <select 
                value={filters.department}
                onChange={(e) => onFilterChange('department', e.target.value)}
            >
                <option value
            </select>
                </div>
    )
}