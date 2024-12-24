import React from 'react';

import {EpisodeItemProps} from './ChapterTypes';

import styles from './EpisodeItem.module.css';
import {BoldArrowDown, LineCorner} from '@ui/Icons';

const EpisodeItem: React.FC<EpisodeItemProps> = ({
  episode,
  chapterIdx,
  episodeIdx,
  onEditEpisode,
  onDeleteEpisode,
  disableDelete,
  onSelect,
  onClose,
  isSelected,
}) => {
  return (
    <>
      <div className={styles.episodeItem}>
        <div className={styles.episodeInfo}>
          <div className={styles.iconBox}>
            <img className={styles.cornerIcon} src={LineCorner.src} />
            <div className={styles.episodeName}>{episode.title}</div>
          </div>
        </div>
        <div className={styles.episodeMove}>
          <button className={styles.moveButton}>
            <img className={styles.moveIcon} src={BoldArrowDown.src} style={{transform: 'rotate(180deg)'}} />
          </button>
          <button className={styles.moveButton}>
            <img className={styles.moveIcon} src={BoldArrowDown.src} />
          </button>
        </div>
      </div>
    </>
  );
};

export default EpisodeItem;
