// WorkroomTrash.tsx
import React from 'react';
import styles from './Workroom.module.css';
import EmptyState from '@/components/search/EmptyState';
import getLocalizedText from '@/utils/getLocalizedText';
import {WorkroomItemInfo} from './WorkroomItem';

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
  handleStart: () => void;
  handleEnd: () => void;
  handleDeselectIfOutside: (e: React.MouseEvent | React.TouchEvent) => void;
}

const WorkroomTrash: React.FC<Props> = ({
  tagState,
  folderData,
  imageData,
  videoData,
  audioData,
  detailView,
  renderCategorySection,
  renderDataItems,
  filterWorkroomData,
  handleStart,
  handleEnd,
  handleDeselectIfOutside,
}) => {
  return (
    <div
      className={styles.trashContainer}
      onMouseDown={handleStart}
      onMouseUp={handleEnd}
      onMouseLeave={handleEnd}
      onTouchStart={handleStart}
      onTouchCancel={handleEnd}
      onTouchEnd={e => {
        handleEnd();
        handleDeselectIfOutside(e);
      }}
      onClick={e => handleDeselectIfOutside(e)}
    >
      {tagState === 'All' ? (
        filterWorkroomData(folderData, {trash: true}).length > 0 ? (
          <>
            {renderCategorySection(
              'TODO : Folder',
              'trash',
              'Folders',
              folderData,
              true,
              {filterArea: false, limit: 4, trash: true},
              true,
            )}
            {renderCategorySection(
              'TODO : Image',
              'trash',
              'Image',
              imageData,
              detailView,
              {filterArea: false, limit: 4, trash: true},
              true,
            )}
            {renderCategorySection(
              'TODO : Video',
              'trash',
              'Video',
              videoData,
              detailView,
              {filterArea: false, limit: 4, trash: true},
              true,
            )}
            {renderCategorySection(
              'TODO : Audio',
              'trash',
              'Audio',
              audioData,
              true,
              {filterArea: false, limit: 4, trash: true},
              true,
            )}
          </>
        ) : (
          <div className={styles.emptyStateContainer}>
            <EmptyState stateText={getLocalizedText('TODO : EMPTY')} />
          </div>
        )
      ) : tagState === 'Folders' ? (
        renderDataItems(folderData, true, {filterArea: true, limit: 4, trash: true, renderEmpty: true})
      ) : tagState === 'Image' ? (
        renderDataItems(imageData, detailView, {filterArea: true, limit: 4, trash: true, renderEmpty: true}, true)
      ) : tagState === 'Video' ? (
        renderDataItems(videoData, detailView, {filterArea: true, limit: 4, trash: true, renderEmpty: true}, true)
      ) : tagState === 'Audio' ? (
        renderDataItems(audioData, true, {filterArea: true, limit: 4, trash: true, renderEmpty: true})
      ) : null}
    </div>
  );
};

export default WorkroomTrash;
