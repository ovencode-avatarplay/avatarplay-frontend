// WorkroomDataItems.tsx
import React from 'react';
import styles from './Workroom.module.css';
import WorkroomItem, {WorkroomItemInfo} from './WorkroomItem';
import EmptyState from '@/components/search/EmptyState';
import getLocalizedText from '@/utils/getLocalizedText';

interface WorkroomDataItemsProps {
  data: WorkroomItemInfo[];
  detailView: boolean;
  option: any;
  detailViewButton?: boolean;
  isSelecting: boolean;
  selectedItems: number[];
  renderFilter: (detailViewButton: boolean, detailView: boolean) => React.ReactNode;
  toggleSelectItem: (id: number, checked: boolean) => void;
  toggleFavorite: (id: number, isBookMark: boolean) => void;
  handleMenuClick: (item: WorkroomItemInfo) => void;
  handleItemImageClick: (item: WorkroomItemInfo) => void;
  handleItemClick: (item: WorkroomItemInfo) => void;
  filterWorkroomData: (data: WorkroomItemInfo[], option: any) => WorkroomItemInfo[];
  handleDeleteItem: () => void;
}

const WorkroomDataItems: React.FC<WorkroomDataItemsProps> = ({
  data,
  detailView,
  option,
  detailViewButton = false,
  isSelecting,
  selectedItems,
  renderFilter,
  toggleSelectItem,
  toggleFavorite,
  handleMenuClick,
  handleItemImageClick,
  handleItemClick,
  filterWorkroomData,
  handleDeleteItem,
}) => {
  const filteredData = filterWorkroomData(data, option);

  return (
    <div className={styles.itemContainer}>
      {option.filterArea && <div className={styles.filterArea}>{renderFilter(detailViewButton, detailView)}</div>}

      {filteredData.length > 0 ? (
        <ul className={detailView ? styles.listArea : styles.gridArea}>
          {filteredData.map((item, index) => (
            <div className={styles.dataItem} key={index} data-item>
              <WorkroomItem
                detailView={detailView}
                item={item}
                isSelecting={isSelecting}
                isSelected={selectedItems.includes(item.id)}
                onSelect={checked => toggleSelectItem(item.id, checked)}
                onClickFavorite={() => toggleFavorite(item.id, item.favorite || false)}
                onClickMenu={() => handleMenuClick(item)}
                onClickPreview={() => handleItemImageClick(item)}
                onClickItem={() => handleItemClick(item)}
                onClickDelete={handleDeleteItem}
              />
            </div>
          ))}
        </ul>
      ) : option.renderEmpty ? (
        <div className={styles.emptyStateContainer}>
          <EmptyState stateText={getLocalizedText('TODO : EMPTY')} />
        </div>
      ) : null}
    </div>
  );
};

export default WorkroomDataItems;
