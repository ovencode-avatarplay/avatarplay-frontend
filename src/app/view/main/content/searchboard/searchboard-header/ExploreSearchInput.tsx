import React from 'react';
import TextField from '@mui/material/TextField';
import SearchIcon from '@mui/icons-material/Search';

import styles from './ExploreSearchInput.module.css';
import {LineSearch} from '@ui/Icons';

const ExploreSearchInput: React.FC = () => {
  return (
    <TextField
      placeholder="Search..."
      variant="outlined"
      inputProps={{'aria-label': 'search'}}
      className={styles.searchInput}
      InputProps={{
        startAdornment: <img className={styles.searchIcon} src={LineSearch.src} />,
      }}
    />
  );
};

export default ExploreSearchInput;
