import React from 'react';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';

const SearchComponent: React.FC = () => {
  return (
    <TextField
      placeholder="Search..."
      variant="outlined"
      inputProps={{'aria-label': 'search'}}
      className="search-input"
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon />
          </InputAdornment>
        ),
      }}
    />
  );
};

export default SearchComponent;
