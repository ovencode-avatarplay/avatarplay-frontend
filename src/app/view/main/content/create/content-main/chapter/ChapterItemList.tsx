import React from 'react';
import styles from './ChapterItemList.module.css';
import ChapterItem from './ChapterItem'; // ChapterItem 컴포넌트 경로를 맞춰주세요.
import {ChapterInfo} from '@/redux-store/slices/ContentInfo';

interface ChapterListProps {
  canEdit: boolean;
  chapters: ChapterInfo[];
  selectedChapterIdx: number;
  selectedEpisodeIdx: number;
  onClose: () => void;
  onDelete: (chapterIdx: number) => void;
  onSelect: (chapterIdx: number) => void;
  hideSelectedEpisode: boolean;
  onSelectEpisode: (chapterIdx: number, episodeIdx: number) => void;
  onRename: () => void;
}

const ChapterItemList: React.FC<ChapterListProps> = ({
  canEdit,
  chapters,
  selectedChapterIdx,
  selectedEpisodeIdx,
  onClose,
  onDelete,
  onSelect,
  onSelectEpisode,
  hideSelectedEpisode,
  onRename,
}) => {
  return (
    <div className={styles.drawerContainer}>
      {/* Chapter 및 Episode 트리 구조 */}
      <div className={styles.contentBox}>
        {chapters.map((chapter, index) => (
          <ChapterItem
            key={index}
            canEdit={canEdit}
            onCloseChapterBoard={onClose}
            chapter={chapter}
            chapterIdx={index}
            chapterLength={chapters.length}
            onDelete={onDelete}
            onSelect={onSelect}
            onSelectEpisode={onSelectEpisode}
            onRename={onRename}
            isSelected={selectedChapterIdx === index}
            selectedEpisodeIdx={selectedEpisodeIdx}
            hideSelectedEpisode={hideSelectedEpisode}
            disableDelete={chapters.length <= 1}
          />
        ))}
      </div>
    </div>
  );
};

export default ChapterItemList;
