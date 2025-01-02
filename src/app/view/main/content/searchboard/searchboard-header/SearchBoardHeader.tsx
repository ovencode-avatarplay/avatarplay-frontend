import React from 'react';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';

// Icons
import {Switch} from '@mui/material';
import WhatshotIcon from '@mui/icons-material/Whatshot';
import TagIcon from '@mui/icons-material/Tag';
import EighteenUpRatingIcon from '@mui/icons-material/EighteenUpRating';

import styles from './SearchBoardHeader.module.css';

import SearchField from 'components/layout/shared/SearchComponent';

import TagData from 'data/search-board-tags.json';

// 아이콘 문자열을 JSX.Element로 변환하는 함수
const getIconComponent = (iconName: string) => {
  switch (iconName) {
    case 'WhatshotIcon':
      return <WhatshotIcon />;
    case 'TagIcon':
      return <TagIcon />;
    default:
      return <WhatshotIcon />; // 정의되지 않은 아이콘은 null로 반환
  }
};

const SearchBoardHeader: React.FC = () => {
  return (
    <div className={styles.searchBoard}>
      <div className={styles.search}>
        <SearchField />
        <span className={styles.nsfwToggle}>
          <EighteenUpRatingIcon />
          <Switch />
        </span>
      </div>

      <Box className={styles.tags}>
        {TagData.map((tag, index) => {
          const tmpIcon = getIconComponent(tag.icon);
          return <Chip className={styles.chip} key={index} icon={tmpIcon ? tmpIcon : undefined} label={tag.label} />;
        })}
      </Box>
    </div>
  );
};

export default SearchBoardHeader;
