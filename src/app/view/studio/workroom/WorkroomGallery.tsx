// WorkroomGallery.tsx
import React from 'react';
import styles from './Workroom.module.css';
import EmptyState from '@/components/search/EmptyState';
import getLocalizedText from '@/utils/getLocalizedText';
import {WorkroomItemInfo} from './WorkroomItem';

interface Props {
  tagState: string;
  galleryData: WorkroomItemInfo[];
  detailView: boolean;
  renderCategorySection: Function;
  renderDataItems: Function;
  filterWorkroomData: Function;
}

const WorkroomGallery: React.FC<Props> = ({
  tagState,
  galleryData,
  detailView,
  renderCategorySection,
  renderDataItems,
  filterWorkroomData,
}) => {
  return (
    <div className={styles.galleryContainer}>
      {tagState === 'All' ? (
        filterWorkroomData(galleryData, {trash: false}).length > 0 ? (
          <>
            {renderCategorySection(
              'TODO : MyCharacter',
              'gallery',
              'MyCharacter',
              galleryData,
              detailView,
              {
                filterArea: false,
                limit: 4,
              },
              true,
            )}

            {renderCategorySection(
              'TODO : SharedCharacter',
              'gallery',
              'SharedCharacter',
              galleryData,
              detailView,
              {
                filterArea: false,
                limit: 4,
              },
              true,
            )}
          </>
        ) : (
          <div className={styles.emptyStateContainer}>
            <EmptyState stateText={getLocalizedText('TODO : EMPTY')} />
          </div>
        )
      ) : tagState === 'MyCharacter' ? (
        renderDataItems(galleryData, detailView, {filterArea: true, renderEmpty: true}, true)
      ) : null}
    </div>
  );
};

export default WorkroomGallery;
