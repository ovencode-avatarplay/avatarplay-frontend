import React from 'react';
import styles from './PopularTagList.module.css';

interface Props {
  tags: string[];
  onTagClick?: (tag: string) => void;
}

const PopularTagList: React.FC<Props> = ({tags, onTagClick}) => {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <span className={styles.title}>Popular Tags</span>
      </div>

      <div className={styles.tagList}>
        {tags.map(tag => (
          <button key={tag} className={styles.hashtag} onClick={() => onTagClick?.(tag)}>
            #{tag}
          </button>
        ))}
      </div>
    </div>
  );
};

export default PopularTagList;
