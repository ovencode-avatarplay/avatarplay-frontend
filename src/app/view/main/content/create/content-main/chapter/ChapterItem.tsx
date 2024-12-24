import React, {useState} from 'react';

import EpisodeItem from './EpisodeItem';
import {ChapterItemProps} from './ChapterTypes';

import styles from './ChapterItem.module.css';
import {BoldMenuDots, BoldRadioButton, BoldRadioButtonSelected, LineCopy, LineDelete, LineEdit} from '@ui/Icons';

const ChapterItem: React.FC<ChapterItemProps> = ({
  chapter,
  chapterIdx,
  chapterLength,
  onToggle,
  onDelete,
  onDeleteEpisode,
  onSelect,
  onSelectEpisode,
  onCloseChapterBoard,
  onEdit,
  isSelected,
  selectedEpisodeIdx,
  disableDelete,
}) => {
  const [dropBoxOpen, setDropBoxOpen] = useState<boolean>(false);

  const handleDeleteChapter = (chapterIdx: number, chapterLength: number) => {
    onDelete(chapterIdx);

    console.log(chapterIdx + '/' + chapterLength);
  };

  return (
    <>
      <div
        className={styles.chapterItem}
        onClick={() => {
          onSelect(chapterIdx);
          onToggle(chapterIdx);
        }}
      >
        <div className={styles.chapterInfoArea}>
          <button className={styles.chapterInfoLeft}>
            <div className={styles.radioButton}>
              <img
                className={styles.radioButtonIcon}
                src={isSelected ? BoldRadioButtonSelected.src : BoldRadioButton.src}
              />
            </div>
            <div className={styles.chapterName}>ChapterName</div>
          </button>
          <button
            className={styles.chapterDropDownButton}
            onClick={() => {
              setDropBoxOpen(!dropBoxOpen);
            }}
          >
            <img className={styles.chapterDropDownIcon} src={BoldMenuDots.src} />
          </button>
        </div>
        <div className={styles.episodeContainer}>
          {chapter.episodes.map((episode, episodeIdx) => (
            <EpisodeItem
              key={episodeIdx}
              episode={episode}
              chapterIdx={chapterIdx}
              episodeIdx={episodeIdx} // 인덱스를 전달
              onEditEpisode={onEdit}
              onDeleteEpisode={onDeleteEpisode}
              disableDelete={chapter.episodes.length <= 1}
              onSelect={onSelectEpisode}
              onClose={onCloseChapterBoard}
              isSelected={selectedEpisodeIdx === episodeIdx}
            />
          ))}
        </div>
        {dropBoxOpen && (
          <div className={styles.chapterDropDown}>
            <button className={styles.dropDownItem}>
              <div className={styles.dropDownName}>Rename</div>
              <div className={styles.dropDownIconBox}>
                <img className={`${styles.dropDownIcon} ${styles.blackIcon}`} src={LineEdit.src} />
              </div>
            </button>

            <button className={styles.dropDownItem}>
              <div className={styles.dropDownName}>Duplicate</div>
              <div className={styles.dropDownIconBox}>
                <img className={`${styles.dropDownIcon} ${styles.blackIcon}`} src={LineCopy.src} />
              </div>
            </button>

            {!disableDelete && (
              <button
                className={styles.dropDownItem}
                onClick={e => {
                  e.stopPropagation();
                  handleDeleteChapter(chapterIdx, chapterLength);
                }}
              >
                <div className={`${styles.dropDownName} ${styles.redText}`}>Delete</div>
                <div className={styles.dropDownIconBox}>
                  <img className={`${styles.dropDownIcon} ${styles.redIcon}`} src={LineDelete.src} />
                </div>
              </button>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default ChapterItem;
