import React from 'react';
import styles from './EmptyState.module.css';
import {EmptyStateIcon} from '@ui/system';

interface Props {
  stateText: string | JSX.Element;
}

const EmptyState: React.FC<Props> = ({stateText}) => {
  return (
    <div className={styles.emptyStateContainer}>
      <div className={styles.emptyStateBox}>
        <img className={styles.emptyStateIcon} src={EmptyStateIcon.src} />
        <div className={styles.emptyStateText}>{stateText}</div>
      </div>
    </div>
  );
};

export default EmptyState;
