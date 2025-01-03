import React, {useState} from 'react';

// Icons
import styles from './SearchBoardHeader.module.css';

import TagData from 'data/search-board-tags.json';
import ToggleButton from '@/components/layout/shared/ToggleButton';
import {BoldFilter, BoldFilterOn} from '@ui/Icons';
import ExploreSearchInput from './ExploreSearchInput';
import {ExploreItem, sendSearchExplore} from '@/app/NetWork/ExploreNetwork';

const SearchBoardHeader: React.FC = () => {
  const [adultToggleOn, setAdultToggleOn] = useState(false);
  const [filterDialogOn, setFilterDialogOn] = useState(false);
  const [filterOn, setFilterOn] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  const [searchResultList, setSearchResultList] = useState<ExploreItem[] | null>(null);

  const handleAdultToggleClicked = () => {
    setAdultToggleOn(!adultToggleOn);
  };

  const handleFilterButtonClicked = () => {
    setFilterDialogOn(true);
  };

  const handleSearch = () => {
    fetchExploreData();
  };

  const fetchExploreData = async () => {
    const result = await sendSearchExplore(
      searchValue,
      1, // category
      0, // sort
      '', // filter
      adultToggleOn, // isOnlyAdults
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

  return (
    <div>
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
      {filterDialogOn && <div className={styles.filterDialog}></div>}
    </div>

    // <div className={styles.searchBoard}>
    //   <div className={styles.search}>
    //     <SearchField />
    //     <span className={styles.nsfwToggle}>
    //       <EighteenUpRatingIcon />
    //       <Switch />
    //     </span>
    //   </div>

    //   <Box className={styles.tags}>
    //     {TagData.map((tag, index) => {
    //       const tmpIcon = getIconComponent(tag.icon);
    //       return <Chip className={styles.chip} key={index} icon={tmpIcon ? tmpIcon : undefined} label={tag.label} />;
    //     })}
    //   </Box>
    // </div>
  );
};

export default SearchBoardHeader;
