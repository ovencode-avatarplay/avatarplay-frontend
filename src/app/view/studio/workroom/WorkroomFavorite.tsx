// WorkroomFavorite.tsx
import React from 'react';
import styles from './Workroom.module.css';
import {WorkroomItemInfo} from './WorkroomItem';
import EmptyState from '@/components/search/EmptyState';
import getLocalizedText from '@/utils/getLocalizedText';

interface Props {
  tagState: string;
  folderData: WorkroomItemInfo[];
  imageData: WorkroomItemInfo[];
  videoData: WorkroomItemInfo[];
  audioData: WorkroomItemInfo[];
  detailView: boolean;
  renderCategorySection: Function;
  renderDataItems: Function;
  filterWorkroomData: Function;
}

const WorkroomFavorite: React.FC<Props> = ({
  tagState,
  folderData,
  imageData,
  videoData,
  audioData,
  detailView,
  renderCategorySection,
  renderDataItems,
  filterWorkroomData,
}) => {
  return (
    <div className={styles.favoriteContainer}>
      {tagState === 'All' ? (
        filterWorkroomData(folderData, {trash: false, favorite: true}).length > 0 ||
        filterWorkroomData(imageData, {trash: false, favorite: true}).length > 0 ||
        filterWorkroomData(videoData, {trash: false, favorite: true}).length > 0 ||
        filterWorkroomData(audioData, {trash: false, favorite: true}).length > 0 ? (
          <>
            {renderCategorySection(
              'TODO : Folder',
              'favorite',
              'Folders',
              folderData,
              true,
              {favorite: true, trash: false, limit: 4},
              true,
              true,
            )}
            {renderCategorySection(
              'TODO : Image',
              'favorite',
              'Image',
              imageData,
              detailView,
              {favorite: true, trash: false, limit: 4},
              true,
              true,
            )}
            {renderCategorySection(
              'TODO : Video',
              'favorite',
              'Video',
              videoData,
              detailView,
              {favorite: true, trash: false, limit: 4},
              true,
              true,
            )}
            {renderCategorySection(
              'TODO : Audio',
              'favorite',
              'Audio',
              audioData,
              true,
              {favorite: true, trash: false, limit: 4},
              true,
              true,
            )}
          </>
        ) : (
          <div className={styles.emptyStateContainer}>
            <EmptyState stateText={getLocalizedText('TODO : EMPTY')} />
          </div>
        )
      ) : tagState === 'Folders' ? (
        renderDataItems(folderData, true, {filterArea: true, favorite: true, renderEmpty: true})
      ) : tagState === 'Image' ? (
        renderDataItems(imageData, detailView, {filterArea: true, favorite: true, renderEmpty: true}, true)
      ) : tagState === 'Video' ? (
        renderDataItems(videoData, detailView, {filterArea: true, favorite: true, renderEmpty: true}, true)
      ) : tagState === 'Audio' ? (
        renderDataItems(audioData, true, {filterArea: true, favorite: true, renderEmpty: true})
      ) : null}
    </div>
  );
};

export default WorkroomFavorite;
