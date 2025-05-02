// WorkroomAiHistory.tsx
import React from 'react';
import styles from './Workroom.module.css';
import EmptyState from '@/components/search/EmptyState';
import getLocalizedText from '@/utils/getLocalizedText';
import {WorkroomItemInfo} from './WorkroomItem';

interface Props {
  tagState: string;
  aiHistoryData: WorkroomItemInfo[];
  renderDataItems: Function;
  handleStart: () => void;
  handleEnd: () => void;
  handleDeselectIfOutside: (e: React.MouseEvent | React.TouchEvent) => void;
}

const WorkroomAiHistory: React.FC<Props> = ({
  tagState,
  aiHistoryData,
  renderDataItems,
  handleStart,
  handleEnd,
  handleDeselectIfOutside,
}) => {
  return (
    <div
      className={styles.aiHistoryContainer}
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
      <div className={styles.categoryArea}>
        <div className={styles.categoryTitleArea}></div>
        {renderDataItems(
          aiHistoryData,
          false,
          {
            filterArea: false,
            generatedType: tagState === 'All' ? 0 : tagState === 'Custom' ? 1 : tagState === 'Variation' ? 2 : 0,
            renderEmpty: true,
          },
          true,
        )}
      </div>
    </div>
  );
};

export default WorkroomAiHistory;
