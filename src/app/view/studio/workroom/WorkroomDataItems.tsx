// WorkroomDataItems.tsx
import React, {useEffect, useRef} from 'react';
import styles from './Workroom.module.css';
import WorkroomItem, {WorkroomItemInfo} from './WorkroomItem';
import EmptyState from '@/components/search/EmptyState';
import getLocalizedText from '@/utils/getLocalizedText';
import {MediaState, PaginationRequest} from '@/app/NetWork/ProfileNetwork';

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
  workroomLoading: boolean;
  getWorkroomFiles: (fileType: MediaState, page?: PaginationRequest | undefined, blockRequestMore?: boolean) => void;
  hasWorkroomResult: boolean;
  blockRequestMore?: boolean;
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

  workroomLoading,
  getWorkroomFiles,
  hasWorkroomResult,
  blockRequestMore = false,
}) => {
  const filteredData = filterWorkroomData(data, option);

  // scroll 조건 외에 마지막 아이템이 보이면 search 호출
  const observer = useRef<IntersectionObserver | null>(null);

  const lastElement = useRef<HTMLLIElement | null>(null);
  useEffect(() => {
    if (workroomLoading || !hasWorkroomResult || blockRequestMore) return;

    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        getWorkroomFiles(data[0].mediaState, {offset: data.length, limit: 10});
      }
    });

    if (lastElement.current) observer.current.observe(lastElement.current);

    return () => {
      observer.current?.disconnect();
    };
  }, [data]);

  return (
    <div className={styles.itemContainer}>
      {option.filterArea && <div className={styles.filterArea}>{renderFilter(detailViewButton, detailView)}</div>}

      {filteredData.length > 0 ? (
        <ul className={detailView ? styles.listArea : styles.gridArea}>
          {filteredData.map((item, index) => (
            <li
              className={styles.dataItem}
              key={index}
              data-item
              ref={index === filteredData.length - 1 ? lastElement : null}
            >
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
            </li>
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
