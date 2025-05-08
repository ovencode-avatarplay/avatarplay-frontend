// WorkroomFolderData.tsx
import React from 'react';
import styles from './Workroom.module.css';
import SwipeTagList from './SwipeTagList';
import EmptyState from '@/components/search/EmptyState';
import getLocalizedText from '@/utils/getLocalizedText';
import {WorkroomItemInfo} from './WorkroomItem';

interface Props {
  tagState: string;
  folderId: number;
  folderTags: string[];
  allData: WorkroomItemInfo[];
  folderData: WorkroomItemInfo[];
  imageData: WorkroomItemInfo[];
  videoData: WorkroomItemInfo[];
  audioData: WorkroomItemInfo[];
  detailView: boolean;
  handleTagClick: (value: string) => void;
  renderCategorySection: Function;
  renderDataItems: Function;
  filterWorkroomData: Function;
  handleStart: () => void;
  handleEnd: () => void;
  handleDeselectIfOutside: (e: React.MouseEvent | React.TouchEvent) => void;
}

const WorkroomFolderData: React.FC<Props> = ({
  tagState,
  folderId,
  folderTags,
  allData,
  folderData,
  imageData,
  videoData,
  audioData,
  detailView,
  handleTagClick,
  renderCategorySection,
  renderDataItems,
  filterWorkroomData,
  handleStart,
  handleEnd,
  handleDeselectIfOutside,
}) => {
  return (
    <>
      <SwipeTagList tags={folderTags} currentTag={tagState} onTagChange={tag => handleTagClick(tag)} />
      <div
        className={styles.folderContainer}
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
          filterWorkroomData(allData, {trash: false, parentFolderId: folderId}).length > 0 ? (
            <>
              {renderCategorySection(
                'TODO : Folder',
                'folder',
                'Folders',
                folderData,
                true,
                {
                  filterArea: false,
                  limit: 4,
                  trash: false,
                  parentFolderId: folderId,
                },
                true,
              )}

              {renderCategorySection(
                'TODO : Image',
                'folder',
                'Image',
                imageData,
                detailView,
                {
                  filterArea: false,
                  limit: 4,
                  parentFolderId: folderId,
                },
                true,
              )}

              {renderCategorySection(
                'TODO : Video',
                'folder',
                'Video',
                videoData,
                detailView,
                {
                  filterArea: false,
                  limit: 4,
                  parentFolderId: folderId,
                },
                true,
              )}

              {renderCategorySection(
                'TODO : Audio',
                'folder',
                'Audio',
                audioData,
                true,
                {
                  filterArea: false,
                  limit: 4,
                  parentFolderId: folderId,
                },
                true,
              )}
            </>
          ) : (
            <div className={styles.emptyStateContainer}>
              <EmptyState stateText={getLocalizedText('TODO : EMPTY')} />
            </div>
          )
        ) : tagState === 'Folders' ? (
          renderDataItems(folderData, true, {filterArea: true, parentFolderId: folderId, renderEmpty: true})
        ) : tagState === 'Image' ? (
          renderDataItems(imageData, detailView, {filterArea: true, parentFolderId: folderId, renderEmpty: true}, true)
        ) : tagState === 'Video' ? (
          renderDataItems(videoData, detailView, {filterArea: true, parentFolderId: folderId, renderEmpty: true}, true)
        ) : tagState === 'Audio' ? (
          renderDataItems(audioData, true, {filterArea: true, parentFolderId: folderId, renderEmpty: true})
        ) : null}
      </div>
    </>
  );
};

export default WorkroomFolderData;
