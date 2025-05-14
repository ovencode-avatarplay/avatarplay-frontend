import React, {useState} from 'react';
import styles from './FilterBar.module.css';
import {BoldViewGallery, LineArrowDown} from '@ui/Icons';
import {CharacterIP} from '@/app/NetWork/CharacterNetwork';

interface FilterBarProps {
  filters: string[]; // 예: ['Original', 'Fan']
  sortOptions: string[]; // 예: ['Newest', 'Oldest']
  onFilterChange?: (selected: string) => void;
  onSortChange?: (selected: string) => void;
}

const FilterBar: React.FC<FilterBarProps> = ({filters, sortOptions, onFilterChange, onSortChange}) => {
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [selectedSort, setSelectedSort] = useState<string>(sortOptions[0]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleFilterClick = (filter: string) => {
    setActiveFilter(filter);
    onFilterChange?.(filter);
  };

  const handleSortClick = (option: string) => {
    setSelectedSort(option);
    onSortChange?.(option);
    setIsDropdownOpen(false);
  };

  return (
    <div className={styles.container}>
      {/* 아이콘 버튼 (전체 보기) */}
      <div
        className={`${styles.iconButton} ${activeFilter == CharacterIP.None.toString() ? styles.active : ''}`}
        onClick={() => handleFilterClick(CharacterIP.None.toString())}
      >
        <img src={BoldViewGallery.src} alt="Gallery" className={styles.galleryIcon} />
      </div>

      {/* 필터 버튼들 */}
      <div className={styles.filterButtons}>
        {filters.map(filter => (
          <button
            key={filter}
            className={`${styles.filterButton} ${activeFilter === filter ? styles.selected : ''}`}
            onClick={() => handleFilterClick(filter)}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* 정렬 드롭다운 */}
      <div className={styles.sortDropdown} onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
        <span className={styles.sortLabel}>{selectedSort}</span>
        <img src={LineArrowDown.src} alt="arrow" className={styles.sortIcon} />
        {isDropdownOpen && (
          <div className={styles.sortMenu}>
            {sortOptions.map(option => (
              <div key={option} className={styles.sortOption} onClick={() => handleSortClick(option)}>
                {option}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FilterBar;
