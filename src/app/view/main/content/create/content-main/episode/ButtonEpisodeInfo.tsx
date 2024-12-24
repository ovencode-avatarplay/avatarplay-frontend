import React from 'react';
import styles from './ButtonEpisodeInfo.module.css';
import {LineEdit} from '@ui/Icons';

interface Props {
  onDrawerOpen: () => void;
  onEditChapterName: () => void;
  chapterName: string;
}

const ButtonEpisodeInfo: React.FC<Props> = ({onDrawerOpen, chapterName, onEditChapterName}) => {
  const handlerOnDrawerOpen = () => {
    onDrawerOpen();
  };

  return (
    <button className={styles.chapterInfo} onClick={handlerOnDrawerOpen}>
      <div className={styles.chapterName}>{chapterName}</div>
      <button
        className={styles.editButton}
        onClick={event => {
          event.stopPropagation();
          onEditChapterName();
        }}
      >
        <img src={LineEdit.src} className={styles.editIcon} />
      </button>
    </button>
  );
};

export default ButtonEpisodeInfo;
