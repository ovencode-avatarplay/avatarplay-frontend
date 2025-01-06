import React, {useState} from 'react';

import EpisodeItem from './EpisodeItem';
import {ChapterItemProps} from './ChapterTypes';

import styles from './ChapterItem.module.css';
import {BoldMenuDots, BoldRadioButton, BoldRadioButtonSelected, LineCopy, LineDelete, LineEdit} from '@ui/Icons';
import DropDownMenu, {DropDownMenuItem} from '@/components/create/DropDownMenu';

const ChapterItem: React.FC<ChapterItemProps> = ({
  canEdit,
  chapter,
  chapterIdx,
  chapterLength,
  onDelete,
  onSelect,
  onSelectEpisode,
  onRename,
  onDuplicate,
  isSelected,
  selectedEpisodeIdx,
  hideSelectedEpisode,
  disableDelete,
}) => {
  const [dropBoxOpen, setDropBoxOpen] = useState<boolean>(false);
  const dropDownMenuItems: DropDownMenuItem[] = [
    {
      name: 'Rename',
      icon: LineEdit.src,
      onClick: () => {
        onRename();
        setDropBoxOpen(false);
      },
    },
    {
      name: 'Duplicate',
      icon: LineCopy.src,
      onClick: () => {
        onDuplicate();
        setDropBoxOpen(false);
      },
    },
    {
      name: 'Delete',
      icon: LineDelete.src,
      onClick: () => handleDeleteChapter(chapterIdx, chapterLength),
      disabled: disableDelete,
      isRed: true, // Delete는 위험 동작으로 표시
    },
  ];

  const handleDeleteChapter = (chapterIdx: number, chapterLength: number) => {
    onDelete(chapterIdx);
    setDropBoxOpen(false);

    console.log(chapterIdx + '/' + chapterLength);
  };

  const handleOnSelectEpisode = (chapterIdx: number, episodeIdx: number) => {
    onSelectEpisode(chapterIdx, episodeIdx);
  };

  const handleDuplicateChapter = () => {
    onDuplicate();
    setDropBoxOpen(false);
  };

  return (
    <>
      <div
        className={styles.chapterItem}
        onClick={() => {
          onSelect(chapterIdx);
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
            <div className={styles.chapterName}>{chapter.name}</div>
          </button>
          {canEdit && (
            <button
              className={styles.chapterDropDownButton}
              onClick={() => {
                if (canEdit) {
                  setDropBoxOpen(!dropBoxOpen);
                }
              }}
            >
              <img className={styles.chapterDropDownIcon} src={BoldMenuDots.src} />
            </button>
          )}
        </div>
        <div className={styles.episodeContainer}>
          {chapter.episodeInfoList.map((episode, episodeIdx) => (
            <EpisodeItem
              key={episodeIdx}
              episode={episode}
              chapterIdx={chapterIdx}
              episodeIdx={episodeIdx}
              onSelectEpisode={handleOnSelectEpisode}
              hideSelected={hideSelectedEpisode}
              isSelected={isSelected && episodeIdx === selectedEpisodeIdx ? true : false}
            />
          ))}
        </div>
        {dropBoxOpen && (
          <DropDownMenu
            items={dropDownMenuItems}
            onClose={() => setDropBoxOpen(false)}
            className={styles.chapterDropDown}
          />
        )}
      </div>
    </>
  );
};

export default ChapterItem;
