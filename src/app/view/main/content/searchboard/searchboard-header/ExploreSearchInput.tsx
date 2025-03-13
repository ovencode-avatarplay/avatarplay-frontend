import React from 'react';
import styles from './ExploreSearchInput.module.css';
import {LineSearch} from '@ui/Icons';

type ExploreSearchInputProps = {
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSearch?: () => void;
  disabled?: boolean;
  maxLength?: number;
};

const ExploreSearchInput: React.FC<ExploreSearchInputProps> = ({
  placeholder = 'Search',
  value,
  onChange,
  onSearch,
  disabled = false,
  maxLength,
}) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && onSearch) {
      onSearch();
    }
  };

  return (
    <div className={styles.searchInputContainer}>
      <div className={styles.iconContainer}>
        <img className={styles.searchIcon} src={LineSearch.src} alt="Search" />
      </div>
      <input
        type="text"
        className={`${styles.searchInput} ${value !== '' ? styles.textExist : ''}`}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        maxLength={maxLength}
      />
      {onSearch && <button className={styles.searchButton} onClick={onSearch} disabled={disabled}></button>}
    </div>
  );
};

export default ExploreSearchInput;
