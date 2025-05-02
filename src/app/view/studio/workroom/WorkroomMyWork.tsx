import React from 'react';
import styles from './Workroom.module.css';
import {WorkroomItemInfo} from './WorkroomItem';
import EmptyState from '@/components/search/EmptyState';
import getLocalizedText from '@/utils/getLocalizedText';

interface WorkroomMyWorkProps {
  tagStates: string;
  folderData: WorkroomItemInfo[];
  imageData: WorkroomItemInfo[];
  videoData: WorkroomItemInfo[];
  audioData: WorkroomItemInfo[];
  detailView: boolean;
  filterWorkroomData: Function;
  renderSwiper: Function;
  renderCategorySection: Function;
  renderDataItems: Function;
  handleStart: () => void;
  handleEnd: () => void;
  handleDeselectIfOutside: (e: React.MouseEvent | React.TouchEvent) => void;
}

const WorkroomMyWork: React.FC<WorkroomMyWorkProps> = ({
  tagStates,
  folderData,
  imageData,
  videoData,
  audioData,
  detailView,
  filterWorkroomData,
  renderSwiper,
  renderCategorySection,
  renderDataItems,
  handleStart,
  handleEnd,
  handleDeselectIfOutside,
}) => {
  const recentData = filterWorkroomData([...folderData, ...imageData, ...videoData, ...audioData], {
    limit: 20,
    renderEmpty: false,
    trash: false,
  });

  return (
    <div
      className={styles.myWorkContainer}
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
      {tagStates === 'All' ? (
        <>
          {filterWorkroomData(folderData, {trash: false}).length > 0 ||
          filterWorkroomData(imageData, {trash: false}).length > 0 ||
          filterWorkroomData(videoData, {trash: false}).length > 0 ||
          filterWorkroomData(audioData, {trash: false}).length > 0 ? (
            <>
              <div className={styles.categoryArea}>
                <div className={styles.categoryTitleArea}>
                  <div className={styles.categoryTitle}>{getLocalizedText('TODO : Recent')}</div>
                </div>
                {renderSwiper(recentData)}
              </div>

              {renderCategorySection(
                'TODO : Folder',
                'work',
                'Folders',
                folderData,
                true,
                {filterArea: false, limit: 4, trash: false},
                true,
              )}
              {renderCategorySection(
                'TODO : Image',
                'work',
                'Image',
                imageData,
                detailView,
                {filterArea: false, limit: 4},
                true,
              )}
              {renderCategorySection(
                'TODO : Video',
                'work',
                'Video',
                videoData,
                detailView,
                {filterArea: false, limit: 4},
                true,
              )}
              {renderCategorySection(
                'TODO : Audio',
                'work',
                'Audio',
                audioData,
                true,
                {filterArea: false, limit: 4},
                true,
              )}
            </>
          ) : (
            <div className={styles.emptyStateContainer}>
              <EmptyState stateText={getLocalizedText('TODO : EMPTY')} />
            </div>
          )}
        </>
      ) : tagStates === 'Folders' ? (
        renderDataItems(
          folderData.filter(
            item =>
              item.folderLocation === null || item.folderLocation === undefined || item.folderLocation.length === 0,
          ),
          true,
          {filterArea: true, renderEmpty: true},
        )
      ) : tagStates === 'Image' ? (
        renderDataItems(imageData, detailView, {filterArea: true, renderEmpty: true}, true)
      ) : tagStates === 'Video' ? (
        renderDataItems(videoData, detailView, {filterArea: true, renderEmpty: true}, true)
      ) : tagStates === 'Audio' ? (
        renderDataItems(audioData, true, {filterArea: true, renderEmpty: true})
      ) : null}
    </div>
  );
};

export default WorkroomMyWork;
