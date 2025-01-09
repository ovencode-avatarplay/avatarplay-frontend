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
  positiveFilter: FilterDataItem[];
  setPositiveFilter: React.Dispatch<React.SetStateAction<FilterDataItem[]>>;
  negativeFilter: FilterDataItem[];
  setNegativeFilter: React.Dispatch<React.SetStateAction<FilterDataItem[]>>;
  fetchExploreData: (
    searchValue: string,
    adultToggleOn: boolean,
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
  positiveFilter,
  setPositiveFilter,
  negativeFilter,
  setNegativeFilter,
  fetchExploreData,
  setSearchOffset,
}) => {
  const [filterDialogOn, setFilterDialogOn] = useState(false);
  const [filterItem, setFilterItem] = useState<FilterDataItem[]>([]);

  const handleAdultToggleClicked = () => {
    setAdultToggleOn(!adultToggleOn);
  };

  const handleFilterButtonClicked = () => {
    setFilterDialogOn(!filterDialogOn);
  };

  const handleSearch = () => {
    setSearchOffset(0);
    fetchExploreData(searchValue, adultToggleOn, {offset: 0, limit: 20}, {offset: 0, limit: 20});
  };

  const handleSave = (filters: {positive: FilterDataItem[]; negative: FilterDataItem[]}) => {
    setPositiveFilter(filters.positive);
    setNegativeFilter(filters.negative);

    setFilterItem(prevFilterItem =>
      prevFilterItem.map(item => {
        if (filters.positive.some(filter => filter.name === item.name)) {
          return {...item, state: 'selected'};
        }
        if (filters.negative.some(filter => filter.name === item.name)) {
          return {...item, state: 'remove'};
        }
        return {...item, state: 'empty'};
      }),
    );
  };

  useEffect(() => {
    if (filterData) {
      const items = filterData.map(name => ({
        name,
        state: 'empty', // 초기 상태 설정
      }));
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
          <img
            className={styles.filterIcon}
            src={positiveFilter.length > 0 || negativeFilter.length > 0 ? BoldFilterOn.src : BoldFilter.src}
          />
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
