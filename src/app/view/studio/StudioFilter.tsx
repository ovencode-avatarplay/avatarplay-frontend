import React from 'react';
import {Box, Select, MenuItem, Button} from '@mui/material';
import styles from './StudioFilter.module.css';

interface FilterOption {
  value: string;
  label: string;
}

interface FilterSectionProps {
  filters: FilterOption[];
  selectedFilter: string;
  onFilterChange: (value: string) => void;
  onCreateClick: () => void;
}

const StudioFilter: React.FC<FilterSectionProps> = ({filters, selectedFilter, onFilterChange, onCreateClick}) => {
  return (
    <Box className={styles.filterContainer}>
      <Select value={selectedFilter} onChange={e => onFilterChange(e.target.value)} className={styles.filterSelect}>
        {filters.map(filter => (
          <MenuItem key={filter.value} value={filter.value}>
            {filter.label}
          </MenuItem>
        ))}
      </Select>

      {/* Create Button */}
      <Button variant="contained" className={styles.createButton} onClick={onCreateClick}>
        Create
      </Button>
    </Box>
  );
};

export default StudioFilter;
