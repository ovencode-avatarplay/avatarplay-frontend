import React from 'react';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';

// Icons
import WhatshotIcon from '@mui/icons-material/Whatshot';
import TagIcon from '@mui/icons-material/Tag';
import EighteenUpRatingIcon from '@mui/icons-material/EighteenUpRating';

import TagData from 'data/search-board-tags.json';

import Style from './SearchBoardHeader.module.css';

import SearchField from 'components/layout/shared/SearchComponent';
import {Switch} from '@mui/material';

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
    <div className={Style.searchBoard}>
      <Box className={Style.tags}>
        {TagData.map((tag, index) => {
          const tmpIcon = getIconComponent(tag.icon);
          return <Chip className={Style.chip} key={index} icon={tmpIcon ? tmpIcon : undefined} label={tag.label} />;
        })}
      </Box>
      <div className={Style.search}>
        <SearchField />
        <span className={Style.nsfwToggle}>
          <EighteenUpRatingIcon />
          <Switch />
        </span>
      </div>
    </div>
  );
};

export default SearchBoardHeader;
