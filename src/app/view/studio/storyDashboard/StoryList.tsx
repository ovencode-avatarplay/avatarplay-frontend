import {useSelector} from 'react-redux';
import StoryDashboardList from '../../main/content/create/story-main/story-dashboard/StoryDashboardList';
import {RootState} from '@/redux-store/ReduxStore';
import {useState} from 'react';
import styles from './StoryList.module.css';

interface ContentListProps {
  onSelect: (selectedItemId: number) => void;
  onItemEdit: () => void;
  onItemDelete: () => void;
}

const ContentList: React.FC<ContentListProps> = ({onSelect, onItemEdit, onItemDelete}) => {
  const contentInfo = useSelector((state: RootState) => state.myStories.storyDashBoardList);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const handleItemSelect = (index: number) => {
    setSelectedIndex(index);
    const selectedItemId = contentInfo[index]?.id;
    if (selectedItemId) {
      onSelect(selectedItemId);
    }
  };
  const handleItemEdit = () => {
    onItemEdit();
  };
  const handleItemDelete = () => {
    onItemDelete();
  };

  return (
    <div className={styles.drawerContainer}>
      <StoryDashboardList
        storyInfo={contentInfo}
        selectedIndex={selectedIndex}
        onItemSelect={handleItemSelect}
        onItemEdit={handleItemEdit}
        onItemDelete={handleItemDelete}
      />
    </div>
  );
};
export default ContentList;
