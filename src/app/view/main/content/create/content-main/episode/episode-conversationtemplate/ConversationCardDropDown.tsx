import React, {useEffect, useState} from 'react';
import styles from './ConversationCardDropDown.module.css';
import EditIcon from '@mui/icons-material/Edit';
import SwapVertIcon from '@mui/icons-material/SwapVert';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DeleteIcon from '@mui/icons-material/Delete';
import {EpisodeInfo, setCurrentEpisodeInfo, updateEpisodeInfo} from '@/redux-store/slices/EpisodeInfo';
import {useDispatch, useSelector} from 'react-redux';
import {LineArrowSwap, LineCopy, LineDelete, LineEdit, LinePreview} from '@ui/Icons';
import {
  ChapterInfo,
  duplicateEpisode,
  removeEpisode,
  updateEpisodeInfoInContent,
} from '@/redux-store/slices/ContentInfo';
import {RootState, store} from '@/redux-store/ReduxStore';

interface EpisodeCardDropDownProps {
  open: boolean;
  close: () => void;
  remove: () => void;
  duplicate: () => void;
  changePriority: () => void;
}

const EpisodeCardDropDown: React.FC<EpisodeCardDropDownProps> = ({open, duplicate, remove, close, changePriority}) => {
  const dispatch = useDispatch();

  const HandleDuplicateEpisode = (id: number) => {
    dispatch(duplicateEpisode(id));
    close();
  };

  return (
    <div className={styles.dropdown}>
      <div
        className={styles.dropdownItem}
        onClick={() => {
          changePriority();
          close();
        }}
      >
        <span className={styles.label}>Change Priority</span>
        <img src={LineArrowSwap.src} className={styles.icon} />
      </div>
      <div
        className={styles.dropdownItem}
        onClick={() => {
          duplicate();
          close();
        }}
      >
        <span className={styles.label}>Duplicate</span>
        <img src={LineCopy.src} className={styles.icon} />
      </div>
      <div
        className={`${styles.dropdownItem} ${styles.deleteItemLabel}`}
        onClick={() => {
          remove();
        }}
      >
        <span className={styles.deleteItemLabel}>Delete</span>
        <img src={LineDelete.src} className={styles.deleteItemIcon} />
      </div>
    </div>
  );
};

export default EpisodeCardDropDown;
