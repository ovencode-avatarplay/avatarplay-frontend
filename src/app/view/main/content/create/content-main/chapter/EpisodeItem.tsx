import React from 'react';

import {EpisodeItemProps} from './ChapterTypes';

import styles from './EpisodeItem.module.css';
import {BoldArrowDown, BoldRadioButton, BoldRadioButtonSelected, LineCorner} from '@ui/Icons';
import {useDispatch, useSelector} from 'react-redux';
import {adjustEpisodeIndex, setSelectedChapterIdx} from '@/redux-store/slices/ContentInfo';
import {RootState} from '@/redux-store/ReduxStore';

const EpisodeItem: React.FC<EpisodeItemProps> = ({
  episode,
  chapterIdx,
  episodeIdx,
  onSelectEpisode,
  hideSelected,
  isSelected,
}) => {
  const dispatch = useDispatch();
  const episodeInfo = useSelector((state: RootState) => {
    const flatEpisodes = state.content.curEditingContentInfo.chapterInfoList.flatMap(
      chapter => chapter.episodeInfoList,
    );
    const tmpEpi = episode;
    return flatEpisodes.find(episode => episode.id === tmpEpi.id) || flatEpisodes[0]; // 기본값 처리
  });

  const handleOnSelectEpisode = () => {
    onSelectEpisode(chapterIdx, episodeIdx);
  };

  const handleChangeOrderEpisodeIndex = (direction: 'up' | 'down') => {
    // TODO CurEpisode
    // dispatch(setCurrentEpisodeInfo(episodeInfo));
    const targetId = episodeInfo.id;
    dispatch(adjustEpisodeIndex({targetId, direction}));
  };

  return (
    <>
      <button className={`${styles.episodeItem} ${isSelected && styles.selectedItem}`} onClick={handleOnSelectEpisode}>
        <div className={styles.episodeInfo}>
          <div className={styles.iconBox}>
            <img className={styles.cornerIcon} src={LineCorner.src} />
            {!hideSelected && (
              <div className={styles.radioButton}>
                <img
                  className={styles.radioButtonIcon}
                  src={isSelected ? BoldRadioButtonSelected.src : BoldRadioButton.src}
                />
              </div>
            )}
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
