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
      onClick: () => onRename(),
    },
    {
      name: 'Duplicate',
      icon: LineCopy.src,
      onClick: () => console.log('Duplicate clicked'),
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

    console.log(chapterIdx + '/' + chapterLength);
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
              onSelectEpisode={onSelectEpisode}
              hideSelected={hideSelectedEpisode}
              isSelected={episodeIdx === selectedEpisodeIdx ? true : false}
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
