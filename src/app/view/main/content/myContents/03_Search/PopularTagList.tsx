import React from 'react';
import styles from './PopularTagList.module.css';

interface Props {
  tags: string[];
  onTagClick?: (tag: string) => void;
  activeIndex?: number;
  onMouseMoveIndex?: (idx: number) => void;
}

const PopularTagList: React.FC<Props> = ({tags, onTagClick, activeIndex = -1, onMouseMoveIndex}) => {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <span className={styles.title}>Popular Tags</span>
      </div>

      <div className={styles.tagList}>
        {tags.map((tag, idx) => (
          <button
            key={tag}
            className={styles.hashtag + ' ' + (activeIndex === idx ? styles.active : '')}
            onMouseDown={() => onTagClick?.(tag)}
            onMouseMove={() => onMouseMoveIndex?.(idx)}
          >
            #{tag}
          </button>
        ))}
      </div>
    </div>
  );
};

export default PopularTagList;
