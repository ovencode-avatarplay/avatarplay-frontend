import React, {useState} from 'react';

import EpisodeItem from './EpisodeItem';
import {ChapterItemProps} from './ChapterTypes';

import styles from './ChapterItem.module.css';
import {BoldMenuDots, BoldRadioButton, BoldRadioButtonSelected, LineCopy, LineDelete, LineEdit} from '@ui/Icons';
import DropDownMenu, {DropDownMenuItem} from '@/components/create/DropDownMenu';

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
  const dropDownMenuItems: DropDownMenuItem[] = [
    {
      name: 'Rename',
      icon: LineEdit.src,
      onClick: () => console.log('Rename clicked'),
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
        {dropBoxOpen && <DropDownMenu items={dropDownMenuItems} className={styles.chapterDropDown} />}
      </div>
    </>
  );
};

export default ChapterItem;
