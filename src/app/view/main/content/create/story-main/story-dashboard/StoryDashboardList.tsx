import React, {useRef, useEffect} from 'react';
import {Box} from '@mui/material';
import StoryItem from './StoryItem';
import styles from './StoryDashboardList.module.css';
import {StoryDashboardItem} from '@/redux-store/slices/MyStoryDashboard';

interface Props {
  storyInfo: StoryDashboardItem[];
  selectedIndex: number | null;
  onItemSelect: (index: number) => void;
  onItemEdit: () => void;
  onItemDelete: () => void;
  dateOption?: number;
}

const StoryDashboardList: React.FC<Props> = ({
  storyInfo,
  selectedIndex,
  onItemSelect,
  onItemEdit,
  onItemDelete,
  dateOption = 0,
}) => {
  const listRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (selectedIndex !== null && listRef.current) {
      const selectedItem = listRef.current.children[selectedIndex];
      if (selectedItem) {
        selectedItem.scrollIntoView({behavior: 'smooth', block: 'center'});
      }
    }
  }, [selectedIndex]);

  return (
    <Box className={styles.list} ref={listRef}>
      {storyInfo.map((item, index) => (
        <div key={index} onClick={() => onItemSelect(index)}>
          <StoryItem
            dashboardItem={item}
            isSelected={selectedIndex === index}
            onEditClicked={onItemEdit}
            onDeleteClicked={onItemDelete}
            dateOption={dateOption}
          />
        </div>
      ))}
    </Box>
  );
};

export default StoryDashboardList;
