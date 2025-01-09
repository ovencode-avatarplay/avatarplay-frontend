import React, {useRef, useEffect} from 'react';
import {Box} from '@mui/material';
import ContentItem from './ContentItem';
import styles from './ContentDashboardList.module.css';
import {ContentDashboardItem} from '@/redux-store/slices/MyContentDashboard';

interface Props {
  contentInfo: ContentDashboardItem[];
  selectedIndex: number | null;
  onItemSelect: (index: number) => void;
  onItemEdit: () => void;
  onItemDelete: () => void;
  dateOption: number;
}

const ContentDashboardList: React.FC<Props> = ({
  contentInfo,
  selectedIndex,
  onItemSelect,
  onItemEdit,
  onItemDelete,
  dateOption,
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
      {contentInfo.map((item, index) => (
        <div key={index} onClick={() => onItemSelect(index)}>
          <ContentItem
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

export default ContentDashboardList;
