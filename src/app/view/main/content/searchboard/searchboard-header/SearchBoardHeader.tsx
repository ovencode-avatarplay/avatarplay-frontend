import React, {useEffect, useState} from 'react';

// Icons
import styles from './SearchBoardHeader.module.css';

import CustomToggleButton from '@/components/layout/shared/CustomToggleButton';
import {BoldFilter, BoldFilterOn} from '@ui/Icons';
import ExploreSearchInput from './ExploreSearchInput';
import {ExploreItem} from '@/app/NetWork/ExploreNetwork';
import FilterSelector, {FilterDataItem} from '@/components/search/FilterSelector';
import {searchType} from '../SearchBoard';
import getLocalizedText from '@/utils/getLocalizedText';

interface Props {
  search: searchType;
  setSearchResultList: React.Dispatch<React.SetStateAction<ExploreItem[] | null>>;
  adultToggleOn: boolean;
  setAdultToggleOn: (isAdult: boolean) => void;
  searchValue: string;
  setSearchValue: React.Dispatch<React.SetStateAction<string>>;
  filterData: string[] | null;
  positiveFilter: FilterDataItem[];
  setPositiveFilter: React.Dispatch<React.SetStateAction<FilterDataItem[]>>;
  negativeFilter: FilterDataItem[];
  setNegativeFilter: React.Dispatch<React.SetStateAction<FilterDataItem[]>>;
  fetchExploreData: (
    search: searchType,
    searchValue: string,
    adultToggleOn: boolean,
    contentOffset: number,
    characterOffset: number,
    storyOffset: number,
  ) => void;
  setSearchOffset: React.Dispatch<React.SetStateAction<number>>;
  setContentOffset: React.Dispatch<React.SetStateAction<number>>;
  setCharacterOffset: React.Dispatch<React.SetStateAction<number>>;
  setStoryOffset: React.Dispatch<React.SetStateAction<number>>;
  onFilterSaved: (positive: FilterDataItem[], negative: FilterDataItem[]) => void;
}

const SearchBoardHeader: React.FC<Props> = ({
  search,
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
  setContentOffset,
  setCharacterOffset,
  setStoryOffset,
  onFilterSaved,
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
    setContentOffset(0);
    setCharacterOffset(0);
    setStoryOffset(0);

    fetchExploreData(search, searchValue, adultToggleOn, 0, 0, 0);
  };

  const handleSave = (filters: {positive: FilterDataItem[]; negative: FilterDataItem[]}) => {
    setPositiveFilter(filters.positive);
    setNegativeFilter(filters.negative);

    setFilterItem(prevFilterItem =>
      prevFilterItem.map(item => {
        if (filters.positive.some(filter => filter.key === item.key)) {
          return {...item, state: 'selected'};
        }
        if (filters.negative.some(filter => filter.key === item.key)) {
          return {...item, state: 'remove'};
        }
        return {...item, state: 'empty'};
      }),
    );
    onFilterSaved(filters.positive, filters.negative);
  };

  useEffect(() => {
    if (filterData) {
      const items = filterData.map(key => ({
        key: key,
        state: 'empty', // 초기 상태 설정
      }));
      setFilterItem(items);
    }
  }, [filterData]);

  useEffect(() => {
    setFilterItem(prevItems =>
      prevItems.map(item => {
        if (positiveFilter.some(p => p.key === item.key)) {
          return {...item, state: 'selected'};
        } else if (negativeFilter.some(n => n.key === item.key)) {
          return {...item, state: 'remove'};
        } else {
          return {...item, state: 'empty'};
        }
      }),
    );
  }, [positiveFilter, negativeFilter]);

  return (
    <div className={styles.searchHeaderContainer}>
      <div className={styles.searchHeader}>
        <div className={styles.ageRateArea}>
          <CustomToggleButton
            isToggled={adultToggleOn}
            onToggle={handleAdultToggleClicked}
            size="sm"
            state="default"
            theme="dark"
          />
          <div className={`${styles.rateText} ${adultToggleOn ? styles.toggleOn : ''}`}>
            {getLocalizedText('common_filterinterest_adults')}
          </div>
        </div>
        <ExploreSearchInput
          value={searchValue}
          onChange={e => setSearchValue(e.target.value)}
          onSearch={val => {
            setSearchResultList([]);
            setSearchValue(val);
            handleSearch();
          }}
          placeholder={getLocalizedText('common_sample_078')}
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
