import React, {useEffect, useState} from 'react';

// Icons
import styles from './SearchBoardHeader.module.css';

import ToggleButton from '@/components/layout/shared/ToggleButton';
import {BoldFilter, BoldFilterOn} from '@ui/Icons';
import ExploreSearchInput from './ExploreSearchInput';
import {ExploreItem, sendSearchExplore} from '@/app/NetWork/ExploreNetwork';
import FilterSelector, {FilterDataItem} from '@/components/create/FilterSelector';

interface Props {
  setSearchResultList: React.Dispatch<React.SetStateAction<ExploreItem[] | null>>;
  adultToggleOn: boolean;
  setAdultToggleOn: React.Dispatch<React.SetStateAction<boolean>>;
  filterData: string[] | null;
}

const SearchBoardHeader: React.FC<Props> = ({setSearchResultList, adultToggleOn, setAdultToggleOn, filterData}) => {
  const [filterDialogOn, setFilterDialogOn] = useState(false);
  const [filterOn, setFilterOn] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [filterItem, setFilterItem] = useState<FilterDataItem[]>([]);
  const [positiveFilters, setPositiveFilters] = useState<FilterDataItem[]>([]);

  const handleAdultToggleClicked = () => {
    setAdultToggleOn(!adultToggleOn);
  };

  const handleFilterButtonClicked = () => {
    setFilterDialogOn(!filterDialogOn);
  };

  const handleSearch = () => {
    fetchExploreData();
  };

  const handleSave = (selectedFilters: FilterDataItem[]) => {
    setPositiveFilters(selectedFilters);
  };

  const filterString = positiveFilters.map(filter => filter.name).join(',');

  const fetchExploreData = async () => {
    const result = await sendSearchExplore(
      searchValue,
      1, // category
      0, // sort
      filterString, // filter
      adultToggleOn,
      0, // offset
      20, // limit
    );

    if (result.resultCode === 0) {
      console.log('Explore data fetched:', result.searchExploreList);
      setSearchResultList(result.searchExploreList);
    } else {
      console.error('Failed to fetch explore data:', result.resultMessage);
    }
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
          <img className={styles.filterIcon} src={filterOn ? BoldFilterOn.src : BoldFilter.src} />
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
