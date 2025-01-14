import {useSelector} from 'react-redux';
import ContentDashboardList from '../../main/content/create/content-main/content-dashboard/ContentDashboardList';
import {RootState} from '@/redux-store/ReduxStore';
import {useState} from 'react';
import styles from './ContentList.module.css';

interface ContentListProps {
  onSelect: (selectedItemId: number) => void;
  onItemEdit: () => void;
  onItemDelete: () => void;
}

const ContentList: React.FC<ContentListProps> = ({onSelect, onItemEdit, onItemDelete}) => {
  const contentInfo = useSelector((state: RootState) => state.myContents.contentDashBoardList);
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
      <ContentDashboardList
        contentInfo={contentInfo}
        selectedIndex={selectedIndex}
        onItemSelect={handleItemSelect}
        onItemEdit={handleItemEdit}
        onItemDelete={handleItemDelete}
      />
    </div>
  );
};
export default ContentList;
