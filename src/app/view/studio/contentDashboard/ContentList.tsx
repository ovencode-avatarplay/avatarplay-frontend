import {useSelector} from 'react-redux';
import ContentDashboardList from '../../main/content/create/content-main/content-dashboard/ContentDashboardList';
import {RootState} from '@/redux-store/ReduxStore';
import {useState} from 'react';
import {Box} from '@mui/material';
import styles from './ContentList.module.css';

interface ContentListProps {
  onSelect: (selectedItemId: number) => void;
}

const ContentList: React.FC<ContentListProps> = ({onSelect}) => {
  const contentInfo = useSelector((state: RootState) => state.myContents.contentDashBoardList);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const handleItemSelect = (index: number) => {
    setSelectedIndex(index);
    const selectedItemId = contentInfo[index]?.id;
    if (selectedItemId) {
      onSelect(selectedItemId);
    }
  };

  return (
    <>
      <Box className={styles.drawerContainer}>
        <ContentDashboardList contentInfo={contentInfo} selectedIndex={selectedIndex} onItemSelect={handleItemSelect} />
      </Box>
    </>
  );
};
export default ContentList;
