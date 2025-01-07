import React, {useEffect, useState} from 'react';

// Icons
import styles from './SearchBoardHeader.module.css';

import ToggleButton from '@/components/layout/shared/ToggleButton';
import {BoldFilter, BoldFilterOn} from '@ui/Icons';
import ExploreSearchInput from './ExploreSearchInput';
import {ExploreItem, PaginationRequest, sendSearchExplore} from '@/app/NetWork/ExploreNetwork';
import FilterSelector, {FilterDataItem} from '@/components/create/FilterSelector';

interface Props {
  setSearchResultList: React.Dispatch<React.SetStateAction<ExploreItem[] | null>>;
  adultToggleOn: boolean;
  setAdultToggleOn: React.Dispatch<React.SetStateAction<boolean>>;
  searchValue: string;
  setSearchValue: React.Dispatch<React.SetStateAction<string>>;
  filterData: string[] | null;
  fetchExploreData: (
    searchValue: string,
    adultToggleOn: boolean,
    filterString: string,
    contentPage: PaginationRequest,
    characterPage: PaginationRequest,
  ) => void;
  setSearchOffset: React.Dispatch<React.SetStateAction<number>>;
}

const SearchBoardHeader: React.FC<Props> = ({
  setSearchResultList,
  adultToggleOn,
  setAdultToggleOn,
  searchValue,
  setSearchValue,
  filterData,
  fetchExploreData,
  setSearchOffset,
}) => {
  const [filterDialogOn, setFilterDialogOn] = useState(false);
  const [filterOn, setFilterOn] = useState(false);
  const [filterItem, setFilterItem] = useState<FilterDataItem[]>([]);
  const [positiveFilters, setPositiveFilters] = useState<FilterDataItem[]>([]);

  const handleAdultToggleClicked = () => {
    setAdultToggleOn(!adultToggleOn);
  };

  const handleFilterButtonClicked = () => {
    setFilterDialogOn(!filterDialogOn);
  };

  const handleSearch = () => {
    const filterString = positiveFilters.map(filter => filter.name).join(',');
    setSearchOffset(0);
    fetchExploreData(searchValue, adultToggleOn, filterString, {offset: 0, limit: 20}, {offset: 0, limit: 20});
  };

  const handleSave = (selectedFilters: FilterDataItem[]) => {
    setPositiveFilters(selectedFilters);
  };

  useEffect(() => {
    if (filterData) {
      // filterData(string[])를 FilterDataItem[]로 변환
      const items = filterData.map(name => ({name}));
      setFilterItem(items);
    }
  }, [filterData]);

  return (
    <div className={styles.searchHeaderContainer}>
      <div className={styles.searchHeader}>
        <div className={styles.ageRateArea}>
          <ToggleButton
            isToggled={adultToggleOn}
            onToggle={handleAdultToggleClicked}
            size="sm"
            state="default"
            theme="dark"
          />
          <div className={`${styles.rateText} ${adultToggleOn ? styles.toggleOn : ''}`}>Adult</div>
        </div>
        <ExploreSearchInput
          value={searchValue}
          onChange={e => setSearchValue(e.target.value)}
          onSearch={handleSearch}
        />
        <button className={styles.filterButton} onClick={handleFilterButtonClicked}>
          <img className={styles.filterIcon} src={positiveFilters.length > 0 ? BoldFilterOn.src : BoldFilter.src} />
        </button>
      </div>

      <FilterSelector
        filterData={filterItem}
        onSave={handleSave}
        open={filterDialogOn}
        onClose={() => setFilterDialogOn(false)}
      />
    </div>
  );
};

export default SearchBoardHeader;
