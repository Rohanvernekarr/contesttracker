import React from 'react';

const FilterComponent = ({ filters, onFilterChange }) => {
  const platforms = ['Codeforces', 'CodeChef', 'LeetCode'];
  const statuses = ['upcoming', 'ongoing', 'past'];
  
  const handlePlatformChange = (platform) => {
    const newPlatforms = filters.platform.includes(platform)
      ? filters.platform.filter(p => p !== platform)
      : [...filters.platform, platform];
    
    onFilterChange({
      ...filters,
      platform: newPlatforms
    });
  };
  
  const handleStatusChange = (status) => {
    onFilterChange({
      ...filters,
      status
    });
  };
  
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">Platforms</h3>
        <div className="flex flex-wrap gap-2">
          {platforms.map(platform => (
            <button
              key={platform}
              onClick={() => handlePlatformChange(platform)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200
                ${filters.platform.includes(platform)
                  ? 'bg-primary text-white hover:bg-primary/90'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                }`}
            >
              {platform}
            </button>
          ))}
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">Status</h3>
        <div className="flex flex-wrap gap-2">
          {statuses.map(status => (
            <button
              key={status}
              onClick={() => handleStatusChange(status)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200
                ${filters.status === status
                  ? 'bg-primary text-white hover:bg-primary/90'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FilterComponent;