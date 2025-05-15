import React from 'react';
import styles from './Workroom.module.css';
import EmptyState from '@/components/search/EmptyState';
import getLocalizedText from '@/utils/getLocalizedText';

interface WorkroomCategorySectionProps {
  titleKey: string;
  tagKey: string;
  tagValue: string;
  dataLength: number;
  renderDataItems: () => JSX.Element;
  onClickTag: (tag: string) => void;
  hideEmpty?: boolean;
}

const WorkroomCategorySection: React.FC<WorkroomCategorySectionProps> = ({
  titleKey,
  tagKey,
  tagValue,
  dataLength,
  renderDataItems,
  onClickTag,
  hideEmpty = false,
}) => {
  if (dataLength > 0) {
    return (
      <div className={styles.categoryArea}>
        <div className={styles.categoryTitleArea}>
          <div className={styles.categoryTitle}>{getLocalizedText(titleKey)}</div>
          <button className={styles.categoryShowMore} onClick={() => onClickTag(tagValue)}>
            {getLocalizedText('TODO : Show more')}
          </button>
        </div>
        {renderDataItems()}
      </div>
    );
  }

  return hideEmpty ? null : (
    <div className={styles.emptyStateContainer}>
      <EmptyState stateText={getLocalizedText('TODO : EMPTY')} />
    </div>
  );
};

export default WorkroomCategorySection;
