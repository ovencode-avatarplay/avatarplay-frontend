import React, {useState} from 'react';

// Icons
import styles from './SearchBoardHeader.module.css';

import TagData from 'data/search-board-tags.json';
import ToggleButton from '@/components/layout/shared/ToggleButton';
import {BoldFilter, BoldFilterOn} from '@ui/Icons';
import ExploreSearchInput from './ExploreSearchInput';

const SearchBoardHeader: React.FC = () => {
  const [adultToggleOn, setAdultToggleOn] = useState(false);
  const [filterDialogOn, setFilterDialogOn] = useState(false);
  const [filterOn, setFilterOn] = useState(false);

  const handleAdultToggleClicked = () => {
    setAdultToggleOn(!adultToggleOn);
  };

  const handleFilterButtonClicked = () => {
    setFilterDialogOn(true);
  };

  return (
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
      <ExploreSearchInput />
      <button className={styles.filterButton} onClick={handleFilterButtonClicked}>
        <img className={styles.filterIcon} src={filterOn ? BoldFilterOn.src : BoldFilter.src} />
      </button>
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
