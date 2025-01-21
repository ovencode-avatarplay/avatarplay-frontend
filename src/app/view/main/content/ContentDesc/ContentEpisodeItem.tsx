import React from 'react';
import styles from './ContentEpisodeItem.module.css';
import {Typography} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ImageIcon from '@mui/icons-material/Image';
import {useDispatch} from 'react-redux';
import {setDrawerEpisodeId} from '@/redux-store/slices/DrawerContentDescSlice';
import {EpisodeCardProps} from './ContentDescType';

const ContentEpisodeItem: React.FC<EpisodeCardProps> = ({
  episodeId,
  intimacy,
  imageCount,
  thumbnail,
  name,
  desc,
  isLock,
}) => {
  const dispatch = useDispatch();

  const handleOpenEpisodeDrawer = () => {
    if (!isLock) {
      dispatch(setDrawerEpisodeId(episodeId));
    }
  };

  return (
    <div className={`${styles.episodeCard} ${isLock ? styles.dimmed : ''}`} onClick={handleOpenEpisodeDrawer}>
      {/* 이미지 박스 */}
      <div className={styles.imageBox}>
        <img src={thumbnail} alt={`Episode ${episodeId}`} className={styles.episodeImage} />
        {/* <div className={styles.imageOverlay}>
          <div className={styles.iconInfo}>
            <FavoriteIcon color="error" />
            <Typography variant="body2" className={styles.iconText}>
              {Math.floor(intimacy)}%
            </Typography>
          </div>
          <div className={styles.iconInfo}>
            <ImageIcon color="action" />
            <Typography variant="body2" className={styles.iconText}>
              {imageCount}
            </Typography>
          </div>
        </div> */}
      </div>

      {/* 텍스트 박스 */}
      <div className={styles.textBox}>
        <Typography variant="h6" className={styles.title}>
          {name}
        </Typography>
        <Typography variant="body2" className={styles.description}>
          {desc}
        </Typography>
      </div>

      {/* 잠김 아이콘 */}
      {/* {isLock && (
        <div className={styles.lockIconWrapper}>
          <img src="/ui/Icons/Audio/Pause.svg" alt="Pause Icon" />
        </div>
      )} */}
    </div>
  );
};

export default ContentEpisodeItem;
