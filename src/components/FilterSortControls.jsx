import React from 'react';

function FilterSortControls({
  filterPriority,
  sortBy,
  sortOrder,
  onFilterChange,
  onSortByChange,
  onSortOrderChange,
  disabled
}) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 p-3 bg-gray-50 rounded border border-gray-200 items-center">
      {/* Filter by Priority */}
      <div className="flex items-center gap-2 w-full sm:w-auto">
        <label htmlFor="filterPriority" className="text-sm font-medium text-gray-600 whitespace-nowrap">Filter by Priority:</label>
        <select
          id="filterPriority"
          name="filterPriority"
          value={filterPriority}
          onChange={onFilterChange}
          disabled={disabled}
          className="block w-full sm:w-auto border border-gray-300 px-3 py-1.5 rounded bg-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <option value="all">All</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </div>

      {/* Sort By */}
      <div className="flex items-center gap-2 w-full sm:w-auto">
        <label htmlFor="sortBy" className="text-sm font-medium text-gray-600 whitespace-nowrap">Sort by:</label>
        <select
          id="sortBy"
          name="sortBy"
          value={sortBy}
          onChange={onSortByChange}
          disabled={disabled}
          className="block w-full sm:w-auto border border-gray-300 px-3 py-1.5 rounded bg-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <option value="createdAt">Date Created</option>
          <option value="priority">Priority</option>
          {/* Add more sort options here later (e.g., title) */}
        </select>
      </div>

      {/* Sort Order Toggle Button */}
      <button
        onClick={onSortOrderChange}
        disabled={disabled}
        title={`Sort Direction: ${sortOrder === 'ASC' ? 'Ascending' : 'Descending'}`}
        className="p-1.5 border border-gray-300 rounded bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <i className={`fas ${sortOrder === 'ASC' ? 'fa-arrow-up-short-wide' : 'fa-arrow-down-wide-short'} text-gray-600`}></i>
        <span className="sr-only">{sortOrder === 'ASC' ? 'Ascending' : 'Descending'}</span>
      </button>

    </div>
  );
}

export default FilterSortControls;