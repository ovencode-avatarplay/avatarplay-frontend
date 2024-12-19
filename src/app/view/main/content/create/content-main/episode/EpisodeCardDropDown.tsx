import React, {useEffect, useState} from 'react';
import styles from './EpisodeCardDropDown.module.css';
import EditIcon from '@mui/icons-material/Edit';
import SwapVertIcon from '@mui/icons-material/SwapVert';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DeleteIcon from '@mui/icons-material/Delete';
import {EpisodeInfo, setCurrentEpisodeInfo, updateEpisodeInfo} from '@/redux-store/slices/EpisodeInfo';
import {useDispatch} from 'react-redux';
import {LineArrowSwap, LineCopy, LineDelete, LineEdit, LinePreview} from '@ui/Icons';
import EpisodeSetNamePopup from './episode-initialize/EpisodeSetNamePopup';
import {removeEpisode, updateEpisodeInfoInContent} from '@/redux-store/slices/ContentInfo';

interface EpisodeCardDropDownProps {
  episodeInfo: EpisodeInfo;
  open: boolean;
  close: () => void;
  save: () => void;
}

const EpisodeCardDropDown: React.FC<EpisodeCardDropDownProps> = ({save, episodeInfo, open, close}) => {
  const dispatch = useDispatch();
  useEffect(() => {
    if (open) {
      dispatch(setCurrentEpisodeInfo(episodeInfo));
    }
  }, [episodeInfo]);
  const [isEpisodeNameOn, setIsEpisodeNameOn] = useState<boolean>(false);

  const handleSetEpisodeNameComplete = (name: string) => {
    // Redux 상태 업데이트
    dispatch(updateEpisodeInfo({name: name}));
    setTimeout(() => {
      save();
      setIsEpisodeNameOn(false);
      close();
    }, 0); // 상태 반영 이후 실행
  };

  const HandleRemoveEpisode = (id: number) => {
    dispatch(removeEpisode(id));
    close();
  };

  return (
    <div className={styles.dropdown}>
      <div
        className={styles.dropdownItem}
        onClick={() => {
          setIsEpisodeNameOn(true);
        }}
      >
        <span className={styles.label}>Rename</span>
        <img src={LineEdit.src} className={styles.icon} />
      </div>
      <div className={styles.dropdownItem}>
        <span className={styles.label}>Change Order</span>
        <img src={LineArrowSwap.src} style={{transform: 'rotate(90deg)'}} className={styles.icon} />
      </div>
      <div className={styles.dropdownItem}>
        <span className={styles.label}>Preview this Episode</span>
        <img src={LinePreview.src} className={styles.icon} />
      </div>
      <div className={styles.dropdownItem}>
        <span className={styles.label}>Duplicate</span>
        <img src={LineCopy.src} className={styles.icon} />
      </div>
      <div
        className={`${styles.dropdownItem} ${styles.deleteItemLabel}`}
        onClick={() => HandleRemoveEpisode(episodeInfo.id)}
      >
        <span className={styles.deleteItemLabel}>Delete</span>
        <img src={LineDelete.src} className={styles.deleteItemIcon} />
      </div>
      <EpisodeSetNamePopup
        open={isEpisodeNameOn}
        onClickCancel={() => {
          setIsEpisodeNameOn(false);
        }}
        onClickComplete={handleSetEpisodeNameComplete}
      />
    </div>
  );
};

export default EpisodeCardDropDown;
