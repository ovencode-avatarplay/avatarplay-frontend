import React from 'react';

import {EpisodeItemProps} from './ChapterTypes';

import styles from './EpisodeItem.module.css';
import {BoldArrowDown, LineCorner} from '@ui/Icons';
import {useDispatch, useSelector} from 'react-redux';
import {setCurrentEpisodeInfo} from '@/redux-store/slices/EpisodeInfo';
import {adjustEpisodeIndex} from '@/redux-store/slices/ContentInfo';
import {RootState} from '@/redux-store/ReduxStore';

const EpisodeItem: React.FC<EpisodeItemProps> = ({episode, onSelectEpisode, isSelected}) => {
  const dispatch = useDispatch();
  const episodeInfo = useSelector((state: RootState) => {
    const flatEpisodes = state.content.curEditingContentInfo.chapterInfoList.flatMap(
      chapter => chapter.episodeInfoList,
    );
    const tmpEpi = episode;
    return flatEpisodes.find(episode => episode.id === tmpEpi.id) || flatEpisodes[0]; // 기본값 처리
  });

  const handleOnSelectEpisode = () => {
    onSelectEpisode;
  };

  const handleChangeOrderEpisodeIndex = (direction: 'up' | 'down') => {
    dispatch(setCurrentEpisodeInfo(episodeInfo));
    const targetId = episodeInfo.id;
    dispatch(adjustEpisodeIndex({targetId, direction}));
  };

  return (
    <>
      <button className={`${styles.episodeItem} ${isSelected && styles.selectedItem}`} onClick={handleOnSelectEpisode}>
        <div className={styles.episodeInfo}>
          <div className={styles.iconBox}>
            <img className={styles.cornerIcon} src={LineCorner.src} />
            <div className={styles.episodeName}>{episode.name}</div>
          </div>
        </div>
        <div className={styles.episodeMove}>
          <button
            className={styles.moveButton}
            onClick={() => {
              handleChangeOrderEpisodeIndex('up');
            }}
          >
            <img className={styles.moveIcon} src={BoldArrowDown.src} style={{transform: 'rotate(180deg)'}} />
          </button>
          <button
            className={styles.moveButton}
            onClick={() => {
              handleChangeOrderEpisodeIndex('down');
            }}
          >
            <img className={styles.moveIcon} src={BoldArrowDown.src} />
          </button>
        </div>
      </button>
    </>
  );
};

export default EpisodeItem;
