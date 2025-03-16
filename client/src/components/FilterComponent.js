import React from 'react';
import './FilterComponent.css';

const FilterComponent = ({ filters, onFilterChange }) => {
  const platforms = ['Codeforces', 'CodeChef', 'LeetCode'];
  const statuses = ['upcoming', 'ongoing', 'past'];
  
  const handlePlatformChange = (platform) => {
    let updatedPlatforms;
    
    if (filters.platform.includes(platform)) {
      // Remove platform if already selected
      updatedPlatforms = filters.platform.filter(p => p !== platform);
      // Ensure at least one platform is selected
      if (updatedPlatforms.length === 0) {
        return;
      }
    } else {
      // Add platform if not selected
      updatedPlatforms = [...filters.platform, platform];
    }
    
    onFilterChange({
      ...filters,
      platform: updatedPlatforms
    });
  };
  
  const handleStatusChange = (status) => {
    onFilterChange({
      ...filters,
      status
    });
  };
  
  return (
    <div className="filter-container">
      <div className="filter-section">
        <h3>Platforms</h3>
        <div className="platform-filters">
          {platforms.map(platform => (
            <label key={platform} className="platform-filter">
              <input
                type="checkbox"
                checked={filters.platform.includes(platform)}
                onChange={() => handlePlatformChange(platform)}
              />
              {platform}
            </label>
          ))}
        </div>
      </div>
      
      <div className="filter-section">
        <h3>Status</h3>
        <div className="status-filters">
          {statuses.map(status => (
            <label key={status} className="status-filter">
              <input
                type="radio"
                name="status"
                checked={filters.status === status}
                onChange={() => handleStatusChange(status)}
              />
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FilterComponent;